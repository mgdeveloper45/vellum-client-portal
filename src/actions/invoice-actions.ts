"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

/**
 * Creates a new invoice for a project.
 */
export async function createInvoiceAction(formData: FormData) {
  const projectId = String(formData.get("projectId"));
  const amount = Number(formData.get("amount"));

  await prisma.invoice.create({
    data: {
      projectId,
      amount,
      paid: false,
    },
  });

  redirect(`/projects/${projectId}`);
}

export async function toggleInvoicePaidAction(
  formData: FormData
) {
  const invoiceId = String(
    formData.get("invoiceId")
  );

  const projectId = String(
    formData.get("projectId")
  );

  const invoice = await prisma.invoice.findUnique({
    where: {
      id: invoiceId,
    },
  });

  if (!invoice) {
    return;
  }

  await prisma.invoice.update({
    where: {
      id: invoiceId,
    },
    data: {
      paid: !invoice.paid,
    },
  });

  redirect(`/projects/${projectId}`);
}