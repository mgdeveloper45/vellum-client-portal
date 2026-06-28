import {
    Body,
    Container,
    Head,
    Html,
    Preview,
    Section,
    Text,
} from "@react-email/components";

type EmailLayoutProps = {
    preview: string;
    children: React.ReactNode;
};

export function EmailLayout({ preview, children }: EmailLayoutProps) {
    return (
        <Html>
            <Head />
            <Preview>{preview}</Preview>

            <Body style={body}>
                <Container style={container}>
                    {children}

                    <Section style={footer}>
                        <Text style={footerText}>Powered by Vellum</Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}

const body = {
    backgroundColor: "#f6f5f2",
    fontFamily: "Arial, sans-serif",
    padding: "32px",
};

const container = {
    backgroundColor: "#ffffff",
    borderRadius: "18px",
    padding: "32px",
    maxWidth: "600px",
};

const footer = {
    borderTop: "1px solid #e5e0d8",
    marginTop: "32px",
    paddingTop: "20px",
};

const footerText = {
    color: "#777",
    fontSize: "12px",
};