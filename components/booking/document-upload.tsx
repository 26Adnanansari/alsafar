"use client";

import { useState } from "react";
import { UploadCloud, FileCheck2, Lock } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

export function DocumentUpload({
  passengerId,
  field,
  label,
  existingUrl,
}: {
  passengerId: string;
  field: "passport_file_url" | "photo_file_url" | "visa_file_url";
  label: string;
  existingUrl?: string | null;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(!!existingUrl);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File 5MB se kam honi chahiye");
      return;
    }

    setUploading(true);
    const supabase = createClient();
    const path = `${passengerId}/${field}-${Date.now()}.${file.name.split(".").pop()}`;

    const { error: uploadError } = await supabase.storage
      .from("passport-documents")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      toast.error("Upload fail ho gaya, dobara koshish karein");
      setUploading(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("passengers")
      .update({ [field]: path })
      .eq("id", passengerId);

    setUploading(false);

    if (updateError) {
      toast.error("File save nahi ho saki");
      return;
    }

    setUploaded(true);
    toast.success(`${label} upload ho gayi`);
  }

  return (
    <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border p-6 text-center transition-colors hover:border-primary/40">
      <input type="file" accept="image/*,.pdf" className="hidden" onChange={handleFileChange} disabled={uploading} />
      {uploaded ? (
        <FileCheck2 size={28} className="text-primary" />
      ) : (
        <UploadCloud size={28} className="text-muted-foreground" />
      )}
      <p className="text-sm font-medium">{uploading ? "Upload ho raha hai..." : uploaded ? `${label} — Uploaded` : `${label} Upload Karein`}</p>
      <p className="flex items-center gap-1 text-xs text-muted-foreground">
        <Lock size={11} /> Encrypted &amp; secure storage
      </p>
    </label>
  );
}
