"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/presentation/components/ui/form";
import { useLogin } from "@/presentation/hooks/use-auth";
import { loginSchema, type LoginFormValues } from "@/lib/schemas/auth.schema";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const login = useLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(values: LoginFormValues) {
    login.mutate(values);
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <span className="text-2xl font-black text-primary">ن</span>
        </div>
        <CardTitle className="text-xl">ورود به نقطه</CardTitle>
        <CardDescription>پلتفرم مدل‌سازی معماری MBSE</CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ایمیل</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="example@domain.com"
                      dir="ltr"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>رمز عبور</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10"
                        dir="ltr"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {login.error && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                ایمیل یا رمز عبور اشتباه است
              </p>
            )}

            <Button type="submit" loading={login.isPending} className="w-full gap-2">
              <LogIn className="h-4 w-4" />
              ورود
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          حساب ندارید؟{" "}
          <Link href="/register" className="text-primary hover:underline font-medium">
            ثبت‌نام کنید
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
