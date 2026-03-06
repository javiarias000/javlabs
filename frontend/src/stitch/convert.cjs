const fs = require('fs');
const path = require('path');

const stitchDir = path.join(__dirname);

function toPascalCase(str) {
  return str.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
}

function htmlToJsx(html) {
  return html
    // ── 1. Comentarios HTML → JSX (PRIMERO antes de todo)
    .replace(/<!--[\s\S]*?-->/g, '')

    // ── 2. class / for
    .replace(/\bclass=/g, 'className=')
    .replace(/\bfor=/g, 'htmlFor=')

    // ── 3. Fix doble cierre: type="text"/ /> → type="text" />
    .replace(/"\s*\/\s*\/>/g, '" />')

    // ── 4. Self-closing tags simples
    .replace(/<br\s*\/?>/gi, '<br />')
    .replace(/<hr\s*\/?>/gi, '<hr />')

    // ── 5. Void elements sin cerrar → self-closing
    .replace(/<(input|img|link|meta|area|base|col|embed|param|source|track|wbr)(\s[^>]*)?(\/?)>/gi,
      (match, tag, attrs, slash) => {
        const a = (attrs || '').replace(/\/$/, '').trimEnd();
        return `<${tag}${a} />`;
      }
    )

    // ── 6. Escapar llaves { } en texto plano (no dentro de atributos)
    .replace(/(?<=>)([^<]*)(?=<)/g, (match) => {
      return match.replace(/\{/g, '&#123;').replace(/\}/g, '&#125;');
    })

    // ── 7. Eliminar event handlers inline
    .replace(/\s+on[A-Za-z]+="[^"]*"/g, '')

    // ── 8. Convertir style="..." → style={{ ... }}
    .replace(/style="([^"]*)"/g, (match, styles) => {
      const obj = styles.split(';')
        .filter(s => s.trim())
        .map(s => {
          const [prop, ...val] = s.split(':');
          if (!prop || !val.length) return null;
          const camel = prop.trim().replace(/-([a-z])/g, (_, l) => l.toUpperCase());
          const value = val.join(':').trim().replace(/'/g, '"');
          return `${camel}: '${value}'`;
        })
        .filter(Boolean)
        .join(', ');
      return obj ? `style={{ ${obj} }}` : '';
    })

    // ── 9. tabindex → tabIndex
    .replace(/\btabindex=/g, 'tabIndex=')

    // ── 10. readonly → readOnly
    .replace(/\breadonly\b/g, 'readOnly')

    // ── 11. autofocus → autoFocus
    .replace(/\bautofocus\b/g, 'autoFocus')

    // ── 12. checked sin valor → checked={true}
    .replace(/\bchecked\b(?!=)/g, 'defaultChecked')

    // ── 13. Eliminar scripts inline
    .replace(/<script[\s\S]*?<\/script>/gi, '');
}

function extractStyle(html) {
  const match = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
  return match ? match[1] : '';
}

function extractBody(html) {
  const match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  return match ? match[1].trim() : html;
}

const folders = fs.readdirSync(stitchDir).filter(f => {
  const fullPath = path.join(stitchDir, f);
  return fs.statSync(fullPath).isDirectory();
});

console.log(`\n🚀 Convirtiendo ${folders.length} carpetas...\n`);

let success = 0;
let skipped = 0;

folders.forEach(folder => {
  const folderPath = path.join(stitchDir, folder);
  const files = fs.readdirSync(folderPath);
  const htmlFile = files.find(f => f.endsWith('.html'));

  if (!htmlFile) {
    console.log(`⚠️  Sin HTML en: ${folder}`);
    skipped++;
    return;
  }

  const componentName = toPascalCase(folder);
  const htmlPath = path.join(folderPath, htmlFile);
  const rawHtml = fs.readFileSync(htmlPath, 'utf-8');

  const css = extractStyle(rawHtml);
  const body = extractBody(rawHtml);
  const jsx = htmlToJsx(body);

  if (css.trim()) {
    fs.writeFileSync(
      path.join(folderPath, `${componentName}.css`),
      css.trim()
    );
  }

  const cssImport = css.trim() ? `import './${componentName}.css';\n` : '';
  const jsxContent = `${cssImport}
export default function ${componentName}() {
  return (
    <>
      ${jsx.trim()}
    </>
  );
}
`;

  fs.writeFileSync(path.join(folderPath, `${componentName}.jsx`), jsxContent);
  console.log(`✅ ${folder} → ${componentName}.jsx`);
  success++;
});

console.log(`\n✨ Completado: ${success} convertidos, ${skipped} omitidos.\n`);
