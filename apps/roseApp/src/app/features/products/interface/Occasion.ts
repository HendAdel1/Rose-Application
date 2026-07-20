export interface Occasion {
  id: string;
  title: string;
  description: string;
  image: string;
  immutable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OccasionsApiResponse {
  message?: string;
  metadata?: {
    currentPage: number;
    totalPages: number;
    limit: number;
    totalItems: number;
  };
  occasions?: Occasion[];
  payload?: {
    occasions: Occasion[];
  };
}
