export type WaitlistEntryStatus =
  "WAITING" | "NOTIFIED" | "BOOKED" | "EXPIRED" | "CANCELLED";

export interface CreateWaitlistEntryRecordInput {
  workspaceId: string;
  serviceId: string;

  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  notes: string | null;

  requestedDate: Date;
  preferredStartTime: string | null;
  preferredEndTime: string | null;
}

export interface WaitlistEntryRecord {
  id: string;
  workspaceId: string;
  serviceId: string;

  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  notes: string | null;

  requestedDate: Date;
  preferredStartTime: string | null;
  preferredEndTime: string | null;

  status: WaitlistEntryStatus;

  notifiedAt: Date | null;
  bookedAt: Date | null;
  expiresAt: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

export interface FindActiveWaitlistEntryInput {
  workspaceId: string;
  serviceId: string;
  customerEmail: string;
  requestedDate: Date;
}

export interface ListWaitlistEntriesInput {
  workspaceId: string;
  serviceId?: string;
  status?: WaitlistEntryStatus;
}

export interface CancelWaitlistEntryInput {
  waitlistEntryId: string;
  workspaceId: string;
}

export interface ClaimNextWaitlistEntryInput {
  workspaceId: string;
  serviceId: string;
  requestedDate: Date;
  availableStartTime: string;
  expiresAt: Date;
  notifiedAt: Date;
}

export interface ReleaseWaitlistClaimInput {
  waitlistEntryId: string;
  workspaceId: string;
}

export interface WaitlistRepository {
  findActiveDuplicate(
    input: FindActiveWaitlistEntryInput,
  ): Promise<WaitlistEntryRecord | null>;

  create(input: CreateWaitlistEntryRecordInput): Promise<WaitlistEntryRecord>;

  list(input: ListWaitlistEntriesInput): Promise<WaitlistEntryRecord[]>;

  cancel(input: CancelWaitlistEntryInput): Promise<boolean>;

  claimNextEligible(
    input: ClaimNextWaitlistEntryInput,
  ): Promise<WaitlistEntryRecord | null>;

  releaseClaim(input: ReleaseWaitlistClaimInput): Promise<boolean>;
}
