export interface StaffTimeOffRecord {
  id: string;
  workspaceId: string;
  staffId: string;
  reason: string | null;
  startDate: Date;
  endDate: Date;
  enabled: boolean;
}

export interface FindStaffTimeOffRequest {
  workspaceId: string;
  staffId: string;
  bookingDate: Date;
}

export interface StaffTimeOffRepository {
  findActiveTimeOff(
    request: FindStaffTimeOffRequest,
  ): Promise<StaffTimeOffRecord | null>;
}
