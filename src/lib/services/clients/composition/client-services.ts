import { prismaClientRepository } from "../prisma-client-repository";
import { createCreateClientService } from "../create-client-service";
import { createDeleteClientService } from "../delete-client-service";
import {
  createGetClientDetailService,
  createGetClientForEditService,
} from "../get-client-service";
import { createListClientsService } from "../list-clients-service";
import { createUpdateClientService } from "../update-client-service";

export const createClientService = createCreateClientService({
  clientRepository: prismaClientRepository,
});

export const updateClientService = createUpdateClientService({
  clientRepository: prismaClientRepository,
});

export const deleteClientService = createDeleteClientService({
  clientRepository: prismaClientRepository,
});

export const listClientsService = createListClientsService({
  clientRepository: prismaClientRepository,
});

export const getClientDetailService = createGetClientDetailService({
  clientRepository: prismaClientRepository,
});

export const getClientForEditService = createGetClientForEditService({
  clientRepository: prismaClientRepository,
});
