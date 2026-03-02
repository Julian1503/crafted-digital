import { z } from "zod";
import { msg } from "./common";

export const loginSchema = z.object({
  email: z.string().email(msg.email()),
  password: z.string().min(6, msg.min("Password", 6)),
});