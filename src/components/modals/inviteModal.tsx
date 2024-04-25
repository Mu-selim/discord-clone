"use client";

import axios from "axios";

import { useModal } from "@/hooks/useModalStore";
import { useOrigin } from "@/hooks/useOrigin";
import { useState } from "react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Copy, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export function InviteModal() {
  const { isOpen, type, data, onOpen, onClose } = useModal();
  const origin = useOrigin();
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const isModalOpen = isOpen && type === "invite";
  const { server } = data;
  const inviteURL = `${origin}/invite/${server?.inviteCode}`;

  const onCopy = () => {
    navigator.clipboard.writeText(inviteURL);
    setCopied(true);

    const timeout = setTimeout(() => {
      setCopied(false);
      clearTimeout(timeout);
    }, 1500);
  };

  const onNewInviteCode = async () => {
    try {
      setLoading(true);
      const res = await axios.patch(`/api/servers/${server?.id}/invite-code`);
      onOpen("invite", { server: res.data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">Invite Friends, Family, and Coworkers</DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Share this link to invite people to your server.
          </DialogDescription>
        </DialogHeader>
        <div className="p-6">
          <Label className="text-sm font-bold uppercase text-zinc-500 dark:text-secondary/70">Server Invite Link</Label>
          <div className="mt-2 flex items-center gap-x-2">
            <Input
              className="border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0"
              value={inviteURL}
              readOnly
              disabled={loading}
            />
            <Button size="icon" onClick={onCopy} disabled={loading}>
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            </Button>
          </div>
          <Button
            variant="link"
            size="sm"
            className="mt-2.5 text-xs text-zinc-500"
            disabled={loading}
            onClick={onNewInviteCode}
          >
            <span>Generate a new link</span>
            <RefreshCcw className={cn("ms-2 size-4", loading && "animate-spin")} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
