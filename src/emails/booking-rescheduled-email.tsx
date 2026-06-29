import { Heading, Section, Text } from "@react-email/components";
import { EmailLayout } from "@/emails/components/email-layout";

type BookingRescheduledEmailProps = {
    customerName: string;
    businessName: string;
    serviceName: string;
    bookingDate: string;
    bookingTime: string;
};

export function BookingRescheduledEmail({
    customerName,
    businessName,
    serviceName,
    bookingDate,
    bookingTime,
}: BookingRescheduledEmailProps) {
    return (
        <EmailLayout preview={`Your booking with ${businessName} has been rescheduled`}>
            <Heading style={heading}>Booking rescheduled</Heading>

            <Text style={text}>Hi {customerName},</Text>

            <Text style={text}>
                Your appointment has been rescheduled. Here are the updated details:
            </Text>

            <Section style={summary}>
                <Text style={summaryRow}>
                    <strong>Business:</strong> {businessName}
                </Text>

                <Text style={summaryRow}>
                    <strong>Service:</strong> {serviceName}
                </Text>

                <Text style={summaryRow}>
                    <strong>Date:</strong> {bookingDate}
                </Text>

                <Text style={summaryRow}>
                    <strong>Time:</strong> {bookingTime}
                </Text>
            </Section>

            <Text style={text}>
                We look forward to seeing you.
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