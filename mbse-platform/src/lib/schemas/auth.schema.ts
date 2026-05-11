import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "ایمیل الزامی است")
    .email("فرمت ایمیل صحیح نیست"),
  password: z
    .string()
    .min(1, "رمز عبور الزامی است")
    .min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, "نام الزامی است")
    .min(3, "نام باید حداقل ۳ کاراکتر باشد"),
  email: z
    .string()
    .min(1, "ایمیل الزامی است")
    .email("فرمت ایمیل صحیح نیست"),
  password: z
    .string()
    .min(1, "رمز عبور الزامی است")
    .min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
