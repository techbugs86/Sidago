import { api } from "@/lib/api";
import type { UserRole } from "@/lib/navigation";

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  };
}

export interface MessageResponse {
  message: string;
}

export const authApi = {
  forgotPassword: (email: string) =>
    api.post<MessageResponse>("/auth/forgot-password", { email }),

  resetPassword: (data: { newPassword: string; token: string }) =>
    api.post<MessageResponse>("/auth/reset-password", data),

  login: (data: { email: string; password: string }) =>
    api.post<LoginResponse>("/auth/login", data),
};
