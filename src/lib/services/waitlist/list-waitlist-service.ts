import type {
  WaitlistEntryRecord,
  WaitlistEntryStatus,
  WaitlistRepository,
} from "./waitlist-repository";

export interface ListWaitlistRequest {
  workspaceId: string;
  serviceId?: string;
  status?: WaitlistEntryStatus;
}

export class ListWaitlistService {
  constructor(
    private readonly waitlistRepository: WaitlistRepository,
  ) {}

  async execute(
    request: ListWaitlistRequest,
  ): Promise<WaitlistEntryRecord[]> {
    return this.waitlistRepository.list({
      workspaceId: request.workspaceId,
      serviceId: request.serviceId,
      status: request.status,
    });
  }
}
