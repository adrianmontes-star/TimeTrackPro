"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "./time-sessions";
import { revalidatePath } from "next/cache";

export async function getUsers() {
  try {
    await getCurrentUser();
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
    const currentUser = await getCurrentUser();
    if (currentUser.role !== "ADMIN") {
      return { success: false, error: "No autorizado: solo el administrador puede cambiar roles." };
    }
    await prisma.user.update({
      where: { id: userId },
      data: { role: targetRole as any }
    });
    revalidatePath("/admin/users");
    return { success: true };
  } catch(err) {
    return { success: false, error: "Error al actualizar el rol." };
  }
}

export async function assignSupervisor(userId: string, supervisorId: string | null) {
  try {
    const currentUser = await getCurrentUser();
    if (currentUser.role !== "ADMIN") {
      return { success: false, error: "No autorizado: solo el administrador puede asignar supervisores." };
    }
    await prisma.user.update({
      where: { id: userId },
      data: { supervisorId }
    });
    revalidatePath("/admin/users");
    return { success: true };
  } catch(err) {
    return { success: false, error: "Error al asignar supervisor." };
  }
}
