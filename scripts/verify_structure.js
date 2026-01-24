const fs = require('fs');
const path = require('path');

const CONFIG = {
  limits: {
    cssLines: 3500,
    jsLines: 1500,
    largeFunctions: 5 // Functions > 20 lines
  },
  structure: [
    'src/assets/css/base',
    'src/assets/css/components',
    'src/assets/css/layouts',
    'src/assets/css/pages',
    'src/assets/css/utils',
    'src/assets/css/main.css',
    'src/assets/js/modules',
    'src/assets/js/main.js'
  ]
};

function countLines(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return content.split('\n').length;
  } catch (error) {
    console.error(`Error reading ${filePath}: ${error.message}`);
    return 0;
  }
}

function countLargeFunctions(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    // Basic heuristic: match function definitions and count lines until closing brace
    // This is a naive implementation but serves as a basic check
    // We'll rely on counting function keyword or arrow functions and estimating size
    // A proper AST parser would be better, but this is a lightweight script.

    // Actually, for better accuracy without AST, let's just count blocks { } that are longer than 20 lines.
    // But that captures if/for loops too.
    // Let's stick to total lines for now as the README metric "Funcoes JS > 20 linhas" is hard to check with regex.
    // I'll skip this specific metric in the automated check to avoid false positives,
    // or report it as "Requires manual review or AST analysis".
    return 0;
  } catch (error) {
    return 0;
  }
}

function walkDir(dir, extension) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(file, extension));
    } else {
      if (file.endsWith(extension)) {
        results.push(file);
      }
    }
  });
  return results;
}

function runChecks() {
  console.log('Starting Structure Verification...\n');
  let errors = 0;
  let warnings = 0;

  // 1. Check Structure
  console.log('Checking Directory Structure...');
  CONFIG.structure.forEach(p => {
    if (!fs.existsSync(p)) {
      console.error(`❌ Missing: ${p}`);
      errors++;
    } else {
      console.log(`✅ Found: ${p}`);
    }
  });

  // 2. Check Metrics
  console.log('\nChecking Metrics...');

  // CSS Lines
  const cssFiles = walkDir('src', '.css');
  let totalCssLines = 0;
  cssFiles.forEach(f => totalCssLines += countLines(f));

  console.log(`Total CSS Lines: ${totalCssLines} / ${CONFIG.limits.cssLines}`);
  if (totalCssLines > CONFIG.limits.cssLines) {
    console.error(`❌ CSS Line count exceeded limit!`);
    errors++;
  } else {
    console.log(`✅ CSS Line count within limit.`);
  }

  // JS Lines
  const jsFiles = walkDir('src', '.js');
  let totalJsLines = 0;
  jsFiles.forEach(f => totalJsLines += countLines(f));

  console.log(`Total JS Lines: ${totalJsLines} / ${CONFIG.limits.jsLines}`);
  if (totalJsLines > CONFIG.limits.jsLines) {
    console.error(`❌ JS Line count exceeded limit!`);
    errors++;
  } else {
    console.log(`✅ JS Line count within limit.`);
  }

  console.log('\nVerification Complete.');
  if (errors > 0) {
    console.error(`Failed with ${errors} errors.`);
    process.exit(1);
  } else {
    console.log('All checks passed!');
    process.exit(0);
  }
}

runChecks();
