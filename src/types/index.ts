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