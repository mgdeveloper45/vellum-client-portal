"use server";

import { auth } from "@/auth";
import { createAuditLog } from "@/lib/audit";
import { canManageInvoices } from "@/lib/permissions";
import { prismaUserWorkspaceRepository } from "@/lib/repositories/prisma-user-workspace-repository";
import {
  createInvoiceService,
  deleteInvoiceService,
  toggleInvoicePaidService,
} from "@/lib/services/invoice/composition/invoice-services";
import {
  createInvoiceSchema,
  invoiceMutationSchema,
} from "@/lib/validation/invoice";
import { redirect } from "next/navigation";

/**
 * Creates a new invoice for a project.
 */
export async function createInvoiceAction(formData: FormData) {
  const session = await auth();

  if (!session?.user || !canManageInvoices(session.user.role)) {
    return;
  }

  const input = createInvoiceSchema.parse({
    projectId: formData.get("projectId"),
    amount: formData.get("amount"),
  });

  const workspaceId =
    await prismaUserWorkspaceRepository.findWorkspaceIdByUserId(
      session.user.id,
    );

  if (!workspaceId) {
    return;
  }

  const result = await createInvoiceService.execute({
    projectId: input.projectId,
    workspaceId,
    amount: input.amount,
  });

  if (!result.success) {
    return;
  }

  await createAuditLog({
    action: "INVOICE_CREATED",
    entity: "INVOICE",
    entityId: result.invoice.id,
    userId: session.user.id,
    metadata: {
      amount: result.invoice.amount,
      projectId: result.invoice.projectId,
      paid: result.invoice.paid,
    },
  });

  redirect(`/projects/${result.invoice.projectId}`);
}

/**
 * Toggles paid on an invoice for a project.
 */
export async function toggleInvoicePaidAction(formData: FormData) {
  const session = await auth();

  if (!session?.user || !canManageInvoices(session.user.role)) {
    return;
  }

  const input = invoiceMutationSchema.parse({
    invoiceId: formData.get("invoiceId"),
    projectId: formData.get("projectId"),
  });

  const workspaceId =
    await prismaUserWorkspaceRepository.findWorkspaceIdByUserId(
      session.user.id,
    );

  if (!workspaceId) {
    return;
  }

  const result = await toggleInvoicePaidService.execute({
    invoiceId: input.invoiceId,
    projectId: input.projectId,
    workspaceId,
  });

  if (!result.success) {
    return;
  }

  await createAuditLog({
    action: result.invoice.paid ? "INVOICE_PAID" : "INVOICE_UNPAID",
    entity: "INVOICE",
    entityId: result.invoice.id,
    userId: session.user.id,
    metadata: {
      amount: result.invoice.amount,
      projectId: result.invoice.projectId,
      paid: result.invoice.paid,
    },
  });

  redirect(`/projects/${result.invoice.projectId}`);
}

/**
 * Deletes an invoice for a project.
 */
export async function deleteInvoiceAction(formData: FormData) {
  const session = await auth();

  if (!session?.user || !canManageInvoices(session.user.role)) {
    return;
  }

  const input = invoiceMutationSchema.parse({
    invoiceId: formData.get("invoiceId"),
    projectId: formData.get("projectId"),
  });

  const workspaceId =
    await prismaUserWorkspaceRepository.findWorkspaceIdByUserId(
      session.user.id,
    );

  if (!workspaceId) {
    return;
  }

  const result = await deleteInvoiceService.execute({
    invoiceId: input.invoiceId,
    projectId: input.projectId,
    workspaceId,
  });

  if (!result.success) {
    return;
  }

  await createAuditLog({
    action: "INVOICE_DELETED",
    entity: "INVOICE",
    entityId: result.invoice.id,
    userId: session.user.id,
    metadata: {
      amount: result.invoice.amount,
      projectId: result.invoice.projectId,
      paid: result.invoice.paid,
    },
  });

  redirect(`/projects/${result.invoice.projectId}`);
}
