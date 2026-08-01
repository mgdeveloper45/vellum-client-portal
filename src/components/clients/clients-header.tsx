import Link from "next/link";

type ClientsHeaderProps = {
    canManageClients: boolean;
};

export function ClientsHeader({
    canManageClients,
}: ClientsHeaderProps) {
    return (
        <div className="flex items-start justify-between gap-6">
            <div>
                <h1 className="text-3xl font-light">
                    Clients
                </h1>

                <p className="mt-2 text-foreground/70">
                    Manage client relationships,
                    projects, and communication.
                </p>
            </div>

            {canManageClients && (
                <Link
                    href="/clients/new"
                    className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background"
                >
                    New Client
                </Link>
            )}
        </div>
    );
}