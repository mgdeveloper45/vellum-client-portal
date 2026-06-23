import { prisma } from "@/lib/prisma";
import { AcceptInviteForm } from "@/components/workspace/accept-invite-form";

type AcceptInvitePageProps = {
    searchParams: Promise<{
        token?: string;
    }>;
};

export default async function AcceptInvitePage({
    searchParams,
}: AcceptInvitePageProps) {
    const { token } = await searchParams;

    if (!token) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <p>Invalid invitation link.</p>
            </div>
        );
    }

    const invitation = await prisma.workspaceInvitation.findUnique({
        where: {
            token,
        },
        include: {
            workspace: true,
        },
    });

    if (
        !invitation ||
        invitation.acceptedAt ||
        invitation.expiresAt < new Date()
    ) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <p>This invitation is invalid or expired.</p>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
            <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8">
                <p className="text-sm uppercase tracking-[0.35em] text-accent">
                    Vellum
                </p>

                <h1 className="mt-3 text-3xl font-light">
                    Join {invitation.workspace.name}
                </h1>

                <p className="mt-2 text-sm text-foreground/70">
                    Complete your account to join this workspace.
                </p>

                <AcceptInviteForm
                    token={token}
                    email={invitation.email}
                />
            </div>
        </div>
    );
}