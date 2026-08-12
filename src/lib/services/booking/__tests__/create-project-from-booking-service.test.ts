import { beforeEach, describe, expect, it, vi } from "vitest";

import type { BookingRepository } from "../booking-repository";
import type { ClientRepository } from "@/lib/services/clients/client-repository";
import type { ProjectRepository } from "@/lib/services/projects/project-repository";
import { createCreateProjectFromBookingService } from "../create-project-from-booking-service";

describe("createProjectFromBookingService", () => {
  let bookingRepository: BookingRepository;
  let clientRepository: ClientRepository;
  let projectRepository: ProjectRepository;

  beforeEach(() => {
    bookingRepository = {
      create: vi.fn(),
      findForProjectCreation: vi.fn(),
      linkToProject: vi.fn(),
      findForReschedule: vi.fn(),
      reschedule: vi.fn(),
      findForStatusUpdate: vi.fn(),
      updateStatus: vi.fn(),
    };

    clientRepository = {
      findMany: vi.fn(),
      findDetail: vi.fn(),
      findForEdit: vi.fn(),
      findByEmail: vi.fn(),
      findWorkspaceClientByEmail: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      countProjects: vi.fn(),
      delete: vi.fn(),
    };

    projectRepository = {
      findMany: vi.fn(),
      findDetail: vi.fn(),
      findForEdit: vi.fn(),
      findWorkspaceClients: vi.fn(),
      isWorkspaceClient: vi.fn(),
      isWorkspaceProjectOwner: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      findDependencies: vi.fn(),
      delete: vi.fn(),
    };
  });

  function buildService() {
    return createCreateProjectFromBookingService({
      bookingRepository,
      clientRepository,
      projectRepository,
    });
  }

  it("creates and links a project from a booking", async () => {
    vi.mocked(bookingRepository.findForProjectCreation).mockResolvedValue({
      id: "booking-1",
      workspaceId: "workspace-1",
      customerName: "Jordan Smith",
      customerEmail: "Jordan@Example.com",
      projectId: null,
      service: {
        name: "Consultation",
      },
    });

    vi.mocked(clientRepository.findWorkspaceClientByEmail).mockResolvedValue({
      id: "client-1",
    });

    vi.mocked(projectRepository.isWorkspaceProjectOwner).mockResolvedValue(
      true,
    );

    vi.mocked(projectRepository.create).mockResolvedValue({
      id: "project-1",
      name: "Jordan Smith — Consultation",
      status: "PLANNING",
      clientId: "client-1",
    });

    vi.mocked(bookingRepository.linkToProject).mockResolvedValue(true);

    const service = buildService();

    const result = await service({
      bookingId: "booking-1",
      workspaceId: "workspace-1",
      ownerId: "owner-1",
    });

    expect(clientRepository.findWorkspaceClientByEmail).toHaveBeenCalledWith({
      workspaceId: "workspace-1",
      email: "jordan@example.com",
    });

    expect(projectRepository.isWorkspaceProjectOwner).toHaveBeenCalledWith(
      "workspace-1",
      "owner-1",
    );

    expect(projectRepository.create).toHaveBeenCalledWith({
      workspaceId: "workspace-1",
      name: "Jordan Smith — Consultation",
      description: "Created from booking booking-1.",
      status: "PLANNING",
      ownerId: "owner-1",
      clientId: "client-1",
    });

    expect(bookingRepository.linkToProject).toHaveBeenCalledWith({
      bookingId: "booking-1",
      workspaceId: "workspace-1",
      projectId: "project-1",
    });

    expect(result).toEqual({
      success: true,
      projectId: "project-1",
      alreadyExisted: false,
    });
  });

  it("returns the existing project when the booking is already linked", async () => {
    vi.mocked(bookingRepository.findForProjectCreation).mockResolvedValue({
      id: "booking-1",
      workspaceId: "workspace-1",
      customerName: "Jordan Smith",
      customerEmail: "jordan@example.com",
      projectId: "project-existing",
      service: {
        name: "Consultation",
      },
    });

    const service = buildService();

    const result = await service({
      bookingId: "booking-1",
      workspaceId: "workspace-1",
      ownerId: "owner-1",
    });

    expect(result).toEqual({
      success: true,
      projectId: "project-existing",
      alreadyExisted: true,
    });

    expect(clientRepository.findWorkspaceClientByEmail).not.toHaveBeenCalled();

    expect(projectRepository.create).not.toHaveBeenCalled();
    expect(bookingRepository.linkToProject).not.toHaveBeenCalled();
  });

  it("rejects a booking outside the workspace", async () => {
    vi.mocked(bookingRepository.findForProjectCreation).mockResolvedValue(null);

    const service = buildService();

    const result = await service({
      bookingId: "booking-1",
      workspaceId: "workspace-1",
      ownerId: "owner-1",
    });

    expect(result).toEqual({
      success: false,
      reason: "BOOKING_NOT_FOUND",
      message: "The booking does not exist in this workspace.",
    });

    expect(projectRepository.create).not.toHaveBeenCalled();
  });

  it("rejects when no workspace client matches the booking email", async () => {
    vi.mocked(bookingRepository.findForProjectCreation).mockResolvedValue({
      id: "booking-1",
      workspaceId: "workspace-1",
      customerName: "Jordan Smith",
      customerEmail: "jordan@example.com",
      projectId: null,
      service: {
        name: "Consultation",
      },
    });

    vi.mocked(clientRepository.findWorkspaceClientByEmail).mockResolvedValue(
      null,
    );

    const service = buildService();

    const result = await service({
      bookingId: "booking-1",
      workspaceId: "workspace-1",
      ownerId: "owner-1",
    });

    expect(result).toEqual({
      success: false,
      reason: "CLIENT_NOT_FOUND",
      message: "No active workspace client matches the booking customer email.",
    });

    expect(projectRepository.create).not.toHaveBeenCalled();
  });

  it("rejects an ineligible project owner", async () => {
    vi.mocked(bookingRepository.findForProjectCreation).mockResolvedValue({
      id: "booking-1",
      workspaceId: "workspace-1",
      customerName: "Jordan Smith",
      customerEmail: "jordan@example.com",
      projectId: null,
      service: {
        name: "Consultation",
      },
    });

    vi.mocked(clientRepository.findWorkspaceClientByEmail).mockResolvedValue({
      id: "client-1",
    });

    vi.mocked(projectRepository.isWorkspaceProjectOwner).mockResolvedValue(
      false,
    );

    const service = buildService();

    const result = await service({
      bookingId: "booking-1",
      workspaceId: "workspace-1",
      ownerId: "owner-1",
    });

    expect(result).toEqual({
      success: false,
      reason: "INVALID_OWNER",
      message:
        "The selected project owner is not an eligible workspace member.",
    });

    expect(projectRepository.create).not.toHaveBeenCalled();
  });

  it("reports project persistence failure", async () => {
    vi.mocked(bookingRepository.findForProjectCreation).mockResolvedValue({
      id: "booking-1",
      workspaceId: "workspace-1",
      customerName: "Jordan Smith",
      customerEmail: "jordan@example.com",
      projectId: null,
      service: {
        name: "Consultation",
      },
    });

    vi.mocked(clientRepository.findWorkspaceClientByEmail).mockResolvedValue({
      id: "client-1",
    });

    vi.mocked(projectRepository.isWorkspaceProjectOwner).mockResolvedValue(
      true,
    );

    vi.mocked(projectRepository.create).mockRejectedValue(
      new Error("database unavailable"),
    );

    const service = buildService();

    const result = await service({
      bookingId: "booking-1",
      workspaceId: "workspace-1",
      ownerId: "owner-1",
    });

    expect(result).toEqual({
      success: false,
      reason: "PROJECT_CREATE_FAILED",
      message: "The project could not be created.",
    });

    expect(bookingRepository.linkToProject).not.toHaveBeenCalled();
  });

  it("reports failure when the booking cannot be linked", async () => {
    vi.mocked(bookingRepository.findForProjectCreation).mockResolvedValue({
      id: "booking-1",
      workspaceId: "workspace-1",
      customerName: "Jordan Smith",
      customerEmail: "jordan@example.com",
      projectId: null,
      service: {
        name: "Consultation",
      },
    });

    vi.mocked(clientRepository.findWorkspaceClientByEmail).mockResolvedValue({
      id: "client-1",
    });

    vi.mocked(projectRepository.isWorkspaceProjectOwner).mockResolvedValue(
      true,
    );

    vi.mocked(projectRepository.create).mockResolvedValue({
      id: "project-1",
      name: "Jordan Smith — Consultation",
      status: "PLANNING",
      clientId: "client-1",
    });

    vi.mocked(bookingRepository.linkToProject).mockResolvedValue(false);

    const service = buildService();

    const result = await service({
      bookingId: "booking-1",
      workspaceId: "workspace-1",
      ownerId: "owner-1",
    });

    expect(result).toEqual({
      success: false,
      reason: "BOOKING_LINK_FAILED",
      message:
        "The project was created but could not be linked to the booking.",
    });
  });
});
