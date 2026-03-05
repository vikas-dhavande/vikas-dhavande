const fs = require('fs');
const path = require('path');

const replacements = [
  { regex: /text-slate-100/g, replacement: 'text-black dark:text-white' },
  { regex: /text-slate-200/g, replacement: 'text-gray-800 dark:text-gray-200' },
  { regex: /text-slate-300/g, replacement: 'text-gray-700 dark:text-gray-300' },
  { regex: /text-slate-400/g, replacement: 'text-gray-600 dark:text-gray-400' },
  { regex: /text-slate-500/g, replacement: 'text-gray-500 dark:text-gray-500' },
  
  { regex: /bg-slate-950/g, replacement: 'bg-white dark:bg-black' },
  { regex: /bg-slate-900/g, replacement: 'bg-gray-100 dark:bg-gray-900' },
  { regex: /bg-slate-800/g, replacement: 'bg-gray-200 dark:bg-gray-800' },
  { regex: /bg-slate-700/g, replacement: 'bg-gray-300 dark:bg-gray-700' },
  { regex: /bg-slate-100/g, replacement: 'bg-black dark:bg-white' },
  
  { regex: /border-slate-800/g, replacement: 'border-gray-200 dark:border-gray-800' },
  { regex: /border-slate-700/g, replacement: 'border-gray-300 dark:border-gray-700' },
  
  { regex: /text-cyan-400/g, replacement: 'text-black dark:text-white' },
  { regex: /text-cyan-500/g, replacement: 'text-gray-800 dark:text-gray-200' },
  { regex: /bg-cyan-500/g, replacement: 'bg-black dark:bg-white' },
  { regex: /border-cyan-500/g, replacement: 'border-black dark:border-white' },
  
  // Handle opacities
  { regex: /bg-slate-900\/50/g, replacement: 'bg-gray-100/50 dark:bg-gray-900/50' },
  { regex: /bg-slate-900\/80/g, replacement: 'bg-gray-100/80 dark:bg-gray-900/80' },
  { regex: /bg-slate-900\/40/g, replacement: 'bg-gray-100/40 dark:bg-gray-900/40' },
  { regex: /bg-slate-800\/50/g, replacement: 'bg-gray-200/50 dark:bg-gray-800/50' },
  { regex: /bg-slate-800\/80/g, replacement: 'bg-gray-200/80 dark:bg-gray-800/80' },
  { regex: /border-slate-800\/50/g, replacement: 'border-gray-200/50 dark:border-gray-800/50' },
  { regex: /border-slate-700\/50/g, replacement: 'border-gray-300/50 dark:border-gray-700/50' },
  
  { regex: /bg-cyan-500\/10/g, replacement: 'bg-gray-200 dark:bg-gray-800' },
  { regex: /bg-cyan-500\/20/g, replacement: 'bg-gray-300 dark:bg-gray-700' },
  { regex: /bg-cyan-500\/30/g, replacement: 'bg-gray-400 dark:bg-gray-600' },
  { regex: /border-cyan-500\/20/g, replacement: 'border-gray-300 dark:border-gray-700' },
  { regex: /border-cyan-500\/30/g, replacement: 'border-gray-400 dark:border-gray-600' },
  { regex: /border-cyan-500\/50/g, replacement: 'border-gray-500 dark:border-gray-500' },
  
  { regex: /hover:text-cyan-400/g, replacement: 'hover:text-black dark:hover:text-white' },
  { regex: /hover:text-cyan-300/g, replacement: 'hover:text-gray-800 dark:hover:text-gray-200' },
  { regex: /hover:bg-cyan-500/g, replacement: 'hover:bg-gray-800 dark:hover:bg-gray-200' },
  { regex: /hover:bg-cyan-400/g, replacement: 'hover:bg-gray-700 dark:hover:bg-gray-300' },
  { regex: /hover:border-cyan-500\/50/g, replacement: 'hover:border-black dark:hover:border-white' },
  { regex: /hover:border-cyan-500\/30/g, replacement: 'hover:border-gray-500 dark:hover:border-gray-500' },
  
  // Fix specific cases
  { regex: /bg-cyan-500 text-slate-950/g, replacement: 'bg-black dark:bg-white text-white dark:text-black' },
  { regex: /text-slate-950/g, replacement: 'text-white dark:text-black' },
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  replacements.forEach(({ regex, replacement }) => {
    content = content.replace(regex, replacement);
  });
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

const files = [
  'src/components/ImageWithFallback.tsx',
  'src/pages/Home.tsx',
  'src/pages/Blogs.tsx',
  'src/pages/Projects.tsx',
  'src/pages/Skills.tsx',
  'src/pages/Docs.tsx',
  'src/pages/Contact.tsx',
  'src/pages/ProjectDetails.tsx'
];

files.forEach(file => processFile(path.join(__dirname, file)));
