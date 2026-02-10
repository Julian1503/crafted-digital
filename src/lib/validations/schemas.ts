import { z } from "zod";

// ─── AUTH ────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// ─── USERS ──────────────────────────────────────────────────────────

export const userCreateSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
  image: z.string().url().optional().or(z.literal("")),
  active: z.boolean().default(true),
  roleIds: z.array(z.string().min(1)).optional(),
});

export const userUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).max(128).optional(),
  image: z.string().url().optional().or(z.literal("")),
  active: z.boolean().optional(),
  roleIds: z.array(z.string().min(1)).optional(),
});

// ─── ROLES ──────────────────────────────────────────────────────────

export const roleSchema = z.object({
  name: z.string().min(1, "Role name is required").max(50),
  description: z.string().max(255).optional(),
  permissionIds: z.array(z.string().min(1)).optional(),
});

// ─── BLOG POSTS ─────────────────────────────────────────────────────

export const blogPostCreateSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens")
    .optional(),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(1, "Content is required"),
  coverImage: z.string().url().optional().or(z.literal("")),
  status: z.enum(["draft", "published", "scheduled"]).default("draft"),
  publishedAt: z.coerce.date().optional(),
  sortOrder: z.number().int().min(0).default(0),
  tags: z.string().max(500).optional(),
  categories: z.string().max(500).optional(),
  metaTitle: z.string().max(70).optional(),
  metaDesc: z.string().max(160).optional(),
  ogImage: z.string().url().optional().or(z.literal("")),
});

export const blogPostUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens")
    .optional(),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(1).optional(),
  coverImage: z.string().url().optional().or(z.literal("")),
  status: z.enum(["draft", "published", "scheduled"]).optional(),
  publishedAt: z.coerce.date().optional().nullable(),
  sortOrder: z.number().int().min(0).optional(),
  tags: z.string().max(500).optional(),
  categories: z.string().max(500).optional(),
  metaTitle: z.string().max(70).optional(),
  metaDesc: z.string().max(160).optional(),
  ogImage: z.string().url().optional().or(z.literal("")),
  deleted: z.boolean().optional(),
});

// ─── CASE STUDIES ───────────────────────────────────────────────────

export const caseStudyCreateSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens")
    .optional(),
  summary: z.string().max(500).optional(),
  body: z.string().min(1, "Body is required"),
  coverImage: z.string().url().optional().or(z.literal("")),
  gallery: z.string().optional(),
  status: z.enum(["draft", "published", "scheduled"]).default("draft"),
  publishedAt: z.coerce.date().optional(),
  featured: z.boolean().default(false),
  sortOrder: z.number().int().min(0).default(0),
  metaTitle: z.string().max(70).optional(),
  metaDesc: z.string().max(160).optional(),
  ogImage: z.string().url().optional().or(z.literal("")),
});

export const caseStudyUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens")
    .optional(),
  summary: z.string().max(500).optional(),
  body: z.string().min(1).optional(),
  coverImage: z.string().url().optional().or(z.literal("")),
  gallery: z.string().optional(),
  status: z.enum(["draft", "published", "scheduled"]).optional(),
  publishedAt: z.coerce.date().optional().nullable(),
  featured: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
  metaTitle: z.string().max(70).optional(),
  metaDesc: z.string().max(160).optional(),
  ogImage: z.string().url().optional().or(z.literal("")),
  deleted: z.boolean().optional(),
});

// ─── CONTENT BLOCKS ─────────────────────────────────────────────────

export const contentBlockSchema = z.object({
  section: z.string().min(1, "Section is required").max(100),
  title: z.string().max(200).optional(),
  content: z.string().optional(),
  sortOrder: z.number().int().min(0).default(0),
  active: z.boolean().default(true),
});

// ─── MEDIA ASSETS ───────────────────────────────────────────────────

export const mediaAssetSchema = z.object({
  url: z.string().url("Invalid URL"),
  filename: z.string().min(1, "Filename is required").max(255),
  mimeType: z.string().min(1, "MIME type is required").max(100),
  size: z.number().int().min(0).default(0),
  width: z.number().int().min(0).optional(),
  height: z.number().int().min(0).optional(),
  alt: z.string().max(255).optional(),
  title: z.string().max(255).optional(),
  tags: z.string().max(500).optional(),
  folder: z.string().min(1).max(100).default("general"),
});

// ─── LEADS ──────────────────────────────────────────────────────────

export const leadCreateSchema = z.object({
  source: z.string().min(1).max(50).default("website"),
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().max(30).optional(),
  message: z.string().max(2000).optional(),
  status: z.enum(["new", "contacted", "qualified", "lost", "won"]).default("new"),
  tags: z.string().max(500).optional(),
});

export const leadUpdateSchema = z.object({
  source: z.string().min(1).max(50).optional(),
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(30).optional(),
  message: z.string().max(2000).optional(),
  status: z.enum(["new", "contacted", "qualified", "lost", "won"]).optional(),
  tags: z.string().max(500).optional(),
  deleted: z.boolean().optional(),
});

export const leadNoteSchema = z.object({
  leadId: z.string().min(1, "Lead ID is required"),
  content: z.string().min(1, "Content is required").max(2000),
});

// ─── BOOKINGS ───────────────────────────────────────────────────────

export const bookingCreateSchema = z.object({
  customerName: z.string().min(1, "Customer name is required").max(100),
  customerEmail: z.string().email("Invalid email address"),
  customerPhone: z.string().max(30).optional(),
  date: z.coerce.date(),
  duration: z.number().int().min(1).optional(),
  status: z.enum(["pending", "confirmed", "cancelled", "completed"]).default("pending"),
  notes: z.string().max(2000).optional(),
});

export const bookingUpdateSchema = z.object({
  customerName: z.string().min(1).max(100).optional(),
  customerEmail: z.string().email().optional(),
  customerPhone: z.string().max(30).optional(),
  date: z.coerce.date().optional(),
  duration: z.number().int().min(1).optional(),
  status: z.enum(["pending", "confirmed", "cancelled", "completed"]).optional(),
  notes: z.string().max(2000).optional(),
  deleted: z.boolean().optional(),
});

export const bookingNoteSchema = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
  content: z.string().min(1, "Content is required").max(2000),
});

// ─── PLANS ──────────────────────────────────────────────────────────

export const planCreateSchema = z.object({
  name: z.string().min(1, "Plan name is required").max(100),
  description: z.string().max(500).optional(),
  price: z.number().min(0, "Price must be non-negative").default(0),
  currency: z.string().length(3, "Currency must be a 3-letter code").default("AUD"),
  interval: z.enum(["one-time", "monthly", "yearly"]).default("one-time"),
  features: z.string().optional(),
  sortOrder: z.number().int().min(0).default(0),
  active: z.boolean().default(true),
  highlighted: z.boolean().default(false),
});

export const planUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  price: z.number().min(0).optional(),
  currency: z.string().length(3).optional(),
  interval: z.enum(["one-time", "monthly", "yearly"]).optional(),
  features: z.string().optional(),
  sortOrder: z.number().int().min(0).optional(),
  active: z.boolean().optional(),
  highlighted: z.boolean().optional(),
});

// ─── COUPONS ────────────────────────────────────────────────────────

export const couponCreateSchema = z
  .object({
    code: z
      .string()
      .min(1, "Coupon code is required")
      .max(50)
      .regex(/^[A-Z0-9_-]+$/, "Code must be uppercase alphanumeric with hyphens/underscores"),
    type: z.enum(["percent", "fixed"]).default("percent"),
    amount: z.number().min(0, "Amount must be non-negative"),
    maxRedemptions: z.number().int().min(1).optional(),
    expiresAt: z.coerce.date().optional(),
    active: z.boolean().default(true),
  })
  .refine((data) => !(data.type === "percent" && data.amount > 100), {
    message: "Percentage discount cannot exceed 100",
    path: ["amount"],
  });

export const couponUpdateSchema = z.object({
  code: z
    .string()
    .min(1)
    .max(50)
    .regex(/^[A-Z0-9_-]+$/, "Code must be uppercase alphanumeric with hyphens/underscores")
    .optional(),
  type: z.enum(["percent", "fixed"]).optional(),
  amount: z.number().min(0).optional(),
  maxRedemptions: z.number().int().min(1).optional().nullable(),
  expiresAt: z.coerce.date().optional().nullable(),
  active: z.boolean().optional(),
});

// ─── INTEGRATIONS ───────────────────────────────────────────────────

export const integrationSchema = z.object({
  name: z.string().min(1, "Integration name is required").max(100),
  enabled: z.boolean().default(false),
  config: z.string().optional(),
  status: z.enum(["connected", "disconnected", "error"]).default("disconnected"),
});

// ─── SITE SETTINGS ──────────────────────────────────────────────────

export const siteSettingSchema = z.object({
  key: z.string().min(1, "Key is required").max(100),
  value: z.string().min(1, "Value is required").max(5000),
  group: z.string().min(1).max(50).default("general"),
});

// ─── UTILITY SCHEMAS ────────────────────────────────────────────────

export const reorderSchema = z.array(
  z.object({
    id: z.string().min(1),
    sortOrder: z.number().int().min(0),
  })
);

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().max(200).optional(),
  sortBy: z.string().max(50).optional(),
  sortDir: z.enum(["asc", "desc"]).default("asc"),
});
