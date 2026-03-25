"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "./time-sessions";
import { cache } from "react";

export const getMyProjects = cache(async (searchQuery?: string) => {
  try {
    const user = await getCurrentUser();
    
    let whereClause: any = {
      members: { some: { userId: user.id } }
    };

    if (searchQuery) {
      whereClause.OR = [
        { name: { contains: searchQuery, mode: "insensitive" } },
        { tasks: { some: { name: { contains: searchQuery, mode: "insensitive" } } } }
      ];
    }

    const projects = await prisma.project.findMany({
      where: whereClause,
      include: {
        tasks: {
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });
    return { success: true, projects };
  } catch (error) {
    console.error("Error fetching projects:", error);
    return { success: false, projects: [] };
  }
});

export const getProjectById = cache(async (projectId: string) => {
  try {
    const user = await getCurrentUser();
    
    // Verify user is member
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        members: {
          include: { user: true }
        },
        tasks: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!project) {
      return { success: false, error: "El proyecto no existe" };
    }

    const isAdmin = user.role === "ADMIN" || user.role === "ADMINISTRADOR" || user.role === "SUPERVISOR";
    const isMember = project.members.some((m: any) => m.userId === user.id);

    if (!isAdmin && !isMember) {
      return { success: false, error: `No tienes acceso. UserID: ${user.id}, Role: ${user.role}` };
    }

    return { success: true, project };
  } catch (err: any) {
    console.error("PRISMA GET PROJECT ERROR:", err);
    return { success: false, error: "Database error: " + (err?.message || String(err)) };
  }
});

export async function createProject(data: { name: string, description?: string, color?: string }) {
  try {
    const user = await getCurrentUser();
    const created = await prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        color: data.color || "#166534",
        members: {
          create: {
            userId: user.id
          }
        }
      }
    });
    return { success: true, project: created };
  } catch (error) {
    return { success: false, error: "Error creando proyecto" };
  }
}

export async function deleteProject(projectId: string) {
  try {
    const user = await getCurrentUser();
    
    // Check if user is admin/supervisor or project member
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { members: true }
    });

    if (!project) return { success: false, error: "Proyecto no encontrado" };

    const isAdmin = user.role === "ADMIN" || user.role === "SUPERVISOR";
    const isMember = project.members.some((m: any) => m.userId === user.id);

    if (!isAdmin && !isMember) {
      return { success: false, error: "No tienes permiso para borrar este proyecto" };
    }

    await prisma.project.delete({
      where: { id: projectId }
    });

    return { success: true };
  } catch (err: any) {
    console.error("Error deleting project:", err);
    return { success: false, error: err.message || "Error al eliminar proyecto" };
  }
}
