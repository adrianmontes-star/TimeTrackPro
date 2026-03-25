"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "./time-sessions";
import { revalidatePath } from "next/cache";

export async function getUsers() {
  try {
    await getCurrentUser(); // Optional: Validate admin
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        supervisor: true,
      }
    });
    return { success: true, users };
  } catch(error) {
    return { success: false, users: [] };
  }
}

export async function updateUserRole(userId: string, targetRole: string) {
  try {
    await getCurrentUser(); // Validate admin in real life
    await prisma.user.update({
      where: { id: userId },
      data: { role: targetRole }
    });
    revalidatePath("/admin/users");
    return { success: true };
  } catch(err) {
    return { success: false, error: "Error updating role" };
  }
}

export async function assignSupervisor(userId: string, supervisorId: string | null) {
  try {
    await getCurrentUser();
    await prisma.user.update({
      where: { id: userId },
      data: { supervisorId }
    });
    revalidatePath("/admin/users");
    return { success: true };
  } catch(err) {
    return { success: false, error: "Error assigning supervisor" };
  }
}
