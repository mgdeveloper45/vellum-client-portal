export type WorkspaceSearchData = {
  clients: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  }[];

  projects: {
    id: string;
    name: string;
    description: string;
  }[];

  bookings: {
    id: string;
    customerName: string;
    date: Date;
    startTime: string;
    service: {
      name: string;
    };
  }[];

  invoices: {
    id: string;
    amount: number;
    paid: boolean;
    projectId: string;
    project: {
      name: string;
    };
  }[];

  messages: {
    id: string;
    content: string;
    projectId: string;
    project: {
      name: string;
    };
  }[];

  services: {
    id: string;
    name: string;
    description: string | null;
    duration: number;
    price: number;
  }[];
};

export interface WorkspaceSearchRepository {
  searchWorkspace(params: {
    workspaceId: string;
    query: string;
  }): Promise<WorkspaceSearchData>;
}
