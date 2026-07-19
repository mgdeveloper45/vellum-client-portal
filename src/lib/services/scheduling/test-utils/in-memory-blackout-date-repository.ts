import type {
  BlackoutDateRecord,
  BlackoutDateRepository,
  FindBlackoutDateRequest,
} from "@/lib/repositories/blackout-date-repository";

export class InMemoryBlackoutDateRepository implements BlackoutDateRepository {
  constructor(private readonly blackoutDates: BlackoutDateRecord[] = []) {}

  async findActiveBlackoutForDate(
    request: FindBlackoutDateRequest,
  ): Promise<BlackoutDateRecord | null> {
    return (
      this.blackoutDates.find((blackoutDate) => {
        if (!blackoutDate.enabled) {
          return false;
        }

        if (blackoutDate.workspaceId !== request.workspaceId) {
          return false;
        }

        return (
          blackoutDate.startDate <= request.bookingDate &&
          blackoutDate.endDate >= request.bookingDate
        );
      }) ?? null
    );
  }
}
