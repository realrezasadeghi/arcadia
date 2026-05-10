"use client";

import { LogOut, Settings, User as UserIcon } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/presentation/components/ui/dropdown-menu";
import { Button } from "@/presentation/components/ui/button";
import { useAuthStore } from "@/presentation/stores/auth.store";
import { useLogout } from "@/presentation/hooks/use-auth";

export function UserMenu() {
  const { user } = useAuthStore();
  const logout = useLogout();

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
            {user.initials}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>
          <p className="font-medium">{user.name}</p>
          <p className="text-xs font-normal text-muted-foreground">{user.email.value}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <UserIcon className="h-4 w-4" />
          پروفایل
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="h-4 w-4" />
          تنظیمات
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => logout.mutate()}
        >
          <LogOut className="h-4 w-4" />
          خروج
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
