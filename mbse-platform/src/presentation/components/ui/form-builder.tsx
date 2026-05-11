"use client";

/**
 * Schema-driven FormBuilder.
 * Define fields as a config array and get a fully functional form.
 *
 * Usage:
 *   const fields: FieldDef[] = [
 *     { name: "email",    label: "ایمیل",     type: "email",    dir: "ltr" },
 *     { name: "password", label: "رمز عبور",  type: "password" },
 *     { name: "role",     label: "نقش",       type: "select",   options: roleOptions },
 *   ];
 *
 *   <FormBuilder
 *     form={form}
 *     fields={fields}
 *     onSubmit={onSubmit}
 *     submitLabel="ذخیره"
 *     loading={isPending}
 *   />
 */

import { type UseFormReturn, type FieldValues, type Path } from "react-hook-form";
import { Form } from "./form";
import {
  FieldInput, FieldPassword, FieldTextarea, FieldSelect,
  type SelectOption,
} from "./form-fields";
import { Button } from "./button";

// ─── Field definition ──────────────────────────────────────────────────────────

type FieldType = "text" | "email" | "number" | "password" | "textarea" | "select";

export interface FieldDef {
  name: string;
  label?: string;
  description?: string;
  type?: FieldType;
  placeholder?: string;
  /** For type: "select" */
  options?: SelectOption[];
  dir?: "ltr" | "rtl" | "auto";
  className?: string;
}

// ─── FormBuilder ───────────────────────────────────────────────────────────────

interface FormBuilderProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  fields: FieldDef[];
  onSubmit: (values: T) => void;
  /** Label of submit button */
  submitLabel?: string;
  /** Icon rendered inside submit button (before label) */
  submitIcon?: React.ReactNode;
  /** Show loading spinner on submit button */
  loading?: boolean;
  /** Extra buttons rendered before the submit button (e.g. cancel) */
  actions?: React.ReactNode;
  className?: string;
}

export function FormBuilder<T extends FieldValues>({
  form,
  fields,
  onSubmit,
  submitLabel = "ذخیره",
  submitIcon,
  loading = false,
  actions,
  className,
}: FormBuilderProps<T>) {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={className ?? "flex flex-col gap-4"}
      >
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

        <div className="flex items-center justify-end gap-2 pt-1">
          {actions}
          <Button type="submit" loading={loading} className="gap-2">
            {submitIcon}
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
