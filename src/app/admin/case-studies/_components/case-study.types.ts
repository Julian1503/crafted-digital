export interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  body: string | null;
  status: "draft" | "published" | "scheduled";
  featured: boolean;
  publishedAt: string | null;
  coverImage: string | null;
  gallery: string | null;
  sortOrder: number;
  metaTitle: string | null;
  metaDesc: string | null;
  ogImage: string | null;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    email: string;
  }
}

export interface PaginatedCaseStudies {
  data: CaseStudy[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
