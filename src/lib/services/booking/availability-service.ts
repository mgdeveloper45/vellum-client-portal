export function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;
}

export function minutesToTime(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function generateTimeSlots({
  openTime,
  closeTime,
  duration,
}: {
  openTime: string;
  closeTime: string;
  duration: number;
}) {
  const start = timeToMinutes(openTime);
  const end = timeToMinutes(closeTime);

  const slots: string[] = [];

  for (let current = start; current + duration <= end; current += duration) {
    slots.push(minutesToTime(current));
  }

  return slots;
}

export function removeBookedSlots({
  slots,
  duration,
  bookings,
}: {
  slots: string[];
  duration: number;
  bookings: {
    startTime: string;
    endTime: string;
  }[];
}) {
  return slots.filter((slot) => {
    const slotStart = timeToMinutes(slot);
    const slotEnd = slotStart + duration;

    return !bookings.some((booking) => {
      const bookingStart = timeToMinutes(booking.startTime);
      const bookingEnd = timeToMinutes(booking.endTime);

      return slotStart < bookingEnd && slotEnd > bookingStart;
    });
  });
}
