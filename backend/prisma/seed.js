const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

// ─── Usuarios del seed ──────────────────────────────────────────────────────
// Todos usan upsert — si ya existen, no se sobreescriben.
// Solo "create" se ejecuta en la primera vez.

const USERS = [
  // ── Admin ──────────────────────────────────────────────────────────────
  {
    email:    'admin@javlabs.com',
    name:     'JAV LABS Admin',
    password: 'Admin2024!',
    role:     'ADMIN',
    company:  'JAV LABS',
    services: [],
  },

  // ── Agente de soporte ──────────────────────────────────────────────────
  {
    email:    'agente@javlabs.com',
    name:     'Agente Soporte',
    password: 'Agente2024!',
    role:     'AGENT',
    company:  'JAV LABS',
    services: [],
  },

  // ── Clientes de prueba ─────────────────────────────────────────────────
  {
    email:          'demo.agentes@javlabs.com',
    name:           'Demo — Agentes IA',
    password:       'Demo2024!',
    role:           'CLIENT',
    company:        'Empresa Demo IA',
    n8nProjectKey:  'general',
    services:       ['AGENTES_IA'],
  },
  {
    email:    'demo.marketing@javlabs.com',
    name:     'Demo — Marketing',
    password: 'Demo2024!',
    role:     'CLIENT',
    company:  'Empresa Demo Marketing',
    services: ['MARKETING_META'],
  },
  {
    email:    'demo.web@javlabs.com',
    name:     'Demo — Desarrollo Web',
    password: 'Demo2024!',
    role:     'CLIENT',
    company:  'Empresa Demo Web',
    services: ['DESARROLLO_WEB'],
  },
  {
    email:          'demo.completo@javlabs.com',
    name:           'Demo — Todos los servicios',
    password:       'Demo2024!',
    role:           'CLIENT',
    company:        'Empresa Demo Completo',
    n8nProjectKey:  'general',
    services:       ['AGENTES_IA', 'DESARROLLO_WEB', 'MARKETING_META'],
  },
];

async function main() {
  console.log('\n🌱 Ejecutando seed de usuarios...\n');

  for (const u of USERS) {
    const hash = await bcrypt.hash(u.password, 12);
    await prisma.user.upsert({
      where:  { email: u.email },
      update: {},   // no sobreescribir si ya existe
      create: {
        name:          u.name,
        email:         u.email,
        password:      hash,
        role:          u.role,
        company:       u.company  || null,
        n8nProjectKey: u.n8nProjectKey || null,
        services:      u.services || [],
        isActive:      true,
      },
    });

    const roleLabel = u.role === 'ADMIN' ? '🔴 ADMIN' : u.role === 'AGENT' ? '🟡 AGENT' : '🟢 CLIENT';
    const svcLabel  = u.services?.length ? `[${u.services.join(', ')}]` : '';
    console.log(`  ${roleLabel}  ${u.email}  /  ${u.password}  ${svcLabel}`);
  }

  console.log('\n✅ Seed completado.\n');
}

main().catch((err) => {
  console.error('❌ Error en seed:', err);
  process.exit(1);
}).finally(() => prisma.$disconnect());
