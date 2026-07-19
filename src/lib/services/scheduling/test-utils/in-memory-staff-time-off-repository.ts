import type {
  FindStaffTimeOffRequest,
  StaffTimeOffRecord,
  StaffTimeOffRepository,
} from "@/lib/repositories/staff-time-off-repository";

export class InMemoryStaffTimeOffRepository
  implements StaffTimeOffRepository
{
  constructor(
    private readonly timeOffEntries: StaffTimeOffRecord[] = [],
  ) {}

  async findActiveTimeOff(
    request: FindStaffTimeOffRequest,
  ): Promise<StaffTimeOffRecord | null> {
    return (
      this.timeOffEntries.find((entry) => {
        if (!entry.enabled) {
          return false;
        }

        if (entry.workspaceId !== request.workspaceId) {
          return false;
        }

        if (entry.staffId !== request.staffId) {
          return false;
        }

        return (
          entry.startDate <= request.bookingDate &&
          entry.endDate >= request.bookingDate
        );
      }) ?? null
    );
  }
}