type ServiceSelectorProps = {
    workspaceId: string;
    selectedDate: string;
    selectedServiceId?: string;
    services: {
        id: string;
        name: string;
        description: string | null;
        duration: number;
        price: number;
    }[];
};

export function ServiceSelector({
    workspaceId,
    selectedDate,
    selectedServiceId,
    services,
}: ServiceSelectorProps) {
    return (
        <section className="rounded-3xl border border-border bg-card p-8">
            <div>
                <p className="workspace-accent-text text-sm font-medium">
                    Step 1
                </p>

                <h2 className="mt-2 text-2xl font-light">Choose a service</h2>
            </div>

            <div className="mt-6 grid gap-3">
                {services.map((service) => {
                    const isSelected = selectedServiceId === service.id;

                    return (
                        <a
                            key={service.id}
                            href={`/book/${workspaceId}?serviceId=${service.id}&date=${selectedDate}`}
                            className={
                                isSelected
                                    ? "workspace-accent-border rounded-2xl border bg-background p-5 transition"
                                    : "rounded-2xl border border-border bg-background p-5 transition hover:border-foreground/30"
                            }
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-lg font-medium">{service.name}</p>

                                    {service.description && (
                                        <p className="mt-2 text-sm text-foreground/60">
                                            {service.description}
                                        </p>
                                    )}
                                </div>

                                <div className="text-right text-sm text-foreground/70">
                                    <p>{service.duration} min</p>
                                    <p>${(service.price / 100).toFixed(2)}</p>
                                </div>
                            </div>
                        </a>
                    );
                })}
            </div>
        </section>
    );
}