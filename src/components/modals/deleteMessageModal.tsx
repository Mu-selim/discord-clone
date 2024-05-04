"use client";

import axios from "axios";
import qs from "query-string";

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

export function DeleteMessageModal() {
  const { isOpen, type, data, onClose } = useModal();
  const [loading, setLoading] = useState(false);

  const isModalOpen = isOpen && type === "deleteMessage";
  const { apiURL, query } = data;

  const onLeaveServer = async () => {
    try {
      setLoading(true);
      const url = qs.stringifyUrl({ url: apiURL || "", query });

      await axios.delete(url);

      onClose();
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
          <DialogTitle className="text-center text-2xl font-bold">Delete Message</DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to delete this? <br />
            The message will be permanently deleted.
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
