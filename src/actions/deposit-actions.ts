"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prismaUserWorkspaceRepository } from "@/lib/repositories/prisma-user-workspace-repository";
import { auth } from "@/auth";
import {
  getDepositForEditService,
  markDepositPaidService,
  requestDepositService,
  updateDepositService,
} from "@/lib/services/deposits/composition/deposit-services";
import {
  requestDepositSchema,
  updateDepositSchema,
} from "@/lib/validation/deposit";

export async function requestDepositAction(formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    return;
  }

  const input = requestDepositSchema.parse({
    projectId: formData.get("projectId"),
    amount: formData.get("amount"),
    dueDate: formData.get("dueDate"),
    notes: formData.get("notes"),
  });

  const result = await requestDepositService(input);

  if (!result.success) {
    return;
  }

  revalidatePath(`/projects/${input.projectId}`);
}

export async function markDepositPaidAction(
  formData: FormData,
) {
  const session = await auth();

  if (!session?.user) {
    return;
  }

  const depositId = String(
    formData.get("depositId") ?? "",
  ).trim();

  const projectId = String(
    formData.get("projectId") ?? "",
  ).trim();

  if (!depositId || !projectId) {
    return;
  }

  const workspaceId =
    await prismaUserWorkspaceRepository.findWorkspaceIdByUserId(
      session.user.id,
    );

  if (!workspaceId) {
    return;
  }

  const result =
    await markDepositPaidService({
      workspaceId,
      depositId,
    });

  if (!result.success) {
    return;
  }

  revalidatePath(`/projects/${projectId}`);

  redirect(`/projects/${projectId}`);
}

export async function updateDepositAction(
  formData: FormData,
) {
  const session = await auth();

  if (!session?.user) {
    return;
  }

  const input = updateDepositSchema.parse({
    depositId: formData.get("depositId"),
    projectId: formData.get("projectId"),
    amount: formData.get("amount"),
    dueDate: formData.get("dueDate"),
    notes: formData.get("notes"),
    status: formData.get("status"),
    paymentMethod:
      formData.get("paymentMethod") || null,
    paidAt: formData.get("paidAt"),
  });

  const result =
    await updateDepositService({
      depositId: input.depositId,
      amount: input.amount,
      dueDate: input.dueDate,
      notes: input.notes,
      status: input.status,
      paymentMethod: input.paymentMethod,
      paidAt: input.paidAt,
    });

  if (!result.success) {
    return;
  }

  revalidatePath(`/projects/${input.projectId}`);

  redirect(`/projects/${input.projectId}`);
}