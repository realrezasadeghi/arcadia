"use client";

import { useState } from "react";
import { UserPlus, Trash2, Loader2, Crown } from "lucide-react";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/presentation/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/presentation/components/ui/select";
import { Separator } from "@/presentation/components/ui/separator";
import {
  useAddMember, useRemoveMember, useChangeMemberRole,
} from "@/presentation/hooks/use-projects";
import type { Project, ProjectRole } from "@/domain/entities/project.entity";
import type { User } from "@/domain/entities/user.entity";

interface ManageMembersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project;
  currentUser: User;
}

const ROLE_LABELS: Record<ProjectRole, string> = {
  OWNER: "مالک",
  EDITOR: "ویرایشگر",
  VIEWER: "بیننده",
};

export function ManageMembersDialog({
  open, onOpenChange, project, currentUser,
}: ManageMembersDialogProps) {
  const [newUserId, setNewUserId] = useState("");
  const [newRole, setNewRole] = useState<Exclude<ProjectRole, "OWNER">>("EDITOR");

  const addMember = useAddMember();
  const removeMember = useRemoveMember();
  const changeRole = useChangeMemberRole();

  const isOwner = project.isOwner(currentUser.id);
  const members = project.members;

  function handleAdd() {
    if (!newUserId.trim()) return;
    addMember.mutate(
      { projectId: project.id, userId: newUserId.trim(), role: newRole },
      { onSuccess: () => setNewUserId("") },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>مدیریت اعضا</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Members list */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">اعضای فعلی ({members.length})</Label>
            <div className="flex flex-col divide-y divide-border rounded-md border overflow-hidden">
              {members.map((member) => {
                const isMe = member.userId === currentUser.id;
                const isMemberOwner = member.role === "OWNER";
                return (
                  <div key={member.userId} className="flex items-center gap-3 px-3 py-2.5 bg-card">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                      {member.userId.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {member.userId}
                        {isMe && <span className="text-[10px] text-muted-foreground mr-1.5">(شما)</span>}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(member.joinedAt).toLocaleDateString("fa-IR")}
                      </p>
                    </div>

                    {isMemberOwner ? (
                      <div className="flex items-center gap-1 text-xs text-amber-500">
                        <Crown className="h-3.5 w-3.5" />
                        <span>{ROLE_LABELS.OWNER}</span>
                      </div>
                    ) : isOwner ? (
                      <div className="flex items-center gap-2">
                        <Select
                          value={member.role}
                          onValueChange={(v) =>
                            changeRole.mutate({
                              projectId: project.id,
                              userId: member.userId,
                              role: v as Exclude<ProjectRole, "OWNER">,
                            })
                          }
                        >
                          <SelectTrigger className="h-7 w-[110px] text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="EDITOR">ویرایشگر</SelectItem>
                            <SelectItem value="VIEWER">بیننده</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          disabled={removeMember.isPending}
                          onClick={() => removeMember.mutate({ projectId: project.id, userId: member.userId })}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">{ROLE_LABELS[member.role]}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add member form — only for owner */}
          {isOwner && (
            <>
              <Separator />
              <div className="flex flex-col gap-3">
                <Label className="text-xs">افزودن عضو جدید</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="شناسه کاربری..."
                    value={newUserId}
                    onChange={(e) => setNewUserId(e.target.value)}
                    className="h-8 text-sm flex-1"
                    onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                  />
                  <Select value={newRole} onValueChange={(v) => setNewRole(v as Exclude<ProjectRole, "OWNER">)}>
                    <SelectTrigger className="h-8 w-[110px] text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EDITOR">ویرایشگر</SelectItem>
                      <SelectItem value="VIEWER">بیننده</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  size="sm" className="gap-1.5 self-start h-8"
                  onClick={handleAdd}
                  disabled={!newUserId.trim() || addMember.isPending}
                >
                  {addMember.isPending
                    ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    : <UserPlus className="h-3.5 w-3.5" />
                  }
                  افزودن عضو
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
