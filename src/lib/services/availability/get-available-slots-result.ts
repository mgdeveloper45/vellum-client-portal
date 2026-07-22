export type GetAvailableSlotsResult =
  | {
      success: true;
      availableSlots: string[];
    }
  | {
      success: false;
      reason:
        | "INVALID_WORKSPACE"
        | "INVALID_SERVICE"
        | "INVALID_DATE"
        | "INVALID_DURATION";
      message: string;
    };
