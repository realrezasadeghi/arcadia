"use client";

/**
 * FieldRenderer — renders a list of field definitions inside an existing <Form> context.
 * You control the Form wrapper, submit button, and any extra actions yourself.
 *
 * Usage:
 *   const fields: FieldDef[] = [
 *     { name: "email",    label: "ایمیل",    type: "email",    dir: "ltr" },
 *     { name: "password", label: "رمز عبور", type: "password" },
 *     { name: "role",     label: "نقش",      type: "select",   options: roleOptions },
 *   ];
 *
 *   <Form {...form}>
 *     <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
 *       <FieldRenderer form={form} fields={fields} />
 *       <div className="flex gap-2">
 *         <Button variant="outline" onClick={onCancel}>انصراف</Button>
 *         <Button type="submit" loading={isPending}>ذخیره</Button>
 *         <Button type="button" onClick={doAnythingElse}>کار خاص</Button>
 *       </div>
 *     </form>
 *   </Form>
 */

import { type UseFormReturn, type FieldValues, type Path } from "react-hook-form";
import {
  FieldInput,
  FieldPassword,
  FieldTextarea,
  FieldSelect,
  type SelectOption,
} from "./form-fields";

// ─── Types ─────────────────────────────────────────────────────────────────────

type FieldType = "text" | "email" | "number" | "password" | "textarea" | "select";

export interface FieldDef {
  name: string;
  label?: string;
  description?: string;
  type?: FieldType;
  placeholder?: string;
  /** Required for type: "select" */
  options?: SelectOption[];
  dir?: "ltr" | "rtl" | "auto";
  className?: string;
}

interface FieldRendererProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  fields: FieldDef[];
  /** Wrapper className. Defaults to "flex flex-col gap-4" */
  className?: string;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function FieldRenderer<T extends FieldValues>({
  form,
  fields,
  className,
}: FieldRendererProps<T>) {
  return (
    <div className={className ?? "flex flex-col gap-4"}>
      {fields.map((f) => {
        const name = f.name as Path<T>;
        const common = {
          key: f.name,
          control: form.control,
          name,
          label: f.label,
          description: f.description,
          className: f.className,
        };

        switch (f.type) {
          case "password":
            return <FieldPassword {...common} placeholder={f.placeholder} />;

          case "textarea":
            return <FieldTextarea {...common} placeholder={f.placeholder} />;

          case "select":
            return (
              <FieldSelect
                {...common}
                options={f.options ?? []}
                placeholder={f.placeholder}
              />
            );

          default:
            return (
              <FieldInput
                {...common}
                type={f.type ?? "text"}
                placeholder={f.placeholder}
                dir={f.dir}
              />
            );
        }
      })}
    </div>
  );
}
