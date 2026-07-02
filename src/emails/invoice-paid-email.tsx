import { Heading, Section, Text } from "@react-email/components";
import { EmailLayout } from "@/emails/components/email-layout";

type InvoicePaidEmailProps = {
    clientName: string;
    businessName: string;
    projectName: string;
    amount: string;
    invoiceUrl: string;
};

export function InvoicePaidEmail({
    clientName,
    businessName,
    projectName,
    amount,
    invoiceUrl,
}: InvoicePaidEmailProps) {
    return (
        <EmailLayout preview={`Payment received for ${projectName}`}>
            <Heading style={heading}>Payment received</Heading>

            <Text style={text}>Hi {clientName},</Text>

            <Text style={text}>
                Thank you. Your payment to {businessName} has been received.
            </Text>

            <Section style={summary}>
                <Text style={summaryRow}>
                    <strong>Project:</strong> {projectName}
                </Text>

                <Text style={summaryRow}>
                    <strong>Amount paid:</strong> {amount}
                </Text>
            </Section>

            <Text style={text}>
                You can view your invoice here:
            </Text>

            <Text style={linkText}>
                <a href={invoiceUrl}>View Invoice</a>
            </Text>
        </EmailLayout>
    );
}

const heading = {
    fontSize: "28px",
    fontWeight: "400",
    marginBottom: "20px",
};

const text = {
    color: "#333",
    fontSize: "16px",
    lineHeight: "24px",
};

const summary = {
    backgroundColor: "#f6f5f2",
    borderRadius: "14px",
    padding: "20px",
    margin: "24px 0",
};

const summaryRow = {
    color: "#333",
    fontSize: "15px",
    lineHeight: "22px",
};

const linkText = {
    fontSize: "16px",
    lineHeight: "24px",
};