import type {
  MessageRepository,
  RecentMessageRecord,
} from "./message-repository";

export interface ListMessagesRequest {
  workspaceId: string;
  viewerUserId: string;
  canManageProjects: boolean;
  limit?: number;
}

export type ListMessagesResult =
  | {
      success: true;
      messages: RecentMessageRecord[];
    }
  | {
      success: false;
      reason: "INVALID_WORKSPACE" | "INVALID_VIEWER";
      message: string;
    };

export function createListMessagesService(
  messageRepository: MessageRepository,
) {
  return async function listMessages(
    request: ListMessagesRequest,
  ): Promise<ListMessagesResult> {
    const workspaceId = request.workspaceId.trim();
    const viewerUserId = request.viewerUserId.trim();

    if (!workspaceId) {
      return {
        success: false,
        reason: "INVALID_WORKSPACE",
        message: "A valid workspace is required.",
      };
    }

    if (!viewerUserId) {
      return {
        success: false,
        reason: "INVALID_VIEWER",
        message: "A valid viewer is required.",
      };
    }

    const messages = await messageRepository.findRecent({
      workspaceId,
      clientId: request.canManageProjects ? undefined : viewerUserId,
      limit: request.limit ?? 25,
    });

    return {
      success: true,
      messages,
    };
  };
}

export type ListMessagesService = ReturnType<typeof createListMessagesService>;
