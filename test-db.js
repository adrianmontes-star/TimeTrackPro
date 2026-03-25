const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const sessions = await prisma.timeSession.findMany();
    console.log("SESSIONS IN DB:", sessions.length);
    console.log(sessions);
    
    const users = await prisma.user.findMany();
    console.log("USERS:", users.map(u => ({ id: u.id, email: u.email })));
  } catch (e) {
    console.error("ERROR", e.message);
  } finally {
    await prisma.$disconnect();
  }
}

check();
