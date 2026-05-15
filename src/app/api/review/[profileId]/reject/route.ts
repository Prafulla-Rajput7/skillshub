import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ profileId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "HR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { profileId } = await params;

  let notes: string | undefined;
  try {
    const body = await req.json();
    notes = body?.notes;
  } catch {
    // body is optional
  }

  await prisma.reviewQueue.update({
    where: { profileId },
    data: {
      status: "REJECTED",
      reviewedAt: new Date(),
      reviewedBy: session.user.id,
      notes
    }
  });

  return NextResponse.json({ success: true });
}
