export interface BookableService {
  id: string;
  workspaceId: string;
  name: string;
  duration: number;
  price: number;
}

export interface ServiceRepository {
  findActiveService(
    serviceId: string,
    workspaceId: string,
  ): Promise<BookableService | null>;
}
