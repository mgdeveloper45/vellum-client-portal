export type BookingCountdown = {
  label: string;
  urgent: boolean;
};

export function getBookingCountdown(date: Date) {
  const now = new Date();

  const diff = date.getTime() - now.getTime();

  const minutes = Math.floor(diff / 60000);

  if (minutes <= 0) {
    return {
      label: "In Progress or Complete",
      urgent: true,
    };
  }

  const hours = Math.floor(minutes / 60);

  const days = Math.floor(hours / 24);

  if (days > 0) {
    return {
      label: `${days} day${days === 1 ? "" : "s"} remaining`,
      urgent: days <= 2,
    };
  }

  if (hours > 0) {
    return {
      label: `${hours} hour${hours === 1 ? "" : "s"} remaining`,
      urgent: true,
    };
  }

  return {
    label: `${minutes} minute${minutes === 1 ? "" : "s"} remaining`,
    urgent: true,
  };
}
