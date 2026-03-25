"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "./time-sessions";
import { revalidatePath } from "next/cache";

export async function getWorkdayConfig() {
  try {
    let config = await prisma.workdayConfig.findFirst();
    if (!config) {
      config = await prisma.workdayConfig.create({ data: {} });
    }
    return { success: true, config };
  } catch (err) {
    return { success: false, config: null };
  }
}

export async function updateWorkdayConfig(data: {
  hoursPerDay?: number;
  hoursPerWeek?: number;
  workDays?: string;
  overtimeThreshold?: number;
  dayStartTime?: string;
  dayEndTime?: string;
}) {
  try {
    const user = await getCurrentUser();
    if (user.role !== "ADMIN") return { success: false, error: "Unauthorized" };
    
    let config = await prisma.workdayConfig.findFirst();
    if (config) {
      await prisma.workdayConfig.update({ where: { id: config.id }, data });
    } else {
      await prisma.workdayConfig.create({ data });
    }
    revalidatePath("/settings");
    return { success: true };
  } catch (e) {
    return { success: false, error: "Failed to update config" };
  }
}
