import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(1),
  email: z.string(),
  phone: z.string(),
  address: z.string().min(1),
  bedroom: z.string().min(0),
  bathroom: z.string(),
  message: z.string().optional(),
});