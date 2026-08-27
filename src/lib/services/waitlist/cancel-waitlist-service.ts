import { cancelWaitlistEntrySchema } from "@/lib/validation/waitlist";

import type { WaitlistRepository } from "./waitlist-repository";

export type CancelWaitlistResult =
  | {
      ok: true;
    }
  | {
      ok: false;
      error: "INVALID_INPUT" | "NOT_FOUND";
      message: string;
    };

export class CancelWaitlistService {
  constructor(
    private readonly waitlistRepository: WaitlistRepository,
  ) {}

  async execute(input: {
    workspaceId: string;
    waitlistEntryId: string;
  }): Promise<CancelWaitlistResult> {
    const parsed = cancelWaitlistEntrySchema.safeParse({
      waitlistEntryId: input.waitlistEntryId,
    });

    if (!parsed.success || !input.workspaceId.trim()) {
      return {
        ok: false,
        error: "INVALID_INPUT",
        message: "Invalid waitlist entry.",
      };
    }

    const cancelled =
      await this.waitlistRepository.cancel({
        waitlistEntryId:
          parsed.data.waitlistEntryId,
        workspaceId: input.workspaceId,
      });

    if (!cancelled) {
      return {
        ok: false,
        error: "NOT_FOUND",
        message:
          "The waitlist entry could not be cancelled.",
      };
    }

    return {
      ok: true,
    };
  }
}
