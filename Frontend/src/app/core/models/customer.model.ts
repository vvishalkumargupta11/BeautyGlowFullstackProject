export interface Customer {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  role: string;
  createdAt?: string;
}

export interface CustomersResponse {
  message: string;
  total: number;
  customers: Customer[];
}