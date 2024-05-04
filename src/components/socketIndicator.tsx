"use client";

import { useSocket } from "@/components/providers/socketProvider";
import { clsx } from "clsx";
import { Badge } from "@/components/ui/badge";

export function SocketIndicator() {
  const { isConnected } = useSocket();

  return (
    <Badge
      variant="outline"
      className={clsx("border-none text-white", {
        "bg-emerald-600": isConnected,
        "bg-yellow-600": !isConnected,
      })}
    >
      {isConnected ? "Live: Realtime updates" : "Fallback: Polling every 1s"}
    </Badge>
  );
}
