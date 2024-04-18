"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { UploadDropzone } from "@/lib/uploadthing";
import type { ourFileRouter } from "@/app/api/uploadthing/core";
import "@uploadthing/react/styles.css";

type FileUploadProps = {
  endpoint: keyof typeof ourFileRouter;
  value: string;
  onChange: (url?: string) => void;
};

type ImageDisplayProps = {
  value: string;
  onChange: (url?: string) => void;
};

function ImageDisplay({ value, onChange }: ImageDisplayProps) {
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

export function FileUpload({ endpoint, value, onChange }: FileUploadProps) {
  const fileType = value?.split(".").pop();
  if (value && fileType !== "pdf") return <ImageDisplay value={value} onChange={onChange} />;

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
