"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "./time-sessions";

export async function getCalendarData(month: number, year: number) {
  try {
    const user = await getCurrentUser();
    
    // RBAC: Admin sees all. Supervisor sees self + subordinates. Employee sees self.
    let userFilter: any = {};
    if (user.role === "EMPLOYEE") {
      userFilter = { userId: user.id };
    } else if (user.role === "SUPERVISOR") {
      userFilter = {
        OR: [
          { userId: user.id },
          { user: { supervisorId: user.id } }
        ]
      };
    }

    // JS months: 0-11, so if month=3 (March), Date(year, 2, 1)
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const sessions = await prisma.timeSession.findMany({
      where: {
        ...userFilter,
        startTime: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        user: true
      }
    });

    const grouped: Record<number, Record<string, { user: any, totalSeconds: number }>> = {};
    
    sessions.forEach((session: any) => {
      const day = new Date(session.startTime).getDate();
      if (!grouped[day]) grouped[day] = {};
      
      const userId = session.userId;
      if (!grouped[day][userId]) {
        grouped[day][userId] = {
          user: session.user,
          totalSeconds: 0
        };
      }
      
      let totalSeconds = session.duration || 0;
      if (!session.endTime && session.status !== "COMPLETED") {
        totalSeconds += Math.floor((Date.now() - new Date(session.startTime).getTime()) / 1000);
      }
      
      grouped[day][userId].totalSeconds += totalSeconds;
    });

    return { success: true, data: grouped };
  } catch (error) {
    return { success: false, data: {} };
  }
}
