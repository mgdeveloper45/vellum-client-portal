import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  getProjectForEditService,
  listProjectsService,
  updateProjectService,
} from "@/lib/services/projects/composition/project-services";
import { executeProjectStatusUpdateAction } from "../execute-project-status-update-action";

vi.mock("@/lib/services/projects/composition/project-services", () => ({
  getProjectForEditService: vi.fn(),
  listProjectsService: vi.fn(),
  updateProjectService: vi.fn(),
}));

const mockedGetProjectForEditService = vi.mocked(getProjectForEditService);

const mockedListProjectsService = vi.mocked(listProjectsService);

const mockedUpdateProjectService = vi.mocked(updateProjectService);

describe("executeProjectStatusUpdateAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates a matching project status", async () => {
    mockedListProjectsService.mockResolvedValue({
      success: true,
      projects: [
        {
          id: "project-1",
          name: "Kitchen Remodel",
          description: "Remodel the kitchen.",
          status: "ACTIVE",
          createdAt: new Date(),
          client: {
            id: "client-1",
            firstName: "John",
            lastName: "Smith",
          },
        },
      ],
    });

    mockedGetProjectForEditService.mockResolvedValue({
      success: true,
      project: {
        id: "project-1",
        name: "Kitchen Remodel",
        description: "Remodel the kitchen.",
        status: "ACTIVE",
        clientId: "client-1",
        ownerId: "owner-1",
      },
    });

    mockedUpdateProjectService.mockResolvedValue({
      success: true,
      project: {
        id: "project-1",
        name: "Kitchen Remodel",
        status: "COMPLETED",
        clientId: "client-1",
      },
    });

    const result = await executeProjectStatusUpdateAction({
      workspaceId: "workspace-1",
      userId: "user-1",
      command: "Mark Kitchen Remodel as completed.",
    });

    expect(mockedUpdateProjectService).toHaveBeenCalledWith({
      workspaceId: "workspace-1",
      projectId: "project-1",
      name: "Kitchen Remodel",
      description: "Remodel the kitchen.",
      status: "COMPLETED",
      ownerId: "owner-1",
      clientId: "client-1",
    });

    expect(result).toEqual({
      success: true,
      message: "Kitchen Remodel was updated to COMPLETED.",
    });
  });

  it("requires a status", async () => {
    const result = await executeProjectStatusUpdateAction({
      workspaceId: "workspace-1",
      userId: "user-1",
      command: "Update Kitchen Remodel.",
    });

    expect(result).toEqual({
      success: false,
      message: "I need more information before updating the project: status.",
    });

    expect(mockedListProjectsService).not.toHaveBeenCalled();
  });

  it("requires a matching project", async () => {
    mockedListProjectsService.mockResolvedValue({
      success: true,
      projects: [],
    });

    const result = await executeProjectStatusUpdateAction({
      workspaceId: "workspace-1",
      userId: "user-1",
      command: "Mark Kitchen Remodel as completed.",
    });

    expect(result).toEqual({
      success: false,
      message: "I couldn't determine which project you want to update.",
    });

    expect(mockedUpdateProjectService).not.toHaveBeenCalled();
  });
});
