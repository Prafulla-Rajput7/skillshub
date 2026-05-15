"use client";
import { useState, useRef } from "react";
import { Upload, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface ResumeUploaderProps {
  variant?: "full" | "compact";
}

export function ResumeUploader({ variant = "full" }: ResumeUploaderProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  async function handleFile(file: File) {
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large (max 5MB)");
      return;
    }

    setUploading(true);
    const fd = new FormData();
    fd.append("resume", file);

    try {
      const res = await fetch("/api/resume/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Upload failed");
        return;
      }
      toast.success(`Profile extracted — ${data.skillsCount} skills, ${data.projectsCount} projects`);
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
    e.target.value = ""; // allow re-selecting same file
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  }

  if (variant === "compact") {
    return (
      <>
        <input
          type="file"
          accept="application/pdf"
          ref={fileInputRef}
          onChange={onFileChange}
          className="hidden"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" /> Re-upload
            </>
          )}
        </Button>
      </>
    );
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      className={cn(
        "border-2 border-dashed rounded-lg p-12 text-center transition-colors",
        dragOver ? "border-slate-900 bg-slate-100" : "border-slate-300 bg-white"
      )}
    >
      <input
        type="file"
        accept="application/pdf"
        ref={fileInputRef}
        onChange={onFileChange}
        className="hidden"
      />
      {uploading ? (
        <div className="space-y-4">
          <Loader2 className="w-12 h-12 mx-auto animate-spin text-slate-700" />
          <div>
            <p className="font-medium">Analyzing your resume...</p>
            <p className="text-sm text-slate-500">Usually takes 10-20 seconds</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center">
            <Upload className="w-6 h-6 text-slate-700" />
          </div>
          <div>
            <p className="font-medium">Drag your resume here</p>
            <p className="text-sm text-slate-500">PDF format, max 5MB</p>
          </div>
          <Button onClick={() => fileInputRef.current?.click()}>
            <FileText className="w-4 h-4 mr-2" /> Choose PDF
          </Button>
        </div>
      )}
    </div>
  );
}
