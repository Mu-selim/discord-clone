import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return <div className="p-4 flex items-center justify-center gap-4">
    <div className="rounded-full p-1 shadow-2xl shadow-slate-950"><UserButton afterSignOutUrl="/" /></div>
    <p className="text-3xl font-bold text-indigo-500">Hello Discord clone</p>
  </div>
}
