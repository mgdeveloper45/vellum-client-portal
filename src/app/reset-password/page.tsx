import { ResetPasswordForm } from "@/components/auth/reset-password-form";

type ResetPasswordPageProps = {
    searchParams: Promise<{
        token?: string;
    }>;
};

export default async function ResetPasswordPage({
    searchParams,
}: ResetPasswordPageProps) {
    const { token } = await searchParams;

    if (!token) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <p>Invalid reset link.</p>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8">
                <h1 className="text-3xl font-light">Reset Password</h1>

                <p className="mt-2 text-sm text-foreground/70">
                    Enter your new password.
                </p>

                <ResetPasswordForm token={token} />
            </div>
        </div>
    );
}