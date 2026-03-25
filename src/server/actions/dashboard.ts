"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "./time-sessions";
import { cache } from "react";

export const getDashboardMetrics = cache(async () => {
  try {
    const user = await getCurrentUser();
    
    let projectFilter: any = {};
    if (user.role === "EMPLOYEE") {
      projectFilter = { members: { some: { userId: user.id } } };
    }

    const allProjects = await prisma.project.findMany({
      where: projectFilter,
      include: {
        tasks: { select: { status: true } }
      }
    });

    const totalProjects = allProjects.length;
    let endedProjects = 0;
    let runningProjects = 0;
    let pendingProjects = 0;
    let totalCompletionPercentage = 0;

    allProjects.forEach((p: any) => {
      let isCompleted = false;
      let projectCompletion = 0;
      
      if (p.status === "COMPLETED") {
        isCompleted = true;
        projectCompletion = 100;
      } else if (p.tasks.length > 0) {
        const completedTasks = p.tasks.filter((t: any) => t.status === "COMPLETED").length;
        projectCompletion = (completedTasks / p.tasks.length) * 100;
        
        if (completedTasks === p.tasks.length) {
          isCompleted = true;
        }
      }

      totalCompletionPercentage += projectCompletion;

    let isPending = false;
      if (p.status === "PENDING") {
         isPending = true;
      } else if (p.tasks.length === 0) {
         isPending = true; // No tasks yet, waiting to start
      } else {
         const pendingTasks = p.tasks.filter((t: any) => t.status === "PENDING").length;
         if (pendingTasks === p.tasks.length && !isCompleted) {
           isPending = true; // All tasks are pending, waiting to start
         }
      }

      if (isCompleted) {
        endedProjects++;
      } else if (isPending) {
        pendingProjects++;
      } else {
        runningProjects++;
      }
    });

    const completionRate = totalProjects > 0 ? Math.round(totalCompletionPercentage / totalProjects) : 0;

    const recentProjectsRaw = await prisma.project.findMany({
      where: projectFilter,
      orderBy: { createdAt: 'desc' },
      take: 4,
      include: {
        tasks: {
          select: { id: true, status: true, estimatedHours: true }
        },
        timeSessions: {
          select: { duration: true, startTime: true, endTime: true }
        }
      }
    });

    const recentProjects = recentProjectsRaw.map((proj: any) => {
      let totalSeconds = 0;
      proj.timeSessions.forEach((session: any) => {
        totalSeconds += session.duration || 0;
        if (!session.endTime) {
          totalSeconds += Math.floor((Date.now() - new Date(session.startTime).getTime()) / 1000);
        }
      });
      return {
        ...proj,
        totalSeconds
      };
    });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    let sessionFilter: any = {};
    if (user.role === "EMPLOYEE") {
      sessionFilter = { userId: user.id };
    } else if (user.role === "SUPERVISOR") {
      sessionFilter = { OR: [{ userId: user.id }, { user: { supervisorId: user.id } }] };
    }

    const recentSessions = await prisma.timeSession.findMany({
      where: {
        ...sessionFilter,
        startTime: { gte: sevenDaysAgo }
      }
    });

    const daysOfWeek = ["D", "L", "M", "X", "J", "V", "S"];
    const analytics = Array(7).fill(0).map((_, i) => {
      const d = new Date(sevenDaysAgo);
      d.setDate(d.getDate() + i);
      return { 
        name: daysOfWeek[d.getDay()], 
        hours: 0,
        date: d.toDateString()
      };
    });

    recentSessions.forEach((session: any) => {
      const d = new Date(session.startTime).toDateString();
      const idx = analytics.findIndex(a => a.date === d);
      if (idx !== -1) {
        let totalSeconds = session.duration || 0;
        if (!session.endTime) {
          totalSeconds += Math.floor((Date.now() - new Date(session.startTime).getTime()) / 1000);
        }
        analytics[idx].hours += (totalSeconds / 3600);
      }
    });

    // Round hours for chart
    analytics.forEach(a => { 
      if (a.hours > 0 && a.hours < 0.1) {
        a.hours = 0.1;
      } else {
        a.hours = Math.round(a.hours * 10) / 10; 
      }
    });

    const latestTasks = await prisma.task.findMany({
      where: {
        project: projectFilter
      },
      include: {
        project: { select: { name: true } },
        assignments: {
          take: 1,
          include: { user: { select: { name: true, email: true } } }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });



    return {
      success: true,
      data: {
        metrics: { totalProjects, endedProjects, runningProjects, pendingProjects, completionRate },
        recentProjects,
        analytics,
        latestTasks
      }
    };
  } catch (error) {
    console.error(error);
    return { success: false, data: null };
  }
});
