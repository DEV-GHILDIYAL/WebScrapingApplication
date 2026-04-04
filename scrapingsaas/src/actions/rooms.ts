"use server";

import { db } from "@/db";
import { rooms } from "@/db/schema";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function createRoom(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  if (!name) {
    throw new Error("Room name is required");
  }

  await db.insert(rooms).values({
    id: nanoid(),
    name,
    description,
    userId: session.user.id,
  });

  revalidatePath("/rooms");
  revalidatePath("/dashboard");
}

export async function deleteRoom(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await db.delete(rooms).where(
    and(
      eq(rooms.id, id),
      eq(rooms.userId, session.user.id)
    )
  );

  revalidatePath("/rooms");
  revalidatePath("/dashboard");
}
