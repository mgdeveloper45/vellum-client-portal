import { ReactNode } from "react";

type BookingCommandCenterProps = {
    children: ReactNode;
};

export function BookingCommandCenter({
    children,
}: BookingCommandCenterProps) {
    return (
        <div className="space-y-8">
            {children}
        </div>
    );
}