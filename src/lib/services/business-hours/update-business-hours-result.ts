export type UpdateBusinessHoursResult =
  | {
      success: true;
      updatedDays: number;
    }
  | {
      success: false;
      reason:
        | "INVALID_WORKSPACE"
        | "INCOMPLETE_SCHEDULE"
        | "DUPLICATE_DAY"
        | "INVALID_TIME"
        | "INVALID_TIME_RANGE";
      message: string;
    };
