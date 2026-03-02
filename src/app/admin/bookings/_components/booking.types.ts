export interface BookingNote {
  id: string;
  content: string;
  createdAt: string;
  author: { name: string | null; email: string } | null;
}

export interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  date: string;
  duration: number;
  status: string;
  notes: string | null;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedBookings {
  data: Booking[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
