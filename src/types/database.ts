export type UserRole =
  | "ADMIN"
  | "CLIENT";

export type ProjectStatus =
  | "PLANNING"
  | "ACTIVE"
  | "REVIEW"
  | "COMPLETED";

export type MilestoneStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETE";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  clientId: string;
}

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  status: MilestoneStatus;
}

export interface Message {
  id: string;
  projectId: string;
  senderId: string;
  content: string;
}

export interface Proposal {
  id: string;
  projectId: string;
  approved: boolean;
}

export interface Invoice {
  id: string;
  projectId: string;
  amount: number;
  paid: boolean;
}