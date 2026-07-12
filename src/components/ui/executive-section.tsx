import clsx from "clsx";
import type { ReactNode } from "react";
import { ExecutiveSectionHeader } from "@/components/ui/executive-section-header";
import { executiveSpacing } from "@/components/ui/executive-design";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function ExecutiveSection({
  eyebrow,
  title,
  description,
  actions,
  children,
  className,
}: Props) {
  return (
    <section
      className={clsx(
        executiveSpacing.sectionGap,
        "space-y-6",
        className,
      )}
    >
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <ExecutiveSectionHeader
          eyebrow={eyebrow}
          title={title}
          description={description}
        />

        {actions && (
          <div className="shrink-0">
            {actions}
          </div>
        )}
      </header>

      {children}
    </section>
  );
}