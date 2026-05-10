"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
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
  const searchParams = useSearchParams();

  return useMutation({
    mutationFn: (input: { email: string; password: string }) =>
      container.repos.auth.login(input),
    onSuccess: ({ user }) => {
      setUser(user);
      const redirect = searchParams.get("redirect") ?? "/projects";
      router.push(redirect);
      toast.success("خوش آمدید", { description: user.name });
    },
    onError: () => toast.error("ورود ناموفق", { description: "ایمیل یا رمز عبور اشتباه است" }),
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
      toast.success("حساب ایجاد شد", { description: `خوش آمدید، ${user.name}` });
    },
    onError: () => toast.error("ثبت‌نام ناموفق"),
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
