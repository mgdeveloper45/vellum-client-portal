import clsx from "clsx";
import {
  executiveTypography,
} from "@/components/ui/executive-design";

type Props = {
  eyebrow?: string;
  title?: string;
  description?: string;
};

export function ExecutiveSectionHeader({
  eyebrow,
  title,
  description,
}: Props) {
  return (
    <div>
      {eyebrow && (
        <p className={executiveTypography.eyebrow}>
          {eyebrow}
        </p>
      )}

      {title && (
        <h2
          className={clsx(
            executiveTypography.title,
            eyebrow && "mt-2",
          )}
        >
          {title}
        </h2>
      )}

      {description && (
        <p className={executiveTypography.subtitle}>
          {description}
        </p>
      )}
    </div>
  );
}