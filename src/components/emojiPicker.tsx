"use client";

import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useTheme } from "next-themes";

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Smile } from "lucide-react";

type EmojiPickerProps = {
  onChange: (value: string) => void;
};

export function EmojiPicker({ onChange }: EmojiPickerProps) {
  const { resolvedTheme } = useTheme();
  return (
    <Popover>
      <PopoverTrigger>
        <Smile className="text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-400 hover:dark:text-zinc-300" />
      </PopoverTrigger>
      <PopoverContent
        side="right"
        sideOffset={40}
        className=" mb-16 border-none bg-transparent shadow-none drop-shadow-none"
      >
        <Picker data={data} theme={resolvedTheme} onEmojiSelect={(e: any) => onChange(e.native)} />
      </PopoverContent>
    </Popover>
  );
}
