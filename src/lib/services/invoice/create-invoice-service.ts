import type {
  InvoiceMutationRecord,
  InvoiceRepository,
} from "./invoice-repository";

export type CreateInvoiceServiceResult =
  | {
      success: true;
      invoice: InvoiceMutationRecord;
    }
  | {
      success: false;
      code: "PROJECT_NOT_FOUND";
    };

export class CreateInvoiceService {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  async execute(input: {
    projectId: string;
    workspaceId: string;
    amount: number;
  }): Promise<CreateInvoiceServiceResult> {
    const projectExists = await this.invoiceRepository.projectExistsInWorkspace(
      {
        projectId: input.projectId,
        workspaceId: input.workspaceId,
      },
    );

    if (!projectExists) {
      return {
        success: false,
        code: "PROJECT_NOT_FOUND",
      };
    }

    const invoice = await this.invoiceRepository.createInvoice({
      projectId: input.projectId,
      amount: input.amount,
    });

    return {
      success: true,
      invoice,
    };
  }
}
