export enum ToggleServiceActiveErrorCode {
  SERVICE_NOT_FOUND = "SERVICE_NOT_FOUND",
  SERVICE_UPDATE_FAILED = "SERVICE_UPDATE_FAILED",
}

export interface ToggleServiceActiveSuccess {
  success: true;
  serviceId: string;
  active: boolean;
}

export interface ToggleServiceActiveFailure {
  success: false;
  code: ToggleServiceActiveErrorCode;
  reasons: string[];
}

export type ToggleServiceActiveResult =
  ToggleServiceActiveSuccess | ToggleServiceActiveFailure;
