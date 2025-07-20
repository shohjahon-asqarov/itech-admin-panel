import { apiService, ApiResponse } from "./api";
import { User } from "../types";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterData {
  name: string;
  phone: string;
  password: string;
  password_confirmation: string;
}

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await apiService.post<LoginResponse>(
      "/auth/login",
      credentials
    );
    return response.data.data!;
  }

  static async register(data: RegisterData): Promise<LoginResponse> {
    const response = await apiService.post<LoginResponse>(
      "/auth/register",
      data
    );
    return response.data.data!;
  }

  static async logout(): Promise<void> {
    try {
      await apiService.post("/auth/logout");
    } catch (error) {
      // Even if logout fails, we should clear local storage
      console.warn("Logout request failed, but clearing local storage");
    }
  }

  static async getProfile(): Promise<User> {
    const response = await apiService.get<User>("/auth/profile");
    return response.data.data!;
  }

  static async updateProfile(data: Partial<User>): Promise<User> {
    const response = await apiService.put<User>("/auth/profile", data);
    return response.data.data!;
  }

  static async changePassword(data: {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
  }): Promise<void> {
    await apiService.post("/auth/change-password", data);
  }

  static async refreshToken(): Promise<{ token: string }> {
    const response = await apiService.post<{ token: string }>("/auth/refresh");
    return response.data.data!;
  }

  // Helper methods for token management
  static setToken(token: string): void {
    localStorage.setItem("admin_token", token);
  }

  static getToken(): string | null {
    return localStorage.getItem("admin_token");
  }

  static removeToken(): void {
    localStorage.removeItem("admin_token");
  }

  static isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      // Basic JWT token validation (check if it's expired)
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }
}
