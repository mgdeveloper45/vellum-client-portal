import { CreateUserService } from "@/lib/services/users/create-user-service";
import { prismaUserManagementRepository } from "@/lib/services/users/prisma-user-management-repository";
import { UpdateUserService } from "@/lib/services/users/update-user-service";

export const createUserService = new CreateUserService(
  prismaUserManagementRepository,
);

export const updateUserService = new UpdateUserService(
  prismaUserManagementRepository,
);
