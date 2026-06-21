import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8">
                <h1 className="text-3xl font-light">Forgot Password</h1>

                <p className="mt-2 text-sm text-foreground/70">
                    Enter your email to generate a reset link.
                </p>

                <ForgotPasswordForm />
            </div>
        </div>
    );
}