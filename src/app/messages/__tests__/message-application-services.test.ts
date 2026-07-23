import { describe, expect, it } from "vitest";

import { createCreateMessageService } from "../../../lib/services/messages/create-message-service";
import { createListMessagesService } from "../../../lib/services/messages/list-messages-service";
import type {
  CreateMessageNotificationInput,
  CreateMessageRecordInput,
  CreatedMessageRecord,
  FindAccessibleMessageProjectInput,
  FindRecentMessagesInput,
  MessageProjectRecord,
  MessageRepository,
  MessageSenderRecord,
  RecentMessageRecord, 
} from '../../../lib/services/messages/message-repository';

class InMemoryMessageRepository implements MessageRepository {
  sender: MessageSenderRecord | null = {
    id: "admin-1",
    firstName: "Admin",
    lastName: "User",
    workspaceId: "workspace-1",
  };

  project: MessageProjectRecord | null = {
    id: "project-1",
    name: "Website Redesign",
    workspaceId: "workspace-1",
    clientId: "client-1",
    ownerId: "admin-1",

    client: {
      id: "client-1",
      firstName: "Client",
      lastName: "User",
      email: "client@example.com",
    },

    owner: {
      id: "admin-1",
      firstName: "Admin",
      lastName: "User",
      email: "admin@example.com",
    },
  };

  createdMessage: CreatedMessageRecord | null = null;

  notificationInput: CreateMessageNotificationInput | null = null;

  accessibleProjectInput: FindAccessibleMessageProjectInput | null = null;

  recentMessagesInput: FindRecentMessagesInput | null = null;

  async findSender(): Promise<MessageSenderRecord | null> {
    return this.sender;
  }

  async findAccessibleProject(
    input: FindAccessibleMessageProjectInput,
  ): Promise<MessageProjectRecord | null> {
    this.accessibleProjectInput = input;

    return this.project;
  }

  async create(input: CreateMessageRecordInput): Promise<CreatedMessageRecord> {
    const message = {
      id: "message-1",
      projectId: input.projectId,
      senderId: input.senderId,
      content: input.content,
      createdAt: new Date("2026-07-22T12:00:00.000Z"),
    };

    this.createdMessage = message;

    return message;
  }

  async createNotification(
    input: CreateMessageNotificationInput,
  ): Promise<void> {
    this.notificationInput = input;
  }

  async findRecent(
    input: FindRecentMessagesInput,
  ): Promise<RecentMessageRecord[]> {
    this.recentMessagesInput = input;

    return [];
  }
}

describe("createMessageService", () => {
  it("allows a manager to message a workspace project", async () => {
    const repository = new InMemoryMessageRepository();

    const service = createCreateMessageService(repository);

    const result = await service({
      workspaceId: "workspace-1",
      projectId: "project-1",
      senderId: "admin-1",
      content: " Project update ",
      canManageProjects: true,
      sessionSenderName: "Admin User",
    });

    expect(result.success).toBe(true);

    expect(repository.accessibleProjectInput).toEqual({
      workspaceId: "workspace-1",
      projectId: "project-1",
      viewerUserId: "admin-1",
      canManageProjects: true,
    });

    expect(repository.createdMessage?.content).toBe("Project update");

    expect(repository.notificationInput).toEqual({
      userId: "client-1",
      projectId: "project-1",
      preview: "Project update",
    });
  });

  it("sends client messages to the project owner", async () => {
    const repository = new InMemoryMessageRepository();

    repository.sender = {
      id: "client-1",
      firstName: "Client",
      lastName: "User",
      workspaceId: "workspace-1",
    };

    const service = createCreateMessageService(repository);

    const result = await service({
      workspaceId: "workspace-1",
      projectId: "project-1",
      senderId: "client-1",
      content: "Can you review this?",
      canManageProjects: false,
    });

    expect(result.success).toBe(true);

    expect(repository.accessibleProjectInput?.canManageProjects).toBe(false);

    expect(repository.notificationInput?.userId).toBe("admin-1");

    if (result.success) {
      expect(result.emailDelivery?.recipientEmail).toBe("admin@example.com");
    }
  });

  it("rejects an inaccessible project", async () => {
    const repository = new InMemoryMessageRepository();

    repository.project = null;

    const service = createCreateMessageService(repository);

    const result = await service({
      workspaceId: "workspace-1",
      projectId: "foreign-project",
      senderId: "client-1",
      content: "Unauthorized message",
      canManageProjects: false,
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.reason).toBe("PROJECT_NOT_FOUND");
    }

    expect(repository.createdMessage).toBeNull();
  });

  it("does not notify a sender who is also the recipient", async () => {
    const repository = new InMemoryMessageRepository();

    repository.project = {
      ...repository.project!,
      clientId: "admin-1",

      client: {
        id: "admin-1",
        firstName: "Admin",
        lastName: "User",
        email: "admin@example.com",
      },
    };

    const service = createCreateMessageService(repository);

    const result = await service({
      workspaceId: "workspace-1",
      projectId: "project-1",
      senderId: "admin-1",
      content: "Internal note",
      canManageProjects: true,
    });

    expect(result.success).toBe(true);
    expect(repository.notificationInput).toBeNull();

    if (result.success) {
      expect(result.emailDelivery).toBeNull();
    }
  });
});

describe("listMessagesService", () => {
  it("lists all workspace messages for managers", async () => {
    const repository = new InMemoryMessageRepository();

    const service = createListMessagesService(repository);

    await service({
      workspaceId: "workspace-1",
      viewerUserId: "admin-1",
      canManageProjects: true,
    });

    expect(repository.recentMessagesInput).toEqual({
      workspaceId: "workspace-1",
      clientId: undefined,
      limit: 25,
    });
  });

  it("limits clients to their assigned projects", async () => {
    const repository = new InMemoryMessageRepository();

    const service = createListMessagesService(repository);

    await service({
      workspaceId: "workspace-1",
      viewerUserId: "client-1",
      canManageProjects: false,
      limit: 10,
    });

    expect(repository.recentMessagesInput).toEqual({
      workspaceId: "workspace-1",
      clientId: "client-1",
      limit: 10,
    });
  });
});
