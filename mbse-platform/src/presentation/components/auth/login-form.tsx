"use client";

import Link from "next/link";
import { LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { FormBuilder, type FieldDef } from "@/presentation/components/ui/form-builder";
import { useLogin } from "@/presentation/hooks/use-auth";
import { loginSchema, type LoginFormValues } from "@/lib/schemas/auth.schema";

const fields: FieldDef[] = [
  { name: "email",    label: "ایمیل",    type: "email",    placeholder: "example@domain.com", dir: "ltr" },
  { name: "password", label: "رمز عبور", type: "password" },
];

export function LoginForm() {
  const login = useLogin();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

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
        {login.error && (
          <p className="mb-3 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            ایمیل یا رمز عبور اشتباه است
          </p>
        )}
        <FormBuilder
          form={form}
          fields={fields}
          onSubmit={(v) => login.mutate(v)}
          submitLabel="ورود"
          submitIcon={<LogIn className="h-4 w-4" />}
          loading={login.isPending}
        />
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
