export enum CreateServiceErrorCode {
  SERVICE_CREATE_FAILED = "SERVICE_CREATE_FAILED",
}

export interface CreateServiceSuccess {
  success: true;
  serviceId: string;
}

export interface CreateServiceFailure {
  success: false;
  code: CreateServiceErrorCode;
  reasons: string[];
}

export type CreateServiceResult = CreateServiceSuccess | CreateServiceFailure;
