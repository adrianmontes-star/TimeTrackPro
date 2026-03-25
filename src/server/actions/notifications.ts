"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "./time-sessions";
import { revalidatePath } from "next/cache";

export async function getMyNotifications() {
  try {
    const user = await getCurrentUser();
    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
    return { success: true, notifications };
  } catch(error) {
    return { success: false, notifications: [] };
  }
}

export async function markNotificationAsRead(id: string) {
  try {
    const user = await getCurrentUser();
    await prisma.notification.update({
      where: { id, userId: user.id },
      data: { read: true }
    });
    revalidatePath("/", "layout"); // Revalidate all paths using layout
    return { success: true };
  } catch(error) {
    return { success: false };
  }
}

export async function markAllNotificationsAsRead() {
  try {
    const user = await getCurrentUser();
    await prisma.notification.updateMany({
      where: { userId: user.id, read: false },
      data: { read: true }
    });
    revalidatePath("/", "layout");
    return { success: true };
  } catch(error) {
    return { success: false };
  }
}

// Utility for server-side generation of notifications across the app
export async function createNotification(userId: string, title: string, message: string, link?: string, type = "INFO") {
  try {
    await prisma.notification.create({
      data: { userId, title, message, link, type: type as any }
    });
    return true;
  } catch(error) {
    return false;
  }
}
