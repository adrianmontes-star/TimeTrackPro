"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "./time-sessions";
import { revalidatePath } from "next/cache";

export async function getPendingApprovals() {
  try {
    const user = await getCurrentUser();
    const sessions = await prisma.timeSession.findMany({
      where: {
        user: { supervisorId: user.id },
        approvalStatus: "PENDING",
        endTime: { not: null }
      },
      include: {
        user: true,
        project: true,
        task: true
      },
      orderBy: { endTime: 'desc' }
    });
    return { success: true, sessions };
  } catch(error) {
    return { success: false, sessions: [] };
  }
}

export async function resolveApproval(sessionId: string, status: "APPROVED" | "REJECTED", comment?: string) {
  try {
    const user = await getCurrentUser();
    
    // Additional validation could go here to ensure the session 
    // actually belongs to a subordinate of this supervisor
    
    await prisma.timeSession.update({
      where: { id: sessionId },
      data: {
        approvalStatus: status,
        approvedBy: user.id,
        approvedAt: new Date(),
        approvalComment: comment
      }
    });

    revalidatePath("/supervisor/pending");
    return { success: true };
  } catch(error) {
    return { success: false, error: "Error al resolver la aprobación" };
  }
}
