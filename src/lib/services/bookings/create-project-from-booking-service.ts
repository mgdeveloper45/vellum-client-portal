import type { BookingRepository } from "@/lib/services/booking/booking-repository";
import type { ClientRepository } from "@/lib/services/clients/client-repository";
import type {
  CreateProjectRequest,
  CreateProjectResult,
} from "@/lib/services/projects/create-project-service";

export interface CreateProjectFromBookingRequest {
  workspaceId: string;
  bookingId: string;
  ownerId: string;
}

export type CreateProjectFromBookingResult =
  | {
      success: true;
      projectId: string;
    }
  | {
      success: false;
      reason:
        | "INVALID_WORKSPACE"
        | "INVALID_BOOKING"
        | "INVALID_OWNER"
        | "BOOKING_NOT_FOUND"
        | "CLIENT_NOT_FOUND"
        | "PROJECT_ALREADY_EXISTS"
        | "PROJECT_CREATE_FAILED"
        | "BOOKING_LINK_FAILED";
      message: string;
    };

type ProjectCreator = (
  request: CreateProjectRequest,
) => Promise<CreateProjectResult>;

export interface CreateProjectFromBookingDependencies {
  bookingRepository: BookingRepository;
  clientRepository: ClientRepository;
  createProject: ProjectCreator;
}

export function createCreateProjectFromBookingService({
  bookingRepository,
  clientRepository,
  createProject,
}: CreateProjectFromBookingDependencies) {
  return async function createProjectFromBooking(
    request: CreateProjectFromBookingRequest,
  ): Promise<CreateProjectFromBookingResult> {
    const workspaceId = request.workspaceId.trim();
    const bookingId = request.bookingId.trim();
    const ownerId = request.ownerId.trim();

    if (!workspaceId) {
      return {
        success: false,
        reason: "INVALID_WORKSPACE",
        message: "A valid workspace is required.",
      };
    }

    if (!bookingId) {
      return {
        success: false,
        reason: "INVALID_BOOKING",
        message: "A valid booking is required.",
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

    if (booking.projectId) {
      return {
        success: false,
        reason: "PROJECT_ALREADY_EXISTS",
        message: "This booking is already linked to a project.",
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
          "A client account must exist for this booking before creating a project.",
      };
    }

    const projectResult = await createProject({
      workspaceId,
      name: `${booking.customerName} — ${booking.service.name}`,
      description: `Project created from booking ${booking.id}.`,
      status: "PLANNING",
      ownerId,
      clientId: client.id,
    });

    if (!projectResult.success) {
      return {
        success: false,
        reason: "PROJECT_CREATE_FAILED",
        message: projectResult.message,
      };
    }

    const linked = await bookingRepository.linkToProject({
      bookingId: booking.id,
      workspaceId,
      projectId: projectResult.project.id,
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
      projectId: projectResult.project.id,
    };
  };
}
