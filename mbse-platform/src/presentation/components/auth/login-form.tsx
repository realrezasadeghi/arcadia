"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { useLogin } from "@/presentation/hooks/use-auth";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const login = useLogin();

  function validate(): boolean {
    const errs: typeof errors = {};
    if (!email) errs.email = "ایمیل الزامی است";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "فرمت ایمیل صحیح نیست";
    if (!password) errs.password = "رمز عبور الزامی است";
    else if (password.length < 6) errs.password = "رمز عبور باید حداقل ۶ کاراکتر باشد";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    login.mutate({ email, password });
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">ایمیل</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              dir="ltr"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">رمز عبور</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                className="pl-10"
                dir="ltr"
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
          </div>

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
