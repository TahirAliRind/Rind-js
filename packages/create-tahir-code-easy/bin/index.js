#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

async function main() {
  const projectName = process.argv[2] || 'my-rind-app';
  const projectPath = path.join(process.cwd(), projectName);

  if (fs.existsSync(projectPath)) {
    console.error(`❌ Folder "${projectName}" pehle se mojood hai.`);
    process.exit(1);
  }

  console.log(`\n🚀 Rind.js project bana rahe hain: ${projectName}\n`);

  fs.mkdirSync(path.join(projectPath, 'src'), { recursive: true });

  // package.json
  fs.writeFileSync(
    path.join(projectPath, 'package.json'),
    JSON.stringify({
      name: projectName,
      private: true,
      version: '0.0.0',
      type: 'module',
      scripts: {
        dev: 'vite',
        build: 'vite build',
        preview: 'vite preview',
      },
      dependencies: {
        'tahir-code-easy': '^2.0.0',
      },
      devDependencies: {
        vite: '^5.0.0',
        '@tailwindcss/vite': '^4.3.3',
        tailwindcss: '^4.3.3',
      },
    }, null, 2)
  );

  // index.html
  fs.writeFileSync(
    path.join(projectPath, 'index.html'),
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${projectName}</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.js"></script>
</body>
</html>`
  );

  // vite.config.js
  fs.writeFileSync(
    path.join(projectPath, 'vite.config.js'),
    `import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { vitePluginIt } from 'tahir-code-easy';

export default defineConfig({
  plugins: [tailwindcss(), vitePluginIt()],
});`
  );

  // src/main.js
  fs.writeFileSync(
    path.join(projectPath, 'src', 'main.js'),
    `import './index.css';
import { renderApp } from 'tahir-code-easy';
import App from './App.it';

renderApp(App, document.getElementById('root'));`
  );

  // src/index.css
  fs.writeFileSync(
    path.join(projectPath, 'src', 'index.css'),
    `@import 'tailwindcss';\n`
  );

  // src/App.it
  fs.writeFileSync(
    path.join(projectPath, 'src', 'App.it'),
    `STATE:
count-0

SCRIPT:
function increment() {
  STATE.count = STATE.count + 1;
  RERENDER();
}

[
  DI-flex,
  FLE-column,
  JUS-center,
  ALI-center,
  HEI-XL,
  BG-#1a1a2e,
  GAP-20px,

  {
    TEXT-"Hello Rind.js!",
    COL-#e94560,
    FON-3rem,
    FONW-bold
  },
  {
    TEXT-"Count: " + STATE.count,
    COL-#ffffff,
    FON-2rem
  },
  {
    TAG-button,
    TEXT-"Click Me",
    PA-12px 24px,
    BG-#e94560,
    COL-#fff,
    BOR-8px,
    CUR-pointer,
    BO-none,
    FON-1rem,
    FONW-bold,
    ONCLICK-increment
  }
]`
  );

  // .gitignore
  fs.writeFileSync(
    path.join(projectPath, '.gitignore'),
    `node_modules/\ndist/\n.vite/\n*.local\n`
  );

  console.log(`✅ Project ban gaya: ${projectName}`);
  console.log(`\nAb yeh commands chalayein:\n`);
  console.log(`  cd ${projectName}`);
  console.log(`  pnpm install`);
  console.log(`  pnpm run dev\n`);
}

main().catch(console.error);