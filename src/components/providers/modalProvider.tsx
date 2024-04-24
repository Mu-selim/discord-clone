"use client";

import { useEffect, useState } from "react";
import { CreateServerModal } from "@/components/modals/createServerModal";
import { InviteModal } from "@/components/modals/inviteModal";
import { EditServerModal } from "@/components/modals/editServerModal";
import { MembersModal } from "@/components/modals/membersModal";
import { CreateChannelModal } from "@/components/modals/createChannelModal";

export function ModalProvider() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <CreateServerModal />
      <InviteModal />
      <EditServerModal />
      <MembersModal />
      <CreateChannelModal />
    </>
  );
}
