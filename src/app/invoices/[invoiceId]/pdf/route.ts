import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{
      invoiceId: string;
    }>;
  },
) {
  const session = await auth();

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { invoiceId } = await params;

  const currentUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      workspaceId: true,
    },
  });

  if (!currentUser?.workspaceId) {
    return new Response("Workspace not found", { status: 404 });
  }

  const invoice = await prisma.invoice.findFirst({
    where: {
      id: invoiceId,
      project: {
        workspaceId: currentUser.workspaceId,
      },
    },
    include: {
      project: {
        include: {
          client: true,
          workspace: true,
        },
      },
    },
  });

  if (!invoice) {
    return new Response("Invoice not found", { status: 404 });
  }

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]);

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const businessName =
    invoice.project.workspace?.companyName ||
    invoice.project.workspace?.name ||
    "Vellum";

  const clientName = `${invoice.project.client.firstName} ${invoice.project.client.lastName}`;
  const amount = `$${invoice.amount.toLocaleString()}`;
  const status = invoice.paid ? "PAID" : "UNPAID";

  let y = 780;

  page.drawText(businessName, {
    x: 50,
    y,
    size: 24,
    font: boldFont,
    color: rgb(0.07, 0.09, 0.15),
  });

  page.drawText(status, {
    x: 470,
    y,
    size: 12,
    font: boldFont,
    color: invoice.paid ? rgb(0.05, 0.45, 0.2) : rgb(0.65, 0.12, 0.12),
  });

  y -= 70;

  page.drawText("Invoice", {
    x: 50,
    y,
    size: 32,
    font: boldFont,
    color: rgb(0.07, 0.09, 0.15),
  });

  y -= 30;

  page.drawText(`Invoice ID: ${invoice.id}`, {
    x: 50,
    y,
    size: 10,
    font,
    color: rgb(0.4, 0.4, 0.4),
  });

  y -= 16;

  page.drawText(`Created: ${invoice.createdAt.toLocaleDateString()}`, {
    x: 50,
    y,
    size: 10,
    font,
    color: rgb(0.4, 0.4, 0.4),
  });

  y -= 60;

  page.drawText("Project", {
    x: 50,
    y,
    size: 10,
    font: boldFont,
    color: rgb(0.4, 0.4, 0.4),
  });

  y -= 20;

  page.drawText(invoice.project.name, {
    x: 50,
    y,
    size: 14,
    font,
    color: rgb(0.07, 0.09, 0.15),
  });

  y -= 50;

  page.drawText("Bill To", {
    x: 50,
    y,
    size: 10,
    font: boldFont,
    color: rgb(0.4, 0.4, 0.4),
  });

  y -= 20;

  page.drawText(clientName, {
    x: 50,
    y,
    size: 14,
    font,
    color: rgb(0.07, 0.09, 0.15),
  });

  y -= 70;

  page.drawLine({
    start: { x: 50, y },
    end: { x: 545, y },
    thickness: 1,
    color: rgb(0.85, 0.85, 0.85),
  });

  y -= 28;

  page.drawText("Description", {
    x: 50,
    y,
    size: 12,
    font: boldFont,
  });

  page.drawText("Amount", {
    x: 460,
    y,
    size: 12,
    font: boldFont,
  });

  y -= 28;

  page.drawText("Professional services", {
    x: 50,
    y,
    size: 12,
    font,
  });

  page.drawText(amount, {
    x: 460,
    y,
    size: 12,
    font,
  });

  y -= 24;

  page.drawLine({
    start: { x: 50, y },
    end: { x: 545, y },
    thickness: 1,
    color: rgb(0.85, 0.85, 0.85),
  });

  y -= 45;

  page.drawText("Total", {
    x: 390,
    y,
    size: 18,
    font: boldFont,
  });

  page.drawText(amount, {
    x: 460,
    y,
    size: 18,
    font: boldFont,
  });

  y -= 90;

  page.drawText("Thank you for your business.", {
    x: 50,
    y,
    size: 11,
    font,
    color: rgb(0.4, 0.4, 0.4),
  });

  const pdfBytes = await pdfDoc.save();

  return new Response(new Uint8Array(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="invoice-${invoice.id}.pdf"`,
    },
  });
}
