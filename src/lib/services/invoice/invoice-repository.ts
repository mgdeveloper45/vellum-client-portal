export type InvoiceMutationRecord = {
  id: string;
  projectId: string;
  amount: number;
  paid: boolean;
};

export type InvoiceListRecord = {
  id: string;
  amount: number;
  paid: boolean;
  createdAt: Date;
  project: {
    id: string;
    name: string;
    client: {
      id: string;
      firstName: string;
      lastName: string;
    };
  };
};

export type InvoiceCollectionsRecord = {
  id: string;
  amount: number;
  paid: boolean;
  createdAt: Date;

  project: {
    id: string;
    name: string;

    client: {
      id: string;
      firstName: string;
      lastName: string;
    };
  };
};

export type InvoicePdfRecord = {
  id: string;
  amount: number;
  paid: boolean;
  createdAt: Date;
  project: {
    id: string;
    name: string;
    client: {
      firstName: string;
      lastName: string;
    };
    workspace: {
      name: string;
      companyName: string | null;
    } | null;
  };
};

export interface InvoiceRepository {
  projectExistsInWorkspace(input: {
    projectId: string;
    workspaceId: string;
  }): Promise<boolean>;

  createInvoice(input: {
    projectId: string;
    amount: number;
  }): Promise<InvoiceMutationRecord>;

  findInvoiceForMutation(input: {
    invoiceId: string;
    projectId: string;
    workspaceId: string;
  }): Promise<InvoiceMutationRecord | null>;

  updateInvoicePaid(input: {
    invoiceId: string;
    paid: boolean;
  }): Promise<InvoiceMutationRecord>;

  deleteInvoice(invoiceId: string): Promise<void>;

  findInvoices(input: {
    workspaceId: string;
    clientId?: string;
  }): Promise<InvoiceListRecord[]>;

  findInvoiceForPdf(input: {
    invoiceId: string;
    workspaceId: string;
  }): Promise<InvoicePdfRecord | null>;
}
