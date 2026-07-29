import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

type ExecutiveCardProps = HTMLAttributes<HTMLDivElement>;

function ExecutiveCard({
    className,
    children,
    ...props
}: ExecutiveCardProps) {
    return (
        <section
            className={cn(
                "rounded-3xl border border-border/70 bg-card",
                "shadow-sm transition-all duration-200",
                "hover:shadow-md",
                className,
            )}
            {...props}
        >
            {children}
        </section>
    );
}

function Header({
    className,
    children,
    ...props
}: ExecutiveCardProps) {
    return (
        <header
            className={cn(
                "border-b border-border/60 px-6 py-5",
                className,
            )}
            {...props}
        >
            {children}
        </header>
    );
}

function Body({
    className,
    children,
    ...props
}: ExecutiveCardProps) {
    return (
        <div
            className={cn(
                "p-6",
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
}

function Footer({
    className,
    children,
    ...props
}: ExecutiveCardProps) {
    return (
        <footer
            className={cn(
                "border-t border-border/60 px-6 py-5",
                className,
            )}
            {...props}
        >
            {children}
        </footer>
    );
}

ExecutiveCard.Header = Header;
ExecutiveCard.Body = Body;
ExecutiveCard.Footer = Footer;

export { ExecutiveCard };