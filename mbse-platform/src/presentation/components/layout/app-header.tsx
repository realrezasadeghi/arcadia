"use client";

import { PanelRightOpen, PanelRightClose } from "lucide-react";
import { Button } from "@/presentation/components/ui/button";
import { ThemeToggle } from "@/presentation/components/shared/theme-toggle";
import { UserMenu } from "./user-menu";
import { SaveStatusIndicator } from "./save-status-indicator";
import { useUIStore } from "@/presentation/stores/ui.store";

interface AppHeaderProps {
  title?: string;
}

export function AppHeader({ title }: AppHeaderProps) {
  const { sidebarOpen, toggleSidebar } = useUIStore();

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b bg-background px-3">
      <Button variant="ghost" size="icon" onClick={toggleSidebar} className="h-8 w-8">
        {sidebarOpen ? (
          <PanelRightOpen className="h-4 w-4" />
        ) : (
          <PanelRightClose className="h-4 w-4" />
        )}
      </Button>

      {title && (
        <h1 className="text-sm font-medium text-foreground truncate">{title}</h1>
      )}

      <div className="mr-auto flex items-center gap-1">
        <SaveStatusIndicator />
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
