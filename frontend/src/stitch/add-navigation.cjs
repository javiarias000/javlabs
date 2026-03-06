const fs = require('fs');
const path = require('path');

const stitchDir = __dirname;

const textToRoute = [
  { texts: ['home', 'inicio'],                                    route: '/' },
  { texts: ['services', 'servicios', 'ver servicios'],            route: '/servicios' },
  { texts: ['contact', 'contacto', 'contáctanos'],                route: '/contacto' },
  { texts: ['login', 'iniciar sesión', 'sign in', 'ingresar'],    route: '/login' },
  { texts: ['dashboard', 'overview', 'resumen'],                  route: '/dashboard' },
  { texts: ['performance', 'rendimiento'],                        route: '/dashboard/performance' },
  { texts: ['automatizaciones', 'automations', 'active automations'], route: '/automatizaciones' },
  { texts: ['management', 'tabla', 'manage'],                     route: '/automatizaciones/tabla' },
  { texts: ['nueva automatización', 'new automation'],            route: '/automatizaciones/nueva' },
  { texts: ['logic', 'lógica', 'test'],                           route: '/automatizaciones/logica' },
  { texts: ['logs', 'error tracking'],                            route: '/automatizaciones/logs' },
  { texts: ['error analysis', 'análisis de errores'],             route: '/automatizaciones/errores' },
  { texts: ['workflow'],                                          route: '/workflow/v1' },
  { texts: ['support', 'soporte técnico', 'contactar soporte'],   route: '/soporte/chat' },
  { texts: ['ticket'],                                            route: '/soporte/ticket' },
];

function addNavigation(content) {
  let result = content;
  let needsNavigate = false;

  // ── 1. Agregar import react-router-dom si no existe
  if (!result.includes("react-router-dom")) {
    result = result.replace(
      /^(import)/m,
      `import { Link, useNavigate } from 'react-router-dom';\n$1`
    );
  }

  // ── 2. Convertir <a href="#"> con texto conocido → <Link to="/ruta">
  textToRoute.forEach(({ texts, route }) => {
    texts.forEach(text => {
      const regex = new RegExp(
        `<a([^>]*)href="[^"]*"([^>]*)>\\s*([^<]*${text}[^<]*)\\s*<\\/a>`,
        'gi'
      );
      result = result.replace(regex, (match, before, after, linkText) => {
        // Limpiar atributos href existentes
        const attrs = (before + after).replace(/href="[^"]*"/g, '').trim();
        return `<Link to="${route}" ${attrs}>${linkText.trim()}</Link>`;
      });
    });
  });

  // ── 3. Agregar onClick a botones con texto conocido (solo si NO tienen onClick ya)
  textToRoute.forEach(({ texts, route }) => {
    texts.forEach(text => {
      const regex = new RegExp(
        `<button((?:(?!onClick)[^>])*)>\\s*([^<]*${text}[^<]*)\\s*<\\/button>`,
        'gi'
      );
      result = result.replace(regex, (match, attrs, btnText) => {
        needsNavigate = true;
        return `<button${attrs} onClick={() => navigate('${route}')}>${btnText.trim()}</button>`;
      });
    });
  });

  // ── 4. Agregar useNavigate hook si se necesita
  if (needsNavigate || result.includes('navigate(')) {
    if (!result.includes('useNavigate()')) {
      result = result.replace(
        /export default function (\w+)\(\) \{/,
        `export default function $1() {\n  const navigate = useNavigate();`
      );
    }
  }

  // ── 5. href="#" restantes → href="/"
  result = result.replace(/href="#"/g, 'href="/"');

  return result;
}

const folders = fs.readdirSync(stitchDir).filter(f =>
  fs.statSync(path.join(stitchDir, f)).isDirectory()
);

console.log(`\n🔗 Agregando navegación a ${folders.length} componentes...\n`);

let success = 0;

folders.forEach(folder => {
  const folderPath = path.join(stitchDir, folder);
  const files = fs.readdirSync(folderPath);
  const jsxFile = files.find(f => f.endsWith('.jsx'));
  if (!jsxFile) return;

  const jsxPath = path.join(folderPath, jsxFile);
  const content = fs.readFileSync(jsxPath, 'utf-8');
  const updated = addNavigation(content);
  fs.writeFileSync(jsxPath, updated);
  console.log(`✅ ${jsxFile}`);
  success++;
});

console.log(`\n✨ ${success} componentes actualizados.\n`);
