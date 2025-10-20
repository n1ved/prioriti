const fs = require('fs');
const path = require('path');

// Location of Next.js CSS minimizer plugin
const cssMinimzerPluginPath = path.join(
  __dirname,
  'node_modules',
  'next',
  'dist',
  'build',
  'webpack',
  'plugins',
  'css-minimizer-plugin.js'
);

console.log('Patching Next.js CSS Minimizer Plugin...');

// Check if the file exists
if (!fs.existsSync(cssMinimzerPluginPath)) {
  console.error(`CSS Minimizer plugin not found at: ${cssMinimzerPluginPath}`);
  process.exit(1);
}

// Read the original file content
let content = fs.readFileSync(cssMinimzerPluginPath, 'utf8');

// Make a backup of the original file
const backupPath = cssMinimzerPluginPath + '.backup';
if (!fs.existsSync(backupPath)) {
  console.log(`Creating backup at: ${backupPath}`);
  fs.writeFileSync(backupPath, content);
} else {
  console.log('Backup already exists, not overwriting');
}

// Find the optimizeAsset function in the file
const optimizeAssetRegex = /async\s+optimizeAsset\s*\([^)]*\)\s*{/;
const match = content.match(optimizeAssetRegex);

if (!match) {
  console.error('Could not find optimizeAsset function in the plugin');
  process.exit(1);
}

// Get the position of the function start
const insertPosition = match.index + match[0].length;

// Prepare the patch code
const patchCode = `
    // BEGIN PATCHED CODE - Add semicolons to CSS to fix syntax errors
    try {
      // Add semicolons to CSS properties that are missing them
      const fixMissingSemicolons = (css) => {
        return css.replace(/([a-zA-Z-]+\\s*:\\s*[^;{}\\r\\n]+)([\\r\\n]|$|\\s*}|\\s+[a-zA-Z-])/g, '$1;$2');
      };
      
      if (typeof input === 'string') {
        input = fixMissingSemicolons(input);
        
        // Handle specific line 39 position 29 issue from error message
        const lines = input.split('\\n');
        if (lines.length >= 39) {
          const line39 = lines[38]; // 0-indexed
          if (line39 && line39.length >= 29) {
            const restOfLine = line39.substring(29);
            if (!restOfLine.includes(';')) {
              lines[38] = line39.substring(0, 29) + ";" + line39.substring(29);
              input = lines.join('\\n');
            }
          }
        }
      }
    } catch (fixError) {
      console.error('Error while fixing missing semicolons:', fixError);
    }
    // END PATCHED CODE
`;

// Insert the patch code at the beginning of the optimizeAsset function
content = content.slice(0, insertPosition) + patchCode + content.slice(insertPosition);

// Write the patched file
console.log('Writing patched plugin file...');
fs.writeFileSync(cssMinimzerPluginPath, content);
console.log('Patching complete!');
console.log('Now run: npm run build');
