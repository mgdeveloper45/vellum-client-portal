export interface NotificationMessage {
  title: string;

  message: string;

  href: string;

  type: "PROJECT" | "INVOICE" | "BOOKING" | "PAYMENT" | "CLIENT";
}

export function buildPaymentNotification({
  projectId,
  projectName,
  amount,
}: {
  projectId: string;
  projectName: string;
  amount: number;
}): NotificationMessage {
  return {
    title: "Payment received",
    message: `Received $${amount.toLocaleString()} for ${projectName}.`,
    href: `/projects/${projectId}`,
    type: "PAYMENT",
  };
}
