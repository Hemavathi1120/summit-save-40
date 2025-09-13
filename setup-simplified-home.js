// setup-simplified-home.js
const fs = require('fs');
const path = require('path');

const projectPath = 'c:\\Users\\HEMAVATHI\\OneDrive\\Desktop\\expense manager\\summit-save-40';
const appTsxPath = path.join(projectPath, 'src', 'App.tsx');

// Read the current App.tsx content
let appTsxContent = fs.readFileSync(appTsxPath, 'utf8');

// Add import for SimplifiedHome
if (!appTsxContent.includes("import SimplifiedHome from './pages/SimplifiedHome';")) {
  appTsxContent = appTsxContent.replace(
    "import Index from './pages/Index';",
    "import Index from './pages/Index';\nimport SimplifiedHome from './pages/SimplifiedHome';"
  );
}

// Update the routes to use SimplifiedHome as main page
appTsxContent = appTsxContent.replace(
  /<Route path="\/" element={<Index \/>} \/>/g,
  '<Route path="/" element={<SimplifiedHome />} />\n        <Route path="/personal" element={<Index />} />'
);

// Write the updated content back to App.tsx
fs.writeFileSync(appTsxPath, appTsxContent, 'utf8');

console.log('Setup completed successfully!');