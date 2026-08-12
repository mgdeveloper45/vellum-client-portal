import type { BookingRepository } from "./booking-repository";
import type { ClientRepository } from "@/lib/services/clients/client-repository";
import type {
  ProjectRepository,
  ProjectStatus,
} from "@/lib/services/projects/project-repository";

export interface CreateProjectFromBookingRequest {
  bookingId: string;
  workspaceId: string;
  ownerId: string;
}

export type CreateProjectFromBookingResult =
  | {
      success: true;
      projectId: string;
      alreadyExisted: boolean;
    }
  | {
      success: false;
      reason:
        | "INVALID_BOOKING"
        | "INVALID_WORKSPACE"
        | "INVALID_OWNER"
        | "BOOKING_NOT_FOUND"
        | "CLIENT_NOT_FOUND"
        | "PROJECT_CREATE_FAILED"
        | "BOOKING_LINK_FAILED";
      message: string;
    };

interface Dependencies {
  bookingRepository: BookingRepository;
  clientRepository: ClientRepository;
  projectRepository: ProjectRepository;
}

export function createCreateProjectFromBookingService({
  bookingRepository,
  clientRepository,
  projectRepository,
}: Dependencies) {
  return async function createProjectFromBooking(
    request: CreateProjectFromBookingRequest,
  ): Promise<CreateProjectFromBookingResult> {
    const bookingId = request.bookingId.trim();
    const workspaceId = request.workspaceId.trim();
    const ownerId = request.ownerId.trim();

    if (!bookingId) {
      return {
        success: false,
        reason: "INVALID_BOOKING",
        message: "A valid booking is required.",
      };
    }

    if (!workspaceId) {
      return {
        success: false,
        reason: "INVALID_WORKSPACE",
        message: "A valid workspace is required.",
      };
    }

    if (!ownerId) {
      return {
        success: false,
        reason: "INVALID_OWNER",
        message: "A valid project owner is required.",
      };
    }

    const booking = await bookingRepository.findForProjectCreation(
      bookingId,
      workspaceId,
    );

    if (!booking) {
      return {
        success: false,
        reason: "BOOKING_NOT_FOUND",
        message: "The booking does not exist in this workspace.",
      };
    }

    /*
     * Idempotency:
     * if this booking already owns a project, return that project
     * instead of creating another one.
     */
    if (booking.projectId) {
      return {
        success: true,
        projectId: booking.projectId,
        alreadyExisted: true,
      };
    }

    const client = await clientRepository.findWorkspaceClientByEmail({
      workspaceId,
      email: booking.customerEmail.trim().toLowerCase(),
    });

    if (!client) {
      return {
        success: false,
        reason: "CLIENT_NOT_FOUND",
        message:
          "No active workspace client matches the booking customer email.",
      };
    }

    const ownerIsValid = await projectRepository.isWorkspaceProjectOwner(
      workspaceId,
      ownerId,
    );

    if (!ownerIsValid) {
      return {
        success: false,
        reason: "INVALID_OWNER",
        message:
          "The selected project owner is not an eligible workspace member.",
      };
    }

    const status: ProjectStatus = "PLANNING";

    let project;

    try {
      project = await projectRepository.create({
        workspaceId,
        name: `${booking.customerName} — ${booking.service.name}`,
        description: `Created from booking ${booking.id}.`,
        status,
        ownerId,
        clientId: client.id,
      });
    } catch {
      return {
        success: false,
        reason: "PROJECT_CREATE_FAILED",
        message: "The project could not be created.",
      };
    }

    const linked = await bookingRepository.linkToProject({
      bookingId: booking.id,
      workspaceId,
      projectId: project.id,
    });

    if (!linked) {
      return {
        success: false,
        reason: "BOOKING_LINK_FAILED",
        message:
          "The project was created but could not be linked to the booking.",
      };
    }

    return {
      success: true,
      projectId: project.id,
      alreadyExisted: false,
    };
  };
}

export type CreateProjectFromBookingService = ReturnType<
  typeof createCreateProjectFromBookingService
>;
