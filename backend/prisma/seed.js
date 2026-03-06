const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('javlabs_admin_2024', 12);
  await prisma.user.upsert({
    where: { email: 'admin@javlabs.com' },
    update: {},
    create: { name: 'JAV LABS Admin', email: 'admin@javlabs.com', password: adminPassword, role: 'ADMIN', company: 'JAV LABS' },
  });
  console.log('✅ Admin creado: admin@javlabs.com / javlabs_admin_2024');
}

main().catch(console.error).finally(() => prisma.$disconnect());
