export type ClientStatus =
  | "LEAD"
  | "WAITLIST"
  | "CONSULTATION"
  | "DEPOSIT_PENDING"
  | "ACTIVE"
  | "COMPLETED"
  | "ARCHIVED"
  | "BANNED";
export interface ClientSummaryRecord {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  clientStatus: ClientStatus;
  projectCount: number;
}

export interface ClientEditRecord {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  notes: string | null;
  clientStatus: ClientStatus;
  isBlacklisted: boolean;
}

export interface ClientProjectRecord {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  messages: {
    id: string;
  }[];
  invoices: {
    id: string;
    amount: number;
    paid: boolean;
  }[];
  proposals: {
    id: string;
  }[];
}

export interface ClientDetailRecord extends ClientEditRecord {
  clientProjects: ClientProjectRecord[];
}

export interface CreateClientRecordInput {
  workspaceId: string;
  firstName: string;
  lastName: string;
  email: string;
  notes: string;
  password: string;
  clientStatus: ClientStatus;
}

export interface UpdateClientRecordInput {
  workspaceId: string;
  clientId: string;
  firstName: string;
  lastName: string;
  email: string;
  notes: string;
  clientStatus: ClientStatus;
  isBlacklisted: boolean;
}

export interface DeleteClientRecordInput {
  workspaceId: string;
  clientId: string;
}

export interface FindClientsInput {
  workspaceId: string;
  clientId?: string;
}

export interface FindClientInput {
  workspaceId: string;
  clientId: string;
}

export interface FindClientByEmailInput {
  email: string;
  excludeClientId?: string;
}

export interface FindWorkspaceClientByEmailInput {
  workspaceId: string;
  email: string;
}

export interface ClientRepository {
  findMany(input: FindClientsInput): Promise<ClientSummaryRecord[]>;

  findDetail(input: FindClientInput): Promise<ClientDetailRecord | null>;

  findForEdit(input: FindClientInput): Promise<ClientEditRecord | null>;

  findByEmail(input: FindClientByEmailInput): Promise<{
    id: string;
  } | null>;

  findWorkspaceClientByEmail(input: FindWorkspaceClientByEmailInput): Promise<{
    id: string;
  } | null>;

  create(input: CreateClientRecordInput): Promise<{
    id: string;
  }>;

  update(input: UpdateClientRecordInput): Promise<boolean>;

  countProjects(input: FindClientInput): Promise<number | null>;

  delete(input: DeleteClientRecordInput): Promise<boolean>;
}
