"use client";

import Link from "next/link";
import { UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { FormBuilder, type FieldDef } from "@/presentation/components/ui/form-builder";
import { useRegister } from "@/presentation/hooks/use-auth";
import { registerSchema, type RegisterFormValues } from "@/lib/schemas/auth.schema";

const fields: FieldDef[] = [
  { name: "name",     label: "نام و نام خانوادگی", type: "text",     placeholder: "علی محمدی" },
  { name: "email",    label: "ایمیل",               type: "email",    placeholder: "example@domain.com", dir: "ltr" },
  { name: "password", label: "رمز عبور",             type: "password", placeholder: "حداقل ۶ کاراکتر" },
];

export function RegisterForm() {
  const register = useRegister();
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

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
        {register.error && (
          <p className="mb-3 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            خطا در ثبت‌نام. لطفاً دوباره تلاش کنید.
          </p>
        )}
        <FormBuilder
          form={form}
          fields={fields}
          onSubmit={(v) => register.mutate(v)}
          submitLabel="ایجاد حساب"
          submitIcon={<UserPlus className="h-4 w-4" />}
          loading={register.isPending}
        />
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
