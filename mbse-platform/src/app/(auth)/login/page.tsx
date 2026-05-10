import { LoginForm } from "@/presentation/components/auth/login-form";
import { ThemeToggle } from "@/presentation/components/shared/theme-toggle";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="absolute top-4 left-4">
        <ThemeToggle />
      </div>
      <LoginForm />
    </div>
  );
}
