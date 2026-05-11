import { z } from "zod";

export const projectFormSchema = z.object({
  name: z
    .string()
    .min(1, "نام پروژه الزامی است")
    .min(3, "نام پروژه باید حداقل ۳ کاراکتر باشد")
    .max(100, "نام پروژه نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد"),
  description: z.string().max(500, "توضیحات نمی‌تواند بیشتر از ۵۰۰ کاراکتر باشد").optional(),
});

export const addMemberSchema = z.object({
  userId: z.string().min(1, "شناسه کاربری الزامی است"),
  role: z.enum(["EDITOR", "VIEWER"]),
});

export const diagramFormSchema = z.object({
  type: z.string().min(1, "نوع دیاگرام را انتخاب کنید"),
  name: z.string().min(1, "نام دیاگرام الزامی است"),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;
export type AddMemberFormValues = z.infer<typeof addMemberSchema>;
export type DiagramFormValues = z.infer<typeof diagramFormSchema>;
