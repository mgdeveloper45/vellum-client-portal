import { Prisma } from "@/lib/generated/prisma/client";

export type ActivityInput = {
  action: string;
  entity: string;
  metadata: Prisma.JsonValue | null;
};

function getMetadataValue(metadata: Prisma.JsonValue | null, key: string) {
  if (
    metadata &&
    typeof metadata === "object" &&
    !Array.isArray(metadata) &&
    key in metadata
  ) {
    return String(metadata[key]);
  }

  return null;
}

export function formatActivityTitle(activity: ActivityInput) {
  const name = getMetadataValue(activity.metadata, "name");
  const amount = getMetadataValue(activity.metadata, "amount");
  const preview = getMetadataValue(activity.metadata, "preview");

  switch (activity.action) {
    case "PROJECT_CREATED":
      return `Created project${name ? `: ${name}` : ""}`;

    case "PROJECT_UPDATED":
      return `Updated project${name ? `: ${name}` : ""}`;

    case "PROJECT_DELETED":
      return "Deleted a project";

    case "MESSAGE_SENT":
      return preview ? `Sent message: ${preview}` : "Sent a message";

    case "FILE_UPLOADED":
      return name ? `Uploaded file: ${name}` : "Uploaded a file";

    case "INVOICE_CREATED":
      return amount
        ? `Created invoice for $${Number(amount).toLocaleString()}`
        : "Created an invoice";

    case "INVOICE_PAID":
      return amount
        ? `Marked invoice paid: $${Number(amount).toLocaleString()}`
        : "Marked invoice paid";

    case "INVOICE_UNPAID":
      return amount
        ? `Marked invoice unpaid: $${Number(amount).toLocaleString()}`
        : "Marked invoice unpaid";

    case "PROPOSAL_CREATED":
      return "Created a proposal";

    case "PROPOSAL_APPROVED":
      return "Approved a proposal";

    case "PROPOSAL_REJECTED":
      return "Rejected a proposal";

    case "PASSWORD_CHANGED":
      return "Changed password";

    default:
      return activity.action.toLowerCase().replaceAll("_", " ");
  }
}
