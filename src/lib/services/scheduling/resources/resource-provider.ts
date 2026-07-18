export interface StaffAvailability {
  staffId: string;
  enabled: boolean;
  workingHours: {
    open: string;
    close: string;
  } | null;
}

export interface SchedulingResourceProvider {
  getStaffAvailability(
    workspaceId: string,
    staffId: string,
    bookingDate: Date,
  ): Promise<StaffAvailability | null>;
}
