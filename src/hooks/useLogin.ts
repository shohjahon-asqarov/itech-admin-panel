import { useMutation } from "@tanstack/react-query";
import { AuthService } from "@/services/authService";

export function useLogin() {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      AuthService.login({ email, password }),
  });
}
