export interface BlackoutDateRecord {
  id: string;
  workspaceId: string;
  name: string;
  startDate: Date;
  endDate: Date;
  enabled: boolean;
}

export interface FindBlackoutDateRequest {
  workspaceId: string;
  bookingDate: Date;
}

export interface BlackoutDateRepository {
  findActiveBlackoutForDate(
    request: FindBlackoutDateRequest,
  ): Promise<BlackoutDateRecord | null>;
}
