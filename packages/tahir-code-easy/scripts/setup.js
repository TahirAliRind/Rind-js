// Yeh script user ke project mein Tailwind config files create karti hai

import fs from 'fs';
import path from 'path';

const cwd = process.cwd(); // User ka project root

const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{it,js,ts,jsx,tsx}'],
  theme: { extend: {} },
  plugins: [],
};
`;

const postcssConfig = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;

const cssContent = `@tailwind base;
@tailwind components;
@tailwind utilities;
`;

try {
  // Agar files pehle se nahi hain to hi banayein
  if (!fs.existsSync(path.join(cwd, 'tailwind.config.js'))) {
    fs.writeFileSync(path.join(cwd, 'tailwind.config.js'), tailwindConfig);
    console.log('✅ Created tailwind.config.js');
  }
  if (!fs.existsSync(path.join(cwd, 'postcss.config.js'))) {
    fs.writeFileSync(path.join(cwd, 'postcss.config.js'), postcssConfig);
    console.log('✅ Created postcss.config.js');
  }
  // src folder check karein
  const srcDir = path.join(cwd, 'src');
  if (!fs.existsSync(srcDir)) {
    fs.mkdirSync(srcDir, { recursive: true });
  }
  if (!fs.existsSync(path.join(srcDir, 'index.css'))) {
    fs.writeFileSync(path.join(srcDir, 'index.css'), cssContent);
    console.log('✅ Created src/index.css');
  }
} catch (error) {
  console.error('❌ Setup failed:', error.message);
}