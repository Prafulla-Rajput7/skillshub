"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  defaultValue?: string;
  size?: "default" | "large";
}

export function SearchBar({ defaultValue = "", size = "default" }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);
  const [submitting, setSubmitting] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    setSubmitting(true);
    router.push(`/hr/search?q=${encodeURIComponent(trimmed)}`);
  }

  const inputSize = size === "large" ? "text-base py-3 pl-12 pr-4" : "text-sm py-2 pl-10 pr-3";
  const iconSize = size === "large" ? "w-5 h-5 left-4" : "w-4 h-4 left-3";

  return (
    <form onSubmit={onSubmit} className="flex gap-2 w-full">
      <div className="relative flex-1">
        <Search className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${iconSize}`} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Try: "senior React engineer who built real-time apps"'
          className={`w-full rounded-md border border-slate-300 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent ${inputSize}`}
          maxLength={500}
          disabled={submitting}
        />
      </div>
      <Button type="submit" disabled={submitting || !query.trim()} size={size === "large" ? "lg" : "default"}>
        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
      </Button>
    </form>
  );
}
