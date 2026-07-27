"use client";

import { useEffect } from "react";

interface GlobalErrorPageProps {
    error: Error & {
        digest?: string;
    };
    reset: () => void;
}

export default function GlobalErrorPage({
    error,
    reset,
}: GlobalErrorPageProps) {
    useEffect(() => {
        console.error(
            JSON.stringify({
                timestamp: new Date().toISOString(),
                level: "error",
                message: "Global application error",
                error: {
                    name: error.name,
                    message: error.message,
                    digest: error.digest,
                },
            }),
        );
    }, [error]);

    return (
        <html lang="en">
            <body>
                <main
                    style={{
                        alignItems: "center",
                        display: "flex",
                        justifyContent: "center",
                        minHeight: "100vh",
                        padding: "24px",
                        background: "#ffffff",
                        color: "#111827",
                        fontFamily:
                            "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                    }}
                >
                    <section
                        aria-labelledby="global-error-title"
                        style={{
                            width: "100%",
                            maxWidth: "520px",
                            padding: "32px",
                            border: "1px solid #e5e7eb",
                            borderRadius: "12px",
                            textAlign: "center",
                            boxShadow:
                                "0 1px 3px rgba(0, 0, 0, 0.08)",
                        }}
                    >
                        <p
                            style={{
                                margin: 0,
                                color: "#6b7280",
                                fontSize: "14px",
                                fontWeight: 600,
                            }}
                        >
                            Application error
                        </p>

                        <h1
                            id="global-error-title"
                            style={{
                                margin: "8px 0 0",
                                fontSize: "26px",
                                lineHeight: 1.25,
                            }}
                        >
                            We could not complete your request
                        </h1>

                        <p
                            style={{
                                margin: "14px 0 0",
                                color: "#6b7280",
                                fontSize: "15px",
                                lineHeight: 1.6,
                            }}
                        >
                            Please try again. Your account and workspace
                            information remain protected.
                        </p>

                        {error.digest ? (
                            <p
                                style={{
                                    margin: "16px 0 0",
                                    color: "#6b7280",
                                    fontSize: "12px",
                                }}
                            >
                                Reference: {error.digest}
                            </p>
                        ) : null}

                        <button
                            type="button"
                            onClick={reset}
                            style={{
                                marginTop: "24px",
                                minHeight: "42px",
                                padding: "0 18px",
                                border: 0,
                                borderRadius: "7px",
                                background: "#111827",
                                color: "#ffffff",
                                cursor: "pointer",
                                fontSize: "14px",
                                fontWeight: 600,
                            }}
                        >
                            Try again
                        </button>
                    </section>
                </main>
            </body>
        </html>
    );
}