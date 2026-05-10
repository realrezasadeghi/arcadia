"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { container } from "@/infrastructure/api/service-container";
import { useAuthStore } from "@/presentation/stores/auth.store";

export function useCurrentUser() {
  const { setUser } = useAuthStore();
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const user = await container.repos.auth.getCurrentUser();
      setUser(user);
      return user;
    },
    retry: false,
    staleTime: 1000 * 60 * 10,
  });
}

export function useLogin() {
  const { setUser } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (input: { email: string; password: string }) =>
      container.repos.auth.login(input),
    onSuccess: ({ user }) => {
      setUser(user);
      router.push("/projects");
    },
  });
}

export function useRegister() {
  const { setUser } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (input: { name: string; email: string; password: string }) =>
      container.repos.auth.register(input),
    onSuccess: ({ user }) => {
      setUser(user);
      router.push("/projects");
    },
  });
}

export function useLogout() {
  const { clearUser } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: () => container.repos.auth.logout(),
    onSuccess: () => {
      clearUser();
      router.push("/login");
    },
  });
}
