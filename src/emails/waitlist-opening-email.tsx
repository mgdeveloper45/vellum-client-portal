import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
} from "@react-email/components";

type WaitlistOpeningEmailProps = {
    customerName: string;
    businessName: string;
    serviceName: string;
    bookingDate: string;
    availableTime: string;
    bookingUrl: string;
    expiresAt: string;
};

export function WaitlistOpeningEmail({
    customerName,
    businessName,
    serviceName,
    bookingDate,
    availableTime,
    bookingUrl,
    expiresAt,
}: WaitlistOpeningEmailProps) {
    return (
        <Html>
            <Head />

            <Preview>
                An appointment just opened with {businessName}
            </Preview>

            <Body
                style={{
                    backgroundColor: "#f6f6f6",
                    fontFamily:
                        "Arial, Helvetica, sans-serif",
                    margin: 0,
                    padding: "32px 16px",
                }}
            >
                <Container
                    style={{
                        backgroundColor: "#ffffff",
                        borderRadius: "16px",
                        margin: "0 auto",
                        maxWidth: "560px",
                        padding: "32px",
                    }}
                >
                    <Heading
                        style={{
                            fontSize: "24px",
                            fontWeight: 500,
                            margin: "0 0 16px",
                        }}
                    >
                        An appointment just opened
                    </Heading>

                    <Text>
                        Hi {customerName},
                    </Text>

                    <Text>
                        A spot became available for{" "}
                        <strong>{serviceName}</strong> with{" "}
                        <strong>{businessName}</strong>.
                    </Text>

                    <Section
                        style={{
                            backgroundColor: "#f8f8f8",
                            borderRadius: "12px",
                            margin: "24px 0",
                            padding: "16px",
                        }}
                    >
                        <Text style={{ margin: "0 0 8px" }}>
                            <strong>Date:</strong> {bookingDate}
                        </Text>

                        <Text style={{ margin: 0 }}>
                            <strong>Available time:</strong>{" "}
                            {availableTime}
                        </Text>
                    </Section>

                    <Button
                        href={bookingUrl}
                        style={{
                            backgroundColor: "#111111",
                            borderRadius: "999px",
                            color: "#ffffff",
                            display: "inline-block",
                            padding: "12px 22px",
                            textDecoration: "none",
                        }}
                    >
                        Book this opening
                    </Button>

                    <Text
                        style={{
                            color: "#666666",
                            fontSize: "13px",
                            marginTop: "24px",
                        }}
                    >
                        This waitlist opportunity expires at{" "}
                        {expiresAt}. Availability is still
                        first-come, first-served until your
                        booking is confirmed.
                    </Text>
                </Container>
            </Body>
        </Html>
    );
}