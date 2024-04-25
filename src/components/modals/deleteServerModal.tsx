"use client";

import axios from "axios";

import { useModal } from "@/hooks/useModalStore";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function DeleteServerModal() {
  const { isOpen, type, data, onOpen, onClose } = useModal();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const isModalOpen = isOpen && type === "deleteServer";
  const { server } = data;

  const onLeaveServer = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/servers/${server?.id}/delete`);

      onClose();
      router.refresh();
      router.push("/");
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
          <DialogTitle className="text-center text-2xl font-bold">Delete Server</DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to delete <span className="font-semibold text-indigo-500"> {server?.name} </span>{" "}
            server? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-6">
          <div className="flex w-full items-center justify-between">
            <Button disabled={loading} onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button disabled={loading} onClick={onLeaveServer} variant="primary">
              Delete Server
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
