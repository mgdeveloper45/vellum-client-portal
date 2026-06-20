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