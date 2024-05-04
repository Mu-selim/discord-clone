"use client";

import { FileIcon, X } from "lucide-react";
import Image from "next/image";
import { UploadDropzone } from "@/lib/uploadthing";
import type { ourFileRouter } from "@/app/api/uploadthing/core";
import "@uploadthing/react/styles.css";

type FileUploadProps = {
  endpoint: keyof typeof ourFileRouter;
  value: string;
  onChange: (url?: string) => void;
};

type FileDisplayProps = {
  value: string;
  onChange: (url?: string) => void;
};

function ImageDisplay({ value, onChange }: FileDisplayProps) {
  return (
    <div className="relative size-20">
      <Image fill src={value} alt="uploaded image" className="rounded-full" />
      <button
        type="button"
        className="absolute right-0 top-0 rounded-full bg-rose-500 p-1 text-white shadow-sm"
        onClick={() => onChange("")}
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

function PDFDisplay({ value, onChange }: FileDisplayProps) {
  return (
    <div className="relative mt-2 flex items-center rounded-md bg-background/10 p-2">
      <FileIcon className="size-10 fill-indigo-200 stroke-indigo-400" />
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="ml-2 text-sm text-indigo-500 hover:underline dark:text-indigo-400"
      >
        {value}
      </a>
      <button
        type="button"
        className="absolute -right-2 -top-2 rounded-full bg-rose-500 p-1 text-white shadow-sm"
        onClick={() => onChange("")}
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

export function FileUpload({ endpoint, value, onChange }: FileUploadProps) {
  const fileType = value?.split(".").pop();
  if (value && fileType !== "pdf") return <ImageDisplay value={value} onChange={onChange} />;

  if (value && fileType === "pdf") return <PDFDisplay value={value} onChange={onChange} />;

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }}
      onUploadError={(err: Error) => {
        console.log(err);
      }}
    />
  );
}
