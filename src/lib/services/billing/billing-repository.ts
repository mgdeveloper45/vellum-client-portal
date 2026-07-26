export type BillingSubscription = {
  id: string;
  stripeCustomerId: string | null;
};

export type WorkspaceBillingAccount = {
  workspaceId: string;
  workspaceName: string;
  userEmail: string | null;
  subscription: BillingSubscription | null;
};

export interface BillingRepository {
  findWorkspaceBillingAccountByUserId(
    userId: string,
  ): Promise<WorkspaceBillingAccount | null>;

  createSubscription(workspaceId: string): Promise<BillingSubscription>;

  updateStripeCustomerId(
    subscriptionId: string,
    stripeCustomerId: string,
  ): Promise<void>;

  findStripeCustomerIdByUserId(userId: string): Promise<string | null>;
}
