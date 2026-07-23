export interface MessageSenderRecord {
  id: string;
  firstName: string;
  lastName: string;
  workspaceId: string | null;
}

export interface MessageRecipientRecord {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface MessageProjectRecord {
  id: string;
  name: string;
  workspaceId: string | null;
  clientId: string;
  ownerId: string;
  client: MessageRecipientRecord;
  owner: MessageRecipientRecord;
}

export interface CreatedMessageRecord {
  id: string;
  projectId: string;
  senderId: string;
  content: string;
  createdAt: Date;
}

export interface RecentMessageRecord {
  id: string;
  projectId: string;
  content: string;
  createdAt: Date;

  sender: {
    id: string;
    firstName: string;
    lastName: string;
  };

  project: {
    id: string;
    name: string;

    client: {
      id: string;
      firstName: string;
      lastName: string;
    };
  };
}

export interface FindMessageSenderInput {
  userId: string;
  workspaceId: string;
}

export interface FindAccessibleMessageProjectInput {
  projectId: string;
  workspaceId: string;
  viewerUserId: string;
  canManageProjects: boolean;
}

export interface CreateMessageRecordInput {
  projectId: string;
  senderId: string;
  content: string;
}

export interface CreateMessageNotificationInput {
  userId: string;
  projectId: string;
  preview: string;
}

export interface FindRecentMessagesInput {
  workspaceId: string;
  clientId?: string;
  limit: number;
}

export interface MessageRepository {
  findSender(
    input: FindMessageSenderInput,
  ): Promise<MessageSenderRecord | null>;

  findAccessibleProject(
    input: FindAccessibleMessageProjectInput,
  ): Promise<MessageProjectRecord | null>;

  create(input: CreateMessageRecordInput): Promise<CreatedMessageRecord>;

  createNotification(input: CreateMessageNotificationInput): Promise<void>;

  findRecent(input: FindRecentMessagesInput): Promise<RecentMessageRecord[]>;
}
