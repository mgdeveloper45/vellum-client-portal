export type AiGeneratedDocumentType =
  | "EMAIL"
  | "INVOICE"
  | "BOOKING"
  | "PROPOSAL";

export interface AiGeneratedDocument {
  type: AiGeneratedDocumentType;
  title: string;
  content: string;
  preview: string;
  metadata?: Record<string, unknown>;
}