import { RegisterForm } from "@/presentation/components/auth/register-form";
import { ThemeToggle } from "@/presentation/components/shared/theme-toggle";

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="absolute top-4 left-4">
        <ThemeToggle />
      </div>
      <RegisterForm />
    </div>
  );
}
