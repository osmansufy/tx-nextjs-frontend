import { z } from "zod";

export const profileSchema = z.object({
  first_name: z.string().max(60).optional().or(z.literal("")),
  last_name: z.string().max(60).optional().or(z.literal("")),
  description: z.string().max(500).optional().or(z.literal("")),
  url: z.string().url("Enter a valid URL").or(z.literal("")).optional(),
  email: z.string().email("Enter a valid email").optional(),
});
export type ProfileInput = z.infer<typeof profileSchema>;
