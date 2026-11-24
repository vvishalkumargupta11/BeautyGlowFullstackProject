export interface SalonService {
  _id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  benefits: string[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SalonServicesResponse {
  message: string;
  total: number;
  services: SalonService[];
}

export interface SalonServiceResponse {
  message: string;
  service: SalonService;
}