import type {
  WaitlistEntryRecord,
  WaitlistRepository,
} from "./waitlist-repository";

export interface NotifyNextWaitlistEntryInput {
  workspaceId: string;
  serviceId: string;
  requestedDate: Date;
  availableStartTime: string;
}

export type NotifyNextWaitlistEntryResult =
  | {
      ok: true;
      entry: WaitlistEntryRecord;
    }
  | {
      ok: false;
      reason: "NO_ELIGIBLE_ENTRY";
    };

const CLAIM_WINDOW_MINUTES = 30;

export class NotifyNextWaitlistEntryService {
  constructor(
    private readonly waitlistRepository: WaitlistRepository,
    private readonly now: () => Date = () => new Date(),
  ) {}

  async execute(
    input: NotifyNextWaitlistEntryInput,
  ): Promise<NotifyNextWaitlistEntryResult> {
    const notifiedAt = this.now();

    const expiresAt = new Date(
      notifiedAt.getTime() + CLAIM_WINDOW_MINUTES * 60 * 1000,
    );

    const entry = await this.waitlistRepository.claimNextEligible({
      workspaceId: input.workspaceId,
      serviceId: input.serviceId,
      requestedDate: input.requestedDate,
      availableStartTime: input.availableStartTime,
      notifiedAt,
      expiresAt,
    });

    if (!entry) {
      return {
        ok: false,
        reason: "NO_ELIGIBLE_ENTRY",
      };
    }

    return {
      ok: true,
      entry,
    };
  }
}
