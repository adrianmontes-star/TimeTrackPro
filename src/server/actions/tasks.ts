"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "./time-sessions";
import { revalidatePath } from "next/cache";

export async function createTask(projectId: string, data: { title: string, description?: string }) {
  try {
    const user = await getCurrentUser();
    
    // Auth validation implicit by layout/middleware, but check membership just in case
    const isMember = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: { userId: user.id, projectId }
      }
    });

    if (!isMember) return { success: false, error: "No autorizado para añadir tareas a este proyecto" };

    const task = await prisma.task.create({
      data: {
        name: data.title,
        description: data.description,
        projectId,
        status: "PENDING",
        assignments: {
          create: {
            userId: user.id
          }
        }
      }
    });

    revalidatePath(`/projects/${projectId}`);
    return { success: true, task };
  } catch (error) {
    return { success: false, error: "Error creando tarea" };
  }
}

export async function updateTaskStatus(taskId: string, status: string, projectId: string) {
  try {
    await getCurrentUser(); // validate session
    await prisma.task.update({
      where: { id: taskId },
      data: { status }
    });
    revalidatePath(`/projects/${projectId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Error actualizando tarea" };
  }
}
