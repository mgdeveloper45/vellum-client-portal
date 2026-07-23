import { describe, expect, it } from "vitest";

import { createCreateProjectService } from "../create-project-service";
import { createDeleteProjectService } from "../delete-project-service";
import { createListProjectsService } from "../list-projects-service";
import type {
  CreateProjectRecordInput,
  FindProjectsInput,
  ProjectAuditRecord,
  ProjectDependencyCounts,
  ProjectDetailRecord,
  ProjectEditRecord,
  ProjectListRecord,
  ProjectPersonRecord,
  ProjectRepository,
  UpdateProjectRecordInput,
} from "../project-repository";
import { createUpdateProjectService } from "../update-project-service";

class InMemoryProjectRepository implements ProjectRepository {
  clientIsValid = true;
  ownerIsValid = true;
  updateResult: ProjectAuditRecord | null = null;
  deleteResult: ProjectAuditRecord | null = null;

  dependencies: ProjectDependencyCounts | null = {
    files: 0,
    milestones: 0,
    messages: 0,
    invoices: 0,
    proposals: 0,
  };

  createdInput: CreateProjectRecordInput | null = null;

  updatedInput: UpdateProjectRecordInput | null = null;

  lastFindManyInput: FindProjectsInput | null = null;

  async findMany(input: FindProjectsInput): Promise<ProjectListRecord[]> {
    this.lastFindManyInput = input;
    return [];
  }

  async findDetail(): Promise<ProjectDetailRecord | null> {
    return null;
  }

  async findForEdit(): Promise<ProjectEditRecord | null> {
    return null;
  }

  async findWorkspaceClients(): Promise<ProjectPersonRecord[]> {
    return [];
  }

  async isWorkspaceClient(): Promise<boolean> {
    return this.clientIsValid;
  }

  async isWorkspaceProjectOwner(): Promise<boolean> {
    return this.ownerIsValid;
  }

  async create(input: CreateProjectRecordInput): Promise<ProjectAuditRecord> {
    this.createdInput = input;

    return {
      id: "project-1",
      name: input.name,
      status: input.status,
      clientId: input.clientId,
    };
  }

  async update(
    input: UpdateProjectRecordInput,
  ): Promise<ProjectAuditRecord | null> {
    this.updatedInput = input;
    return this.updateResult;
  }

  async findDependencies(): Promise<ProjectDependencyCounts | null> {
    return this.dependencies;
  }

  async delete(): Promise<ProjectAuditRecord | null> {
    return this.deleteResult;
  }
}

describe("createProjectService", () => {
  it("creates a workspace-scoped project", async () => {
    const repository = new InMemoryProjectRepository();

    const service = createCreateProjectService(repository);

    const result = await service({
      workspaceId: "workspace-1",
      name: " Website Redesign ",
      description: " Redesign the website ",
      status: "PLANNING",
      ownerId: "owner-1",
      clientId: "client-1",
    });

    expect(result).toEqual({
      success: true,
      project: {
        id: "project-1",
        name: "Website Redesign",
        status: "PLANNING",
        clientId: "client-1",
      },
    });

    expect(repository.createdInput).toEqual({
      workspaceId: "workspace-1",
      name: "Website Redesign",
      description: "Redesign the website",
      status: "PLANNING",
      ownerId: "owner-1",
      clientId: "client-1",
    });
  });

  it("rejects a client from another workspace", async () => {
    const repository = new InMemoryProjectRepository();

    repository.clientIsValid = false;

    const service = createCreateProjectService(repository);

    const result = await service({
      workspaceId: "workspace-1",
      name: "Project",
      description: "Description",
      status: "ACTIVE",
      ownerId: "owner-1",
      clientId: "foreign-client",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.reason).toBe("INVALID_CLIENT");
    }

    expect(repository.createdInput).toBeNull();
  });

  it("rejects an ineligible project owner", async () => {
    const repository = new InMemoryProjectRepository();

    repository.ownerIsValid = false;

    const service = createCreateProjectService(repository);

    const result = await service({
      workspaceId: "workspace-1",
      name: "Project",
      description: "Description",
      status: "ACTIVE",
      ownerId: "client-user",
      clientId: "client-1",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.reason).toBe("INVALID_OWNER");
    }
  });
});

describe("updateProjectService", () => {
  it("updates client and owner as validated fields", async () => {
    const repository = new InMemoryProjectRepository();

    repository.updateResult = {
      id: "project-1",
      name: "Updated Project",
      status: "ACTIVE",
      clientId: "client-2",
    };

    const service = createUpdateProjectService(repository);

    const result = await service({
      workspaceId: "workspace-1",
      projectId: "project-1",
      name: "Updated Project",
      description: "Updated description",
      status: "ACTIVE",
      ownerId: "owner-2",
      clientId: "client-2",
    });

    expect(result.success).toBe(true);

    expect(repository.updatedInput).toEqual({
      workspaceId: "workspace-1",
      projectId: "project-1",
      name: "Updated Project",
      description: "Updated description",
      status: "ACTIVE",
      ownerId: "owner-2",
      clientId: "client-2",
    });
  });

  it("returns not found for another workspace", async () => {
    const repository = new InMemoryProjectRepository();

    const service = createUpdateProjectService(repository);

    const result = await service({
      workspaceId: "workspace-1",
      projectId: "foreign-project",
      name: "Project",
      description: "Description",
      status: "ACTIVE",
      ownerId: "owner-1",
      clientId: "client-1",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.reason).toBe("PROJECT_NOT_FOUND");
    }
  });
});

describe("deleteProjectService", () => {
  it("deletes an empty project", async () => {
    const repository = new InMemoryProjectRepository();

    repository.deleteResult = {
      id: "project-1",
      name: "Project",
      status: "PLANNING",
      clientId: "client-1",
    };

    const service = createDeleteProjectService(repository);

    const result = await service({
      workspaceId: "workspace-1",
      projectId: "project-1",
    });

    expect(result.success).toBe(true);
  });

  it("rejects deletion when dependencies exist", async () => {
    const repository = new InMemoryProjectRepository();

    repository.dependencies = {
      files: 1,
      milestones: 0,
      messages: 2,
      invoices: 0,
      proposals: 0,
    };

    const service = createDeleteProjectService(repository);

    const result = await service({
      workspaceId: "workspace-1",
      projectId: "project-1",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.reason).toBe("PROJECT_HAS_DEPENDENCIES");
    }
  });
});

describe("listProjectsService", () => {
  it("lists all workspace projects for managers", async () => {
    const repository = new InMemoryProjectRepository();

    const service = createListProjectsService(repository);

    await service({
      workspaceId: "workspace-1",
      viewerUserId: "admin-1",
      canManageProjects: true,
    });

    expect(repository.lastFindManyInput).toEqual({
      workspaceId: "workspace-1",
      clientId: undefined,
    });
  });

  it("limits clients to their own projects", async () => {
    const repository = new InMemoryProjectRepository();

    const service = createListProjectsService(repository);

    await service({
      workspaceId: "workspace-1",
      viewerUserId: "client-1",
      canManageProjects: false,
    });

    expect(repository.lastFindManyInput).toEqual({
      workspaceId: "workspace-1",
      clientId: "client-1",
    });
  });
});
