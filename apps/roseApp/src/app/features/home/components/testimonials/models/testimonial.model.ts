export interface Testimonial {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  avatarUrl?: string | null;
}

export interface TestimonialApiItem {
  id: string;
  name: string;
  content: string;
  rating: number;
  image: string | null;
  isApproved: boolean;
  createdAt: string;
}

export interface TestimonialsApiResponse {
  status: boolean;
  code: number;
  payload: {
    data: TestimonialApiItem[];
    metadata: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}
