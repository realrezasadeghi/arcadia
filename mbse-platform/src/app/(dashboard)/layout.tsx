import { AppHeader } from "@/presentation/components/layout/app-header";
import { TooltipProvider } from "@/presentation/components/ui/tooltip";
import { ToastContainer } from "@/presentation/components/ui/toast-container";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex h-screen flex-col overflow-hidden">
        <AppHeader />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
      <ToastContainer />
    </TooltipProvider>
  );
}
