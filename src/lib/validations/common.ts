import { z } from "zod";

export const msg = {
  required: (f: string) => `${f} is required`,
  empty: (f: string) => `${f} cannot be empty`,
  max: (f: string, n: number) => `${f} must be ${n} characters or less`,
  min: (f: string, n: number) => `${f} must be at least ${n} characters long`,
  url: (f: string) => `${f} must be a valid URL`,
  email: () => "Email must be a valid email address",
  oneOf: (f: string, values: readonly string[]) => `${f} must be one of: ${values.join(", ")}`,
  int: (f: string) => `${f} must be an integer`,
  gte: (f: string, n: number) => `${f} must be ${n} or greater`,
};

const withMax = (label: string, schema: z.ZodString, maxLen?: number) =>
  maxLen ? schema.max(maxLen, msg.max(label, maxLen)) : schema;

export const v = {
  reqStr: (label: string, maxLen?: number) =>
    withMax(label, z.string(msg.required(label)).min(1, msg.required(label)), maxLen),

  optStr: (label: string, maxLen?: number) =>
    withMax(label, z.string().min(1, msg.empty(label)), maxLen).optional().nullable(),

  optUrlOrEmpty: (label: string) => z.url(msg.url(label)).optional().or(z.literal("")),

  enum: <T extends [string, ...string[]]>(label: string, values: T) =>
    z.enum(values, { message: msg.oneOf(label, values) }),
  floatMin: (label: string, min: number) => z.number().min(min, msg.gte(label, min)),

  intMin: (label: string, min: number) => z.number().int(msg.int(label)).min(min, msg.gte(label, min)),

  bool: (label: string) => z.boolean({ message: `${label} must be a boolean value` }),

  date: (label: string) => z.coerce.date({ message: `${label} must be a valid date` }),
};

export const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const slugMessage = "Slug must be lowercase alphanumeric with hyphens";