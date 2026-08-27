import type { BookingRule } from "@/lib/services/scheduling/booking-rules";
import type { ServiceRepository } from "@/lib/services/booking/service-repository";
import type { JoinWaitlistInput } from "@/lib/validation/waitlist";
import { joinWaitlistSchema } from "@/lib/validation/waitlist";

import { isWaitlistAllowed } from "./is-waitlist-allowed";

import type {
  WaitlistEntryRecord,
  WaitlistRepository,
} from "./waitlist-repository";

export type JoinWaitlistResult =
  | {
      ok: true;
      entry: WaitlistEntryRecord;
    }
  | {
      ok: false;
      error:
        | "INVALID_INPUT"
        | "SERVICE_NOT_FOUND"
        | "WAITLIST_NOT_ALLOWED"
        | "ALREADY_WAITLISTED";
      message: string;
    };

function requestedDateFromInput(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`);
}

export interface WaitlistRuleProvider {
  getWorkspaceRules(workspaceId: string): Promise<BookingRule[]>;
}

export class JoinWaitlistService {
  constructor(
    private readonly waitlistRepository: WaitlistRepository,
    private readonly serviceRepository: ServiceRepository,
    private readonly ruleProvider: WaitlistRuleProvider,
  ) {}

  async execute(
    input: JoinWaitlistInput,
  ): Promise<JoinWaitlistResult> {
    const parsed = joinWaitlistSchema.safeParse(input);

    if (!parsed.success) {
      return {
        ok: false,
        error: "INVALID_INPUT",
        message:
          parsed.error.issues[0]?.message ??
          "Invalid waitlist request.",
      };
    }

    const data = parsed.data;

    const service =
      await this.serviceRepository.findActiveService(
        data.serviceId,
        data.workspaceId,
      );

    if (!service) {
      return {
        ok: false,
        error: "SERVICE_NOT_FOUND",
        message: "The requested service is not available.",
      };
    }

    const rules = await this.ruleProvider.getWorkspaceRules(
      data.workspaceId,
    );

    if (!isWaitlistAllowed(rules, data.serviceId)) {
      return {
        ok: false,
        error: "WAITLIST_NOT_ALLOWED",
        message: "The waitlist is not available for this service.",
      };
    }

    const requestedDate = requestedDateFromInput(
      data.requestedDate,
    );

    const normalizedEmail =
      data.customerEmail.trim().toLowerCase();

    const existing =
      await this.waitlistRepository.findActiveDuplicate({
        workspaceId: data.workspaceId,
        serviceId: data.serviceId,
        customerEmail: normalizedEmail,
        requestedDate,
      });

    if (existing) {
      return {
        ok: false,
        error: "ALREADY_WAITLISTED",
        message:
          "You are already on the waitlist for this service and date.",
      };
    }

    const entry = await this.waitlistRepository.create({
      workspaceId: data.workspaceId,
      serviceId: data.serviceId,

      customerName: data.customerName.trim(),
      customerEmail: normalizedEmail,
      customerPhone:
        data.customerPhone?.trim() || null,
      notes: data.notes?.trim() || null,

      requestedDate,
      preferredStartTime:
        data.preferredStartTime ?? null,
      preferredEndTime:
        data.preferredEndTime ?? null,
    });

    return {
      ok: true,
      entry,
    };
  }
}
