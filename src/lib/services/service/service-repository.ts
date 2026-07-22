export interface CreateServiceRecordInput {
  name: string;
  description: string | null;
  duration: number;
  price: number;
  workspaceId: string;
}

export interface CreatedServiceRecord {
  id: string;
}

export interface ToggleServiceActiveRecordInput {
  serviceId: string;
  workspaceId: string;
  active: boolean;
}

export interface ServiceRepository {
  create(input: CreateServiceRecordInput): Promise<CreatedServiceRecord>;

  toggleActive(input: ToggleServiceActiveRecordInput): Promise<boolean>;
}
