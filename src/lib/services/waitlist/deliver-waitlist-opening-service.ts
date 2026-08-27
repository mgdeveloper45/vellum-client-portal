import type { WaitlistEntryRecord } from "./waitlist-repository";
import type {
  NotifyNextWaitlistEntryInput,
  NotifyNextWaitlistEntryResult,
} from "./notify-next-waitlist-entry-service";
import type { WaitlistOpeningEmailParams } from "./email-service";

interface NotifyNext {
  execute(
    input: NotifyNextWaitlistEntryInput,
  ): Promise<NotifyNextWaitlistEntryResult>;
}

interface DeliverWaitlistOpeningDependencies {
  notifyNext: NotifyNext;

  sendOpening(params: WaitlistOpeningEmailParams): Promise<void>;

  releaseClaim(input: {
    waitlistEntryId: string;
    workspaceId: string;
  }): Promise<boolean>;

  appUrl: string;
}

export interface DeliverWaitlistOpeningInput {
  workspaceId: string;
  serviceId: string;

  workspaceSlug: string;
  businessName: string;
  serviceName: string;

  requestedDate: Date;
  availableStartTime: string;
}

export type DeliverWaitlistOpeningResult =
  | {
      ok: true;
      entry: WaitlistEntryRecord;
    }
  | {
      ok: false;
      reason: "NO_ELIGIBLE_ENTRY" | "DELIVERY_FAILED";
    };

function dateString(date: Date) {
  return date.toISOString().slice(0, 10);
}

export class DeliverWaitlistOpeningService {
  constructor(
    private readonly dependencies: DeliverWaitlistOpeningDependencies,
  ) {}

  async execute(
    input: DeliverWaitlistOpeningInput,
  ): Promise<DeliverWaitlistOpeningResult> {
    const claim = await this.dependencies.notifyNext.execute({
      workspaceId: input.workspaceId,
      serviceId: input.serviceId,
      requestedDate: input.requestedDate,
      availableStartTime: input.availableStartTime,
    });

    if (!claim.ok) {
      return {
        ok: false,
        reason: "NO_ELIGIBLE_ENTRY",
      };
    }

    const entry = claim.entry;

    const bookingDate = dateString(input.requestedDate);

    const bookingUrl = new URL(
      `/book/${encodeURIComponent(input.workspaceSlug)}`,
      this.dependencies.appUrl,
    );

    bookingUrl.searchParams.set("serviceId", input.serviceId);
    bookingUrl.searchParams.set("date", bookingDate);
    bookingUrl.searchParams.set("time", input.availableStartTime);

    try {
      await this.dependencies.sendOpening({
        email: entry.customerEmail,
        customerName: entry.customerName,
        businessName: input.businessName,
        serviceName: input.serviceName,
        bookingDate,
        availableTime: input.availableStartTime,
        bookingUrl: bookingUrl.toString(),
        expiresAt: entry.expiresAt?.toISOString() ?? "",
      });
    } catch {
      await this.dependencies.releaseClaim({
        waitlistEntryId: entry.id,
        workspaceId: input.workspaceId,
      });

      return {
        ok: false,
        reason: "DELIVERY_FAILED",
      };
    }

    return {
      ok: true,
      entry,
    };
  }
}
