import { Hash } from "lucide-react";

type ChatWelcomeProps = {
  name: string;
  type: "channel" | "conversation";
};

export function ChatWelcome({ name, type }: ChatWelcomeProps) {
  return (
    <div className="mb-4 space-y-2 px-4">
      {type === "channel" && (
        <div className="flex size-20 items-center justify-center rounded-full bg-zinc-500 dark:bg-zinc-700">
          <Hash className="size-14 text-white" />
        </div>
      )}
      <p className="text-xl font-bold md:text-3xl">
        {type === "channel" ? "Welcome to #" : ""}
        {name}
      </p>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {type === "channel"
          ? `This is the start of the #${name} channel`
          : `This is the start of your conversation with ${name}`}
      </p>
    </div>
  );
}
