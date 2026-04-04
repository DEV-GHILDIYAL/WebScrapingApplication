"use server";

import { db } from "@/db";
import { scrapers, rooms } from "@/db/schema";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function createScraper(roomId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Verify ownership of room
  const [room] = await db.select().from(rooms).where(
    and(eq(rooms.id, roomId), eq(rooms.userId, session.user.id))
  );

  if (!room) {
    throw new Error("Room not found or unauthorized");
  }

  const name = formData.get("name") as string;
  const url = formData.get("url") as string;

  if (!name || !url) {
    throw new Error("Name and URL are required");
  }

  await db.insert(scrapers).values({
    id: nanoid(),
    name,
    url,
    roomId,
    status: "active",
  });

  revalidatePath(`/rooms/${roomId}`);
}

export async function toggleScraperStatus(id: string, currentStatus: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const newStatus = currentStatus === "active" ? "paused" : "active";

  await db.update(scrapers)
    .set({ status: newStatus })
    .where(eq(scrapers.id, id));

  revalidatePath("/rooms/[id]", "page");
}
