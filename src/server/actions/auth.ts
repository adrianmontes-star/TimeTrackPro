"use server";

import { prisma } from "@/lib/prisma";

export async function syncUserAction(
  supabaseUser: { id: string; email: string },
  metadata: { full_name?: string; role?: string }
) {
  try {
    const existing = await prisma.user.findUnique({
      where: { email: supabaseUser.email },
    });

    if (existing) {
      return { success: true };
    }

    await prisma.user.create({
      data: {
        id: supabaseUser.id,
        email: supabaseUser.email,
        name: metadata.full_name || "New User",
        role: metadata.role || "EMPLOYEE",
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error syncing user:", error);
    return { success: false, error: "Error al sincronizar el usuario en la BD." };
  }
}
