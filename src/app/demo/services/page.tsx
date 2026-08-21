import Link from "next/link";

import { DemoShell } from "@/components/demo/demo-shell";
import { demoServices } from "@/lib/demo/demo-data";

export default function DemoServicesPage() {
    const activeServices = demoServices.filter(
        (service) => service.active,
    );

    const averagePrice =
        activeServices.length > 0
            ? activeServices.reduce(
                (total, service) => total + service.price,
                0,
            ) / activeServices.length
            : 0;

    return (
        <DemoShell>
            <div className="mx-auto max-w-7xl">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                        Operations
                    </p>

                    <h1 className="mt-2 text-3xl font-light tracking-tight sm:text-4xl">
                        Services
                    </h1>

                    <p className="mt-3 max-w-3xl text-foreground/60">
                        Manage the services clients can book, including duration,
                        pricing, and availability.
                    </p>
                </div>

                <section className="mt-8 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-3xl border border-border bg-card p-6">
                        <p className="text-sm text-foreground/50">
                            Active Services
                        </p>

                        <p className="mt-4 text-3xl font-light">
                            {activeServices.length}
                        </p>

                        <p className="mt-3 text-sm text-foreground/55">
                            Available for booking
                        </p>
                    </div>

                    <div className="rounded-3xl border border-border bg-card p-6">
                        <p className="text-sm text-foreground/50">
                            Average Price
                        </p>

                        <p className="mt-4 text-3xl font-light">
                            {averagePrice.toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                                maximumFractionDigits: 0,
                            })}
                        </p>

                        <p className="mt-3 text-sm text-foreground/55">
                            Across active services
                        </p>
                    </div>

                    <div className="rounded-3xl border border-border bg-card p-6">
                        <p className="text-sm text-foreground/50">
                            Booking Ready
                        </p>

                        <p className="mt-4 text-3xl font-light">
                            {activeServices.length === demoServices.length
                                ? "100%"
                                : `${Math.round(
                                    (activeServices.length / demoServices.length) * 100,
                                )}%`}
                        </p>

                        <p className="mt-3 text-sm text-foreground/55">
                            Service catalog active
                        </p>
                    </div>
                </section>

                <section className="mt-8">
                    <div>
                        <h2 className="text-xl font-medium">
                            Service Catalog
                        </h2>

                        <p className="mt-1 text-sm text-foreground/50">
                            Explore the services configured for this demo workspace.
                        </p>
                    </div>

                    <div className="mt-5 grid gap-6 lg:grid-cols-3">
                        {demoServices.map((service) => {
                            const formattedPrice = service.price.toLocaleString(
                                "en-US",
                                {
                                    style: "currency",
                                    currency: "USD",
                                    maximumFractionDigits: 0,
                                },
                            );

                            return (
                                <article
                                    key={service.id}
                                    className="rounded-3xl border border-border bg-card p-6"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-sm text-foreground/50">
                                                Client Service
                                            </p>

                                            <h3 className="mt-2 text-xl font-medium">
                                                {service.name}
                                            </h3>
                                        </div>

                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-medium ${service.active
                                                    ? "bg-emerald-500/10 text-emerald-600"
                                                    : "bg-muted text-foreground/50"
                                                }`}
                                        >
                                            {service.active ? "ACTIVE" : "INACTIVE"}
                                        </span>
                                    </div>

                                    <div className="mt-8 grid grid-cols-2 gap-4 border-t border-border pt-6">
                                        <div>
                                            <p className="text-sm text-foreground/50">
                                                Duration
                                            </p>

                                            <p className="mt-2 font-medium">
                                                {service.duration}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-foreground/50">
                                                Price
                                            </p>

                                            <p className="mt-2 font-medium">
                                                {formattedPrice}
                                            </p>
                                        </div>
                                    </div>

                                    <Link
                                        href="/demo/bookings"
                                        className="mt-7 inline-block text-sm font-medium workspace-accent-text"
                                    >
                                        Explore bookings →
                                    </Link>
                                </article>
                            );
                        })}
                    </div>
                </section>

                <section className="mt-8 rounded-3xl border border-primary/20 bg-primary/[0.05] p-6">
                    <p className="font-medium">
                        Configure your client booking experience
                    </p>

                    <p className="mt-2 max-w-3xl text-sm leading-6 text-foreground/60">
                        A live Vellum workspace lets you configure services and connect
                        them to availability and booking workflows.
                    </p>

                    <Link
                        href="/sign-in"
                        className="mt-4 inline-block text-sm font-medium workspace-accent-text"
                    >
                        Sign in to configure services →
                    </Link>
                </section>
            </div>
        </DemoShell>
    );
}