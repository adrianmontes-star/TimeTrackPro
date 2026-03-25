"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "./time-sessions";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: { name: string, language: string }) {
  try {
    const user = await getCurrentUser();
    await prisma.user.update({
      where: { id: user.id },
      data: { name: data.name, language: data.language }
    });
    revalidatePath("/profile");
    return { success: true };
  } catch (e) {
    return { success: false, error: "Failed to update profile" };
  }
}
