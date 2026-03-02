export interface LeadNote {
  id: string;
  content: string;
  createdAt: string;
  author: { name: string | null; email: string } | null;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  source: string;
  message: string | null;
  status: string;
  tags: string | null;
  createdAt: string;
  updatedAt: string;
  notes?: LeadNote[];
}

export interface PaginatedLeads {
  data: Lead[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
