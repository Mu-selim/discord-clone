import { NavigationSidebar } from "@/components/navigation/naviagtionSidebar";
import { ReactNode } from "react";

export default async function MainLayout({ children }: { children: ReactNode }) {
  return (
    <aside className="h-full">
      <div className="fixed inset-y-0 z-30 hidden h-full w-[4.5rem] flex-col md:flex">
        <NavigationSidebar />
      </div>
      <main className="h-full md:pl-[4.5rem]">{children}</main>
    </aside>
  );
}
