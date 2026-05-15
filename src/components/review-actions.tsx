"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export function ReviewActions({ profileId }: { profileId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);

  async function review(action: "approve" | "reject") {
    setLoading(action);
    try {
      const res = await fetch(`/api/review/${profileId}/${action}`, { method: "POST" });
      if (!res.ok) {
        toast.error(`Failed to ${action}`);
        return;
      }
      toast.success(`Profile ${action}d`);
      router.push("/hr/review-queue");
      router.refresh();
    } finally {
      setLoading(null);
    }
  }

  return (
    <Card className="sticky bottom-4 shadow-lg">
      <CardContent className="p-4 flex items-center justify-between">
        <p className="text-sm text-slate-600">Review this profile</p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => review("reject")} disabled={loading !== null}>
            {loading === "reject" ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <XCircle className="w-4 h-4 mr-2" />
            )}
            Reject
          </Button>
          <Button onClick={() => review("approve")} disabled={loading !== null}>
            {loading === "approve" ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4 mr-2" />
            )}
            Approve
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
