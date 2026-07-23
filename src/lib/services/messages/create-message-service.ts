import type {
  CreatedMessageRecord,
  MessageRecipientRecord,
  MessageRepository,
} from "./message-repository";

export interface CreateMessageRequest {
  workspaceId: string;
  projectId: string;
  senderId: string;
  content: string;
  canManageProjects: boolean;
  sessionSenderName?: string | null;
}

export interface MessageEmailDelivery {
  recipientEmail: string;
  projectName: string;
  senderName: string;
  content: string;
  projectId: string;
}

export type CreateMessageResult =
  | {
      success: true;
      message: CreatedMessageRecord;
      preview: string;
      emailDelivery: MessageEmailDelivery | null;
    }
  | {
      success: false;
      reason: "INVALID_WORKSPACE" | "INVALID_SENDER" | "PROJECT_NOT_FOUND";
      message: string;
    };

function createMessagePreview(content: string) {
  return content.length > 100 ? `${content.slice(0, 100)}...` : content;
}

function createSenderName(
  sessionSenderName: string | null | undefined,
  firstName: string,
  lastName: string,
) {
  return (
    sessionSenderName?.trim() ||
    `${firstName} ${lastName}`.trim() ||
    "Vellum User"
  );
}

function selectRecipient(
  senderId: string,
  clientId: string,
  client: MessageRecipientRecord,
  owner: MessageRecipientRecord,
) {
  return senderId === clientId ? owner : client;
}

export function createCreateMessageService(
  messageRepository: MessageRepository,
) {
  return async function createMessage(
    request: CreateMessageRequest,
  ): Promise<CreateMessageResult> {
    const workspaceId = request.workspaceId.trim();
    const projectId = request.projectId.trim();
    const senderId = request.senderId.trim();
    const content = request.content.trim();

    if (!workspaceId) {
      return {
        success: false,
        reason: "INVALID_WORKSPACE",
        message: "A valid workspace is required.",
      };
    }

    const sender = await messageRepository.findSender({
      userId: senderId,
      workspaceId,
    });

    if (!sender) {
      return {
        success: false,
        reason: "INVALID_SENDER",
        message:
          "The message sender is not an active member of this workspace.",
      };
    }

    const project = await messageRepository.findAccessibleProject({
      projectId,
      workspaceId,
      viewerUserId: senderId,
      canManageProjects: request.canManageProjects,
    });

    if (!project) {
      return {
        success: false,
        reason: "PROJECT_NOT_FOUND",
        message: "The project does not exist or the sender cannot access it.",
      };
    }

    const message = await messageRepository.create({
      projectId: project.id,
      senderId: sender.id,
      content,
    });

    const preview = createMessagePreview(message.content);

    const recipient = selectRecipient(
      sender.id,
      project.clientId,
      project.client,
      project.owner,
    );

    if (recipient.id === sender.id) {
      return {
        success: true,
        message,
        preview,
        emailDelivery: null,
      };
    }

    await messageRepository.createNotification({
      userId: recipient.id,
      projectId: project.id,
      preview,
    });

    return {
      success: true,
      message,
      preview,
      emailDelivery: {
        recipientEmail: recipient.email,
        projectName: project.name,
        senderName: createSenderName(
          request.sessionSenderName,
          sender.firstName,
          sender.lastName,
        ),
        content: message.content,
        projectId: project.id,
      },
    };
  };
}

export type CreateMessageService = ReturnType<
  typeof createCreateMessageService
>;
