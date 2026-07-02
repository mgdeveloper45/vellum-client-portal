import { AICommandCenter } from "@/components/ai/command-center";
import { BrandedDashboardShell } from "@/components/layout/branded-dashboard-shell";

export default function AICommandCenterPage() {
    return (
        <BrandedDashboardShell>
            <div className="max-w-4xl">
                <h1 className="text-3xl font-light">AI Command Center</h1>

                <p className="mt-2 text-foreground/60">
                    Ask Vellum to analyze your workspace and surface useful business actions.
                </p>

                <div className="mt-8">
                    <AICommandCenter />
                </div>
            </div>
        </BrandedDashboardShell>
    );
}