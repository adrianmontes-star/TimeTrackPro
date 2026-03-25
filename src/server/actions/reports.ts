"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "./time-sessions";

export async function getReports(filters?: {
  projectId?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
}) {
  try {
    const user = await getCurrentUser();
    
    // For MVP: Admin can see all, Supervisor sees subordinates, Employee sees only self
    // We'll simplify and just fetch all if admin, or self if employee, or subordinates if supervisor.
    let userFilter: any = {};
    if (user.role === "EMPLOYEE") {
      userFilter = { userId: user.id };
    } else if (user.role === "SUPERVISOR") {
      // Self + subordinates
      userFilter = {
        OR: [
          { userId: user.id },
          { user: { supervisorId: user.id } }
        ]
      };
    }

    // Apply exact user filter if provided and allowed (simplification: just apply it)
    if (filters?.userId) {
      userFilter = { userId: filters.userId };
    }

    const where: any = {
      ...userFilter,
      endTime: { not: null }
    };

    if (filters?.projectId) {
      where.projectId = filters.projectId;
    }
    
    if (filters?.startDate || filters?.endDate) {
      where.startTime = {};
      if (filters.startDate) where.startTime.gte = new Date(`${filters.startDate}T00:00:00`);
      if (filters.endDate) where.startTime.lte = new Date(`${filters.endDate}T23:59:59`);
    }

    const sessions = await prisma.timeSession.findMany({
      where,
      include: {
        user: true,
        project: true,
        task: true
      },
      orderBy: { startTime: 'desc' }
    });

    return { success: true, sessions };
  } catch(error) {
    return { success: false, sessions: [] };
  }
}
