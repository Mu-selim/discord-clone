"use client";

import axios from "axios";
import qs from "query-string";
import { MemberRole } from "@prisma/client";

import { useModal } from "@/hooks/useModalStore";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ServerWithMembersWithProfile } from "@/types";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "@/components/userAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, Gavel, Loader2, MoreVertical, Shield, ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.ADMIN]: <ShieldCheck className="ml-1.5 size-4 text-indigo-500" />,
  [MemberRole.OWNER]: <ShieldAlert className="ml-1.5 size-4 text-rose-500" />,
};

export function MembersModal() {
  const { isOpen, type, data, onOpen, onClose } = useModal();
  const [loadingId, setLoadingId] = useState("");
  const router = useRouter();

  const isModalOpen = isOpen && type === "members";
  const { server } = data as { server: ServerWithMembersWithProfile };

  const onRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: { serverId: server?.id },
      });

      const res = await axios.patch(url, { role });

      router.refresh();
      onOpen("members", { server: res.data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId("");
    }
  };

  const onKick = async (memberId: string) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: { serverId: server?.id },
      });

      const res = await axios.delete(url);

      router.refresh();
      onOpen("members", { server: res.data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId("");
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden bg-white text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">Manage Members</DialogTitle>
          <DialogDescription className="text-center text-zinc-500">{server?.members?.length} members</DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[26.25rem] pr-6">
          {server?.members?.map((member) => (
            <div key={member.id} className="mb-6 flex items-center gap-x-2">
              <UserAvatar name={member.profile.name} src={member.profile.imageURL} />
              <div className="flex flex-col gap-y-1">
                <h2 className="flex items-center text-xs font-semibold">
                  {member.profile.name}
                  {roleIconMap[member.role]}
                </h2>
                <p className="text-xs text-zinc-500">{member.profile.email}</p>
              </div>
              {server.profileId !== member.profileId && loadingId !== member.id && (
                <div className="ml-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical className="size-4 text-zinc-500" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="left">
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="flex items-center">
                          <ShieldQuestion className="mr-2 size-4" />
                          <span>Role</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            <DropdownMenuItem onClick={() => onRoleChange(member.id, MemberRole.GUEST)}>
                              <Shield className="mr-2 size-4" />
                              <span>{MemberRole.GUEST}</span>
                              {member.role === MemberRole.GUEST && <Check className="ml-auto size-4" />}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onRoleChange(member.id, MemberRole.ADMIN)}>
                              <ShieldCheck className="mr-2 size-4" />
                              <span>{MemberRole.ADMIN}</span>
                              {member.role === MemberRole.ADMIN && <Check className="ml-auto size-4" />}
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onKick(member.id)} className="text-rose-500">
                        <Gavel className="mr-2 size-4" />
                        <span>Kick</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
              {loadingId === member.id && <Loader2 className="ml-auto size-4 animate-spin text-zinc-500" />}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
