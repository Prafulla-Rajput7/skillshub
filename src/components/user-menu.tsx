"use client";
import { signOut } from "next-auth/react";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { AvatarInitials } from "@/components/avatar-initials";

interface UserMenuProps {
  name: string;
  email: string;
  role: "HR" | "EMPLOYEE";
}

export function UserMenu({ name, email, role }: UserMenuProps) {
  const roleLabel = role === "HR" ? "HR" : "Employee";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 hover:bg-slate-100 rounded-full pr-2 pl-0.5 py-0.5 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-slate-900">
        <AvatarInitials name={name} size="sm" />
        <div className="hidden sm:flex flex-col items-start leading-tight">
          <span className="text-sm font-medium">{name}</span>
          <span className="text-[10px] text-slate-500 uppercase tracking-wider">{roleLabel}</span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="flex items-center gap-3 px-2 py-2">
          <AvatarInitials name={name} size="md" />
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{name}</div>
            <div className="text-xs text-slate-500 truncate">{email}</div>
            <div className="inline-block mt-1 text-[10px] uppercase tracking-wider bg-slate-100 px-1.5 py-0.5 rounded font-medium">
              {roleLabel}
            </div>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled className="cursor-not-allowed">
          <User className="w-4 h-4 mr-2" /> View profile
        </DropdownMenuItem>
        <DropdownMenuItem disabled className="cursor-not-allowed">
          <Settings className="w-4 h-4 mr-2" /> Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })} className="text-red-600 focus:text-red-700">
          <LogOut className="w-4 h-4 mr-2" /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
