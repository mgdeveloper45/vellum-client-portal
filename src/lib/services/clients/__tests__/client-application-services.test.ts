import { describe, expect, it } from "vitest";
import bcrypt from "bcryptjs";
import type {
  ClientDetailRecord,
  ClientEditRecord,
  ClientRepository,
  ClientSummaryRecord,
  CreateClientRecordInput,
  DeleteClientRecordInput,
  FindClientsInput,
  UpdateClientRecordInput,
} from "../client-repository";
import { createCreateClientService } from "../create-client-service";
import { createDeleteClientService } from "../delete-client-service";
import {
  createGetClientDetailService,
  createGetClientForEditService,
} from "../get-client-service";
import { createListClientsService } from "../list-clients-service";
import { createUpdateClientService } from "../update-client-service";

class InMemoryClientRepository implements ClientRepository {
  summaries: ClientSummaryRecord[] = [];
  detail: ClientDetailRecord | null = null;
  editRecord: ClientEditRecord | null = null;
  existingEmailClientId: string | null = null;
  projectCount: number | null = 0;
  updateSucceeded = true;
  deleteSucceeded = true;

  createdInput: CreateClientRecordInput | null = null;
  updatedInput: UpdateClientRecordInput | null = null;
  deletedInput: DeleteClientRecordInput | null = null;
  lastFindManyInput: FindClientsInput | null = null;

  async findMany(input: FindClientsInput): Promise<ClientSummaryRecord[]> {
    this.lastFindManyInput = input;

    return this.summaries;
  }

  async findDetail(): Promise<ClientDetailRecord | null> {
    return this.detail;
  }

  async findForEdit(): Promise<ClientEditRecord | null> {
    return this.editRecord;
  }

  async findByEmail(): Promise<{
    id: string;
  } | null> {
    return this.existingEmailClientId
      ? {
          id: this.existingEmailClientId,
        }
      : null;
  }

  async findWorkspaceClientByEmail(): Promise<{
    id: string;
  } | null> {
    return null;
  }

  async create(input: CreateClientRecordInput): Promise<{
    id: string;
  }> {
    this.createdInput = input;

    return {
      id: "client-1",
    };
  }

  async update(input: UpdateClientRecordInput): Promise<boolean> {
    this.updatedInput = input;

    return this.updateSucceeded;
  }

  async countProjects(): Promise<number | null> {
    return this.projectCount;
  }

  async delete(input: DeleteClientRecordInput): Promise<boolean> {
    this.deletedInput = input;

    return this.deleteSucceeded;
  }
}

describe("createClientService", () => {
  it("creates a normalized client", async () => {
    const repository = new InMemoryClientRepository();

    const service = createCreateClientService({
      clientRepository: repository,
    });

    const result = await service({
      workspaceId: "workspace-1",
      firstName: " Marcus ",
      lastName: " Gillespie ",
      email: " Marcus@Example.com ",
      notes: " Important client ",
      clientStatus: "ACTIVE",
    });

    expect(result).toEqual({
      success: true,
      clientId: "client-1",
    });

    expect(repository.createdInput).toMatchObject({
      workspaceId: "workspace-1",
      firstName: "Marcus",
      lastName: "Gillespie",
      email: "marcus@example.com",
      notes: "Important client",
    });

    expect(repository.createdInput?.password).toEqual(expect.any(String));

    expect(
      await bcrypt.compare("password123", repository.createdInput!.password),
    ).toBe(true);
  });

  it("rejects a duplicate email", async () => {
    const repository = new InMemoryClientRepository();

    repository.existingEmailClientId = "user-1";

    const service = createCreateClientService({
      clientRepository: repository,
    });

    const result = await service({
      workspaceId: "workspace-1",
      firstName: "Marcus",
      lastName: "Gillespie",
      email: "marcus@example.com",
      notes: "",
      clientStatus: "ACTIVE",
    });

    expect(result).toEqual({
      success: false,
      reason: "EMAIL_ALREADY_EXISTS",
      message: "A user with this email already exists.",
    });

    expect(repository.createdInput).toBeNull();
  });
});

describe("updateClientService", () => {
  it("updates a client inside the workspace", async () => {
    const repository = new InMemoryClientRepository();

    const service = createUpdateClientService({
      clientRepository: repository,
    });

    const result = await service({
      workspaceId: "workspace-1",
      clientId: "client-1",
      firstName: "Marcus",
      lastName: "Gillespie",
      email: "Marcus@Example.com",
      notes: "Updated",
      isBlacklisted: true,
      clientStatus: "ACTIVE",
    });

    expect(result).toEqual({
      success: true,
      clientId: "client-1",
    });

    expect(repository.updatedInput?.email).toBe("marcus@example.com");
  });

  it("returns not found when the scoped update fails", async () => {
    const repository = new InMemoryClientRepository();

    repository.updateSucceeded = false;

    const service = createUpdateClientService({
      clientRepository: repository,
    });

    const result = await service({
      workspaceId: "workspace-1",
      clientId: "missing-client",
      firstName: "Marcus",
      lastName: "Gillespie",
      email: "marcus@example.com",
      notes: "",
      isBlacklisted: false,
      clientStatus: "ACTIVE",
    });

    expect(result).toEqual({
      success: false,
      reason: "CLIENT_NOT_FOUND",
      message: "The client does not exist in this workspace.",
    });
  });
});

describe("deleteClientService", () => {
  it("deletes a client with no projects", async () => {
    const repository = new InMemoryClientRepository();

    repository.projectCount = 0;

    const service = createDeleteClientService({
      clientRepository: repository,
    });

    const result = await service({
      workspaceId: "workspace-1",
      clientId: "client-1",
    });

    expect(result).toEqual({
      success: true,
    });

    expect(repository.deletedInput).toEqual({
      workspaceId: "workspace-1",
      clientId: "client-1",
    });
  });

  it("rejects deletion when the client has projects", async () => {
    const repository = new InMemoryClientRepository();

    repository.projectCount = 2;

    const service = createDeleteClientService({
      clientRepository: repository,
    });

    const result = await service({
      workspaceId: "workspace-1",
      clientId: "client-1",
    });

    expect(result).toEqual({
      success: false,
      reason: "CLIENT_HAS_PROJECTS",
      message: "Clients with existing projects cannot be deleted.",
    });

    expect(repository.deletedInput).toBeNull();
  });

  it("returns not found for another workspace's client", async () => {
    const repository = new InMemoryClientRepository();

    repository.projectCount = null;

    const service = createDeleteClientService({
      clientRepository: repository,
    });

    const result = await service({
      workspaceId: "workspace-1",
      clientId: "client-from-another-workspace",
    });

    expect(result).toEqual({
      success: false,
      reason: "CLIENT_NOT_FOUND",
      message: "The client does not exist in this workspace.",
    });
  });
});

describe("listClientsService", () => {
  it("lists all workspace clients for a manager", async () => {
    const repository = new InMemoryClientRepository();

    const service = createListClientsService({
      clientRepository: repository,
    });

    await service({
      workspaceId: "workspace-1",
      viewerUserId: "admin-1",
      canManageClients: true,
    });

    expect(repository.lastFindManyInput).toEqual({
      workspaceId: "workspace-1",
      clientId: undefined,
    });
  });

  it("limits a client viewer to their own record", async () => {
    const repository = new InMemoryClientRepository();

    const service = createListClientsService({
      clientRepository: repository,
    });

    await service({
      workspaceId: "workspace-1",
      viewerUserId: "client-1",
      canManageClients: false,
    });

    expect(repository.lastFindManyInput).toEqual({
      workspaceId: "workspace-1",
      clientId: "client-1",
    });
  });
});

describe("getClient services", () => {
  it("rejects one client viewing another client", async () => {
    const repository = new InMemoryClientRepository();

    const service = createGetClientDetailService({
      clientRepository: repository,
    });

    const result = await service({
      workspaceId: "workspace-1",
      clientId: "client-2",
      viewerUserId: "client-1",
      canManageClients: false,
    });

    expect(result).toEqual({
      success: false,
      reason: "FORBIDDEN",
      message: "You do not have permission to view this client.",
    });
  });

  it("returns a client for editing", async () => {
    const repository = new InMemoryClientRepository();

    repository.editRecord = {
      id: "client-1",
      firstName: "Marcus",
      lastName: "Gillespie",
      email: "marcus@example.com",
      notes: null,
      isBlacklisted: false,
      clientStatus: "ACTIVE",
    };

    const service = createGetClientForEditService({
      clientRepository: repository,
    });

    const result = await service({
      workspaceId: "workspace-1",
      clientId: "client-1",
    });

    expect(result).toEqual({
      success: true,
      client: repository.editRecord,
    });
  });
});
