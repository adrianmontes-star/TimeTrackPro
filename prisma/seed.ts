import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Create Admin User
  const admin = await prisma.user.upsert({
    where: { email: "admin@timetrackpro.com" },
    update: {},
    create: {
      email: "admin@timetrackpro.com",
      name: "Administrador del Sistema",
      password: hashSync("Admin1234!", 12),
      role: "ADMIN",
      status: "ACTIVE",
    },
  });
  console.log("✅ Admin created:", admin.email);

  // 2. Create Supervisor User
  const supervisor = await prisma.user.upsert({
    where: { email: "supervisor@timetrackpro.com" },
    update: {},
    create: {
      email: "supervisor@timetrackpro.com",
      name: "Supervisor Demo",
      password: hashSync("Super1234!", 12),
      role: "SUPERVISOR",
      status: "ACTIVE",
    },
  });
  console.log("✅ Supervisor created:", supervisor.email);

  // 3. Create Employee User (assigned to supervisor)
  const employee = await prisma.user.upsert({
    where: { email: "empleado@timetrackpro.com" },
    update: {},
    create: {
      email: "empleado@timetrackpro.com",
      name: "Empleado Demo",
      password: hashSync("Emple1234!", 12),
      role: "EMPLOYEE",
      status: "ACTIVE",
      supervisorId: supervisor.id,
    },
  });
  console.log("✅ Employee created:", employee.email);

  // 4. Create Projects
  const projectAlpha = await prisma.project.upsert({
    where: { id: "project-alpha" },
    update: {},
    create: {
      id: "project-alpha",
      name: "Proyecto Alpha",
      description: "Proyecto principal de desarrollo",
      color: "#2563EB",
      status: "ACTIVE",
      startDate: new Date("2025-01-01"),
      endDate: new Date("2025-12-31"),
    },
  });

  const projectBeta = await prisma.project.upsert({
    where: { id: "project-beta" },
    update: {},
    create: {
      id: "project-beta",
      name: "Proyecto Beta",
      description: "Proyecto secundario de investigación",
      color: "#7C3AED",
      status: "ACTIVE",
      startDate: new Date("2025-03-01"),
      endDate: new Date("2025-09-30"),
    },
  });
  console.log("✅ Projects created: Alpha, Beta");

  // 5. Assign all users to both projects
  const users = [admin, supervisor, employee];
  const projects = [projectAlpha, projectBeta];

  for (const user of users) {
    for (const project of projects) {
      await prisma.projectMember.upsert({
        where: {
          userId_projectId: { userId: user.id, projectId: project.id },
        },
        update: {},
        create: {
          userId: user.id,
          projectId: project.id,
        },
      });
    }
  }
  console.log("✅ All users assigned to both projects");

  // 6. Create Tasks in Project Alpha
  const task1 = await prisma.task.upsert({
    where: { id: "task-diseno-ui" },
    update: {},
    create: {
      id: "task-diseno-ui",
      name: "Diseño UI",
      description: "Diseño de la interfaz de usuario del proyecto Alpha",
      status: "IN_PROGRESS",
      estimatedHours: 40,
      projectId: projectAlpha.id,
    },
  });

  const task2 = await prisma.task.upsert({
    where: { id: "task-backend-api" },
    update: {},
    create: {
      id: "task-backend-api",
      name: "Backend API",
      description: "Desarrollo de la API REST del proyecto Alpha",
      status: "PENDING",
      estimatedHours: 60,
      projectId: projectAlpha.id,
    },
  });
  console.log("✅ Tasks created in Project Alpha");

  // 7. Assign tasks to employee
  for (const task of [task1, task2]) {
    await prisma.taskAssignment.upsert({
      where: {
        taskId_userId: { taskId: task.id, userId: employee.id },
      },
      update: {},
      create: {
        taskId: task.id,
        userId: employee.id,
      },
    });
  }
  console.log("✅ Tasks assigned to employee");

  // 8. Create WorkdayConfig (singleton)
  await prisma.workdayConfig.upsert({
    where: { id: "default-config" },
    update: {},
    create: {
      id: "default-config",
      hoursPerDay: 8,
      hoursPerWeek: 40,
      workDays: "1,2,3,4,5",
      overtimeThreshold: 8,
      dayStartTime: "09:00",
      dayEndTime: "17:00",
    },
  });
  console.log("✅ WorkdayConfig created");

  // 9. Create sample time sessions
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  await prisma.timeSession.upsert({
    where: { id: "session-sample-1" },
    update: {},
    create: {
      id: "session-sample-1",
      userId: employee.id,
      projectId: projectAlpha.id,
      taskId: task1.id,
      description: "Trabajo en maquetación de pantallas principales",
      startTime: new Date(yesterday.setHours(9, 0, 0, 0)),
      endTime: new Date(yesterday.setHours(13, 0, 0, 0)),
      duration: 4 * 3600,
      isManual: false,
      sessionStatus: "COMPLETED",
      approvalStatus: "APPROVED",
    },
  });

  await prisma.timeSession.upsert({
    where: { id: "session-sample-2" },
    update: {},
    create: {
      id: "session-sample-2",
      userId: employee.id,
      projectId: projectAlpha.id,
      taskId: task2.id,
      description: "Revisión de endpoints de la API",
      startTime: new Date(yesterday.setHours(14, 0, 0, 0)),
      endTime: new Date(yesterday.setHours(18, 0, 0, 0)),
      duration: 4 * 3600,
      isManual: false,
      sessionStatus: "COMPLETED",
      approvalStatus: "PENDING",
    },
  });
  console.log("✅ Sample time sessions created");

  // 10. Create sample notification
  await prisma.notification.upsert({
    where: { id: "notif-welcome" },
    update: {},
    create: {
      id: "notif-welcome",
      userId: employee.id,
      title: "¡Bienvenido a TimeTrack Pro!",
      message: "Tu cuenta ha sido creada exitosamente. Explora el dashboard para comenzar a registrar tu tiempo.",
      type: "INFO",
      read: false,
    },
  });
  console.log("✅ Sample notification created");

  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
