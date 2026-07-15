import { ZodSchema } from "zod";

export function validateFormData<T>(schema: ZodSchema<T>, values: unknown): T {
  return schema.parse(values);
}
