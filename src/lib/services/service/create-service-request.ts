export interface CreateServiceRequest {
  workspaceId: string;
  name: string;
  description?: string;
  duration: number;
  priceDollars: number;
}
