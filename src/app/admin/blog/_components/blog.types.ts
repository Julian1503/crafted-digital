export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  status: "draft" | "published" | "scheduled";
  publishedAt: string | null;
  coverImage: string | null;
  tags: string | null;
  categories: string | null;
  author: { id: string; name: string; email: string } | null;
  sortOrder: number;
  metaTitle: string | null;
  metaDesc: string | null;
  ogImage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedPosts {
  data: BlogPost[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
