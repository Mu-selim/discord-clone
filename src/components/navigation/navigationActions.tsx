"use client";

import { Plus } from "lucide-react";
import { ActionTooltip } from "@/components/actionTooltip";

export function NavigationActions() {
  return (
    <div>
      <ActionTooltip label="Create a server" side="right" align="center">
        <button className="group flex items-center">
          <div className="mx-3 flex size-12 items-center justify-center overflow-hidden rounded-3xl bg-background transition-all group-hover:rounded-2xl group-hover:bg-emerald-500 dark:bg-neutral-700">
            <Plus className="text-emerald-500 transition group-hover:text-white" size={25} />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
}
