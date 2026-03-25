"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { cache } from "react";

export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");
  
  // Ensure the user exists in Prisma to avoid Foreign Key constraint errors 
  // when creating TimeSessions or querying relations
  const dbUser = await prisma.user.upsert({
    where: { id: user.id },
    update: {},
    create: {
      id: user.id,
      email: user.email || "user@example.com",
      name: user.user_metadata?.full_name || user.email?.split('@')[0] || "Usuario",
      role: "ADMIN", // Fallback role
    }
  }).catch((e) => {
    // If upsert by ID fails, attempt by email just in case
    return prisma.user.findFirst({ where: { email: user.email } }) || user;
  });

  return { ...user, ...dbUser };
});

export async function createTimeSession(data: {
  taskId: string;
  projectId: string;
}) {
  const user = await getCurrentUser();
  
  const created = await prisma.timeSession.create({
    data: {
      userId: user.id,
      taskId: data.taskId,
      projectId: data.projectId,
      startTime: new Date(),
    },
  });

  revalidatePath("/");
  revalidatePath("/timer");
  return { success: true, session: created };
}

export async function stopTimeSession(sessionId: string) {
  const user = await getCurrentUser();

  const session = await prisma.timeSession.findUnique({
    where: { id: sessionId },
  });

  if (!session || session.userId !== user.id) {
    return { success: false, error: "Sesión no encontrada o no autorizada" };
  }

  const endTime = new Date();
  const duration = Math.round((endTime.getTime() - session.startTime.getTime()) / 1000);

  const updated = await prisma.timeSession.update({
    where: { id: sessionId },
    data: {
      endTime,
      duration,
    },
  });

  revalidatePath("/");
  revalidatePath("/timer");
  return { success: true, session: updated };
}

export async function getActiveTimeSession() {
  try {
    const user = await getCurrentUser();
    const session = await prisma.timeSession.findFirst({
      where: {
        userId: user.id,
        endTime: null,
      },
      include: {
        task: true,
        project: true,
      }
    });
    return { success: true, session };
  } catch (error) {
    return { success: false, session: null };
  }
}

export async function getRecentTimeSessions() {
  try {
    const user = await getCurrentUser();
    const sessions = await prisma.timeSession.findMany({
      where: {
        userId: user.id,
        endTime: { not: null }
      },
      include: {
        task: true,
        project: true,
      },
      orderBy: {
        endTime: 'desc'
      },
      take: 10
    });
    return { success: true, sessions };
  } catch (error) {
    return { success: false, sessions: [] };
  }
}

export async function createManualTimeSession(data: {
  taskId: string;
  projectId: string;
  date: string;
  startTime: string;
  endTime: string;
  notes?: string;
}) {
  try {
    const user = await getCurrentUser();
    
    // Asumimos formato local YYYY-MM-DD y HH:MM
    const start = new Date(`${data.date}T${data.startTime}:00`);
    const end = new Date(`${data.date}T${data.endTime}:00`);
    const duration = Math.round((end.getTime() - start.getTime()) / 1000); // in seconds

    if (duration <= 0) {
      return { success: false, error: "El tiempo de fin debe ser mayor al de inicio." };
    }

    const created = await prisma.timeSession.create({
      data: {
        userId: user.id,
        taskId: data.taskId,
        projectId: data.projectId,
        startTime: start,
        endTime: end,
        duration,
        description: data.notes
      },
    });

    revalidatePath("/time-entries");
    revalidatePath("/timer");
    return { success: true, session: created };
  } catch (err: any) {
    console.error(err);
    return { success: false, error: err.message || "Error al registrar tiempo manual." };
  }
}

export async function deleteTimeSession(sessionId: string) {
  try {
    const user = await getCurrentUser();
    await prisma.timeSession.delete({
      where: { id: sessionId, userId: user.id }
    });
    revalidatePath("/time-entries");
    revalidatePath("/timer");
    return { success: true };
  } catch (err) {
    return { success: false, error: "Error al borrar registro." };
  }
}
