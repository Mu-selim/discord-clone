"use client";

import axios from "axios";
import qs from "query-string";

import { useModal } from "@/hooks/useModalStore";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function DeleteChannelModal() {
  const { isOpen, type, data, onClose } = useModal();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const isModalOpen = isOpen && type === "deleteChannel";
  const { server, channel } = data;

  const onLeaveServer = async () => {
    try {
      setLoading(true);
      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: { serverId: server?.id },
      });

      await axios.delete(url);

      onClose();
      router.refresh();
      router.push(`/servers/${server?.id}`);
      window.location.reload();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">Delete Channel</DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to delete <span className="font-semibold text-indigo-500">#{channel?.name}</span>{" "}
            channel? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-6">
          <div className="flex w-full items-center justify-between">
            <Button disabled={loading} onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button disabled={loading} onClick={onLeaveServer} variant="primary">
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
