import { Hash } from "lucide-react";
import { MobileToggle } from "@/components/mobileToggle";
import { UserAvatar } from "@/components/userAvatar";

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
      {type === "conversation" && <UserAvatar name={name} src={imgURL} className="mr-2 size-8" />}
      <p className="font-semibold text-black dark:text-white">{name}</p>
    </div>
  );
}
