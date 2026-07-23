import { createCreateMessageService } from "../create-message-service";
import { createListMessagesService } from "../list-messages-service";
import { prismaMessageRepository } from "../prisma-message-repository";

export const createMessageService = createCreateMessageService(
  prismaMessageRepository,
);

export const listMessagesService = createListMessagesService(
  prismaMessageRepository,
);
