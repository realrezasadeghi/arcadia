"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/presentation/components/ui/form";
import { useRegister } from "@/presentation/hooks/use-auth";
import { registerSchema, type RegisterFormValues } from "@/lib/schemas/auth.schema";

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const register = useRegister();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  function onSubmit(values: RegisterFormValues) {
    register.mutate(values);
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <span className="text-2xl font-black text-primary">ن</span>
        </div>
        <CardTitle className="text-xl">ثبت‌نام در نقطه</CardTitle>
        <CardDescription>یک حساب رایگان بسازید</CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نام و نام خانوادگی</FormLabel>
                  <FormControl>
                    <Input placeholder="علی محمدی" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                        placeholder="حداقل ۶ کاراکتر"
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

            {register.error && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                خطا در ثبت‌نام. لطفاً دوباره تلاش کنید.
              </p>
            )}

            <Button type="submit" loading={register.isPending} className="w-full gap-2">
              <UserPlus className="h-4 w-4" />
              ایجاد حساب
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          قبلاً ثبت‌نام کرده‌اید؟{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">
            وارد شوید
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
