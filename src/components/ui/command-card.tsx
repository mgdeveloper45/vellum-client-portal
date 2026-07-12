import clsx from "clsx";
import type { ReactNode } from "react";
import { ExecutiveSectionHeader } from "@/components/ui/executive-section-header";
import {
  executiveRadius,
  executiveShadow,
  executiveSpacing,
} from "@/components/ui/executive-design";

type CommandCardProps = {
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function CommandCard({
  title,
  subtitle,
  eyebrow,
  actions,
  children,
  className,
}: CommandCardProps) {
  const hasHeader = Boolean(
    title || subtitle || eyebrow || actions,
  );

  return (
    <section
      className={clsx(
        "overflow-hidden border border-border/70 bg-card/95",
        executiveRadius.panel,
        executiveShadow.panel,
        className,
      )}
    >
      {hasHeader && (
        <header
          className={clsx(
            "flex flex-col gap-4 border-b border-border/50 sm:flex-row sm:items-start sm:justify-between",
            executiveSpacing.cardPadding,
          )}
        >
          <ExecutiveSectionHeader
            eyebrow={eyebrow}
            title={title}
            description={subtitle}
          />

          {actions && (
            <div className="shrink-0">
              {actions}
            </div>
          )}
        </header>
      )}

      <div className={executiveSpacing.cardPadding}>
        {children}
      </div>
    </section>
  );
}