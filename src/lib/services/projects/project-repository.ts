export type ProjectStatus = "PLANNING" | "ACTIVE" | "REVIEW" | "COMPLETED";

export interface ProjectPersonRecord {
  id: string;
  firstName: string;
  lastName: string;
}

export interface ProjectListRecord {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  createdAt: Date;
  client: ProjectPersonRecord;
}

export interface ProjectEditRecord {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  clientId: string;
  ownerId: string;
}

export interface ProjectAuditRecord {
  id: string;
  name: string;
  status: ProjectStatus;
  clientId: string;
}

export interface ProjectDetailRecord {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  ownerId: string;
  clientId: string;
  workspaceId: string | null;
  createdAt: Date;
  updatedAt: Date;

  client: ProjectPersonRecord;

  milestones: {
    id: string;
    title: string;
    status: string;
    dueDate: Date | null;
    createdAt: Date;
  }[];

  invoices: {
    id: string;
    amount: number;
    paid: boolean;
    createdAt: Date;
  }[];

  proposals: {
    id: string;
    approved: boolean;
    createdAt: Date;
  }[];

  files: {
    id: string;
    name: string;
    url: string;
    fileType: string;
    projectId: string;
    createdAt: Date;
  }[];

  messages: {
    id: string;
    content: string;
    senderId: string;
    projectId: string;
    createdAt: Date;
    sender: {
      id: string;
      firstName: string;
      lastName: string;
      role: string;
    };
  }[];
}

export interface ProjectDependencyCounts {
  files: number;
  milestones: number;
  messages: number;
  invoices: number;
  proposals: number;
}

export interface FindProjectsInput {
  workspaceId: string;
  clientId?: string;
}

export interface FindProjectInput {
  workspaceId: string;
  projectId: string;
}

export interface FindProjectForViewerInput extends FindProjectInput {
  clientId?: string;
}

export interface CreateProjectRecordInput {
  workspaceId: string;
  name: string;
  description: string;
  status: ProjectStatus;
  ownerId: string;
  clientId: string;
}

export interface UpdateProjectRecordInput extends CreateProjectRecordInput {
  projectId: string;
}

export interface ProjectRepository {
  findMany(input: FindProjectsInput): Promise<ProjectListRecord[]>;

  findDetail(
    input: FindProjectForViewerInput,
  ): Promise<ProjectDetailRecord | null>;

  findForEdit(input: FindProjectInput): Promise<ProjectEditRecord | null>;

  findWorkspaceClients(workspaceId: string): Promise<ProjectPersonRecord[]>;

  isWorkspaceClient(workspaceId: string, clientId: string): Promise<boolean>;

  isWorkspaceProjectOwner(
    workspaceId: string,
    ownerId: string,
  ): Promise<boolean>;

  create(input: CreateProjectRecordInput): Promise<ProjectAuditRecord>;

  update(input: UpdateProjectRecordInput): Promise<ProjectAuditRecord | null>;

  findDependencies(
    input: FindProjectInput,
  ): Promise<ProjectDependencyCounts | null>;

  delete(input: FindProjectInput): Promise<ProjectAuditRecord | null>;
}
