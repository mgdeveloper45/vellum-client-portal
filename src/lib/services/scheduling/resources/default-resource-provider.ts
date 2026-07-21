import type {
  SchedulingResourceProvider,
  StaffAvailability,
} from "./resource-provider";

export class DefaultSchedulingResourceProvider
  implements SchedulingResourceProvider
{
  async getStaffAvailability(
    _workspaceId: string,
    staffId: string,
    _bookingDate: Date,
  ): Promise<StaffAvailability | null> {
    void _workspaceId;
    void _bookingDate;

    return {
      staffId,
      enabled: true,
      workingHours: {
        open: "09:00",
        close: "17:00",
      },
    };
  }
}