export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    email: string;
    name: string;
    profile_photo: string;
    id: string;
  };
  token: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
  avatar?: File | null;
}

export interface RegisterResponse {
  user: {
    email: string;
    name: string;
    profile_photo: string;
    id: string | number;
  };
  token: string;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  release_year: string;
  cover_image: string;
  images: string[];
  price: number;
  available_colors: string[];
  available_sizes: string[] | null;
}

export interface ApiLinks {
  first: string;
  last: string;
  prev: string;
  next: string;
}

export interface ApiMetaLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface ApiMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: ApiMetaLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface ProductsApiResponse {
  data: Product[];
  links: ApiLinks;
  meta: ApiMeta;
}