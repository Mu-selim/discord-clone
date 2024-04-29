import { Hash, Menu } from "lucide-react";
import { MobileToggle } from "../mobileToggle";

type ChatHeaderProps = {
  serverId: string;
  name: string;
  type: "channel" | "conversation";
  imgURL?: string;
};

export function ChatHeader({ serverId, name, type, imgURL }: ChatHeaderProps) {
  return (
    <div className="text-md flex h-12 w-full items-center border-b-2 border-neutral-200 px-3 font-semibold dark:border-neutral-800">
      <MobileToggle serverId={serverId} />
      {type === "channel" && <Hash className="mr-2 size-5 text-zinc-500 dark:text-zinc-400" />}
      <p className="font-semibold text-black dark:text-white">{name}</p>
    </div>
  );
}
