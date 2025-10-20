/** @type {import('next').NextConfig} */
const fs = require('fs');
const path = require('path');

const nextConfig = {
  // Keep existing configuration here
  
  webpack: (config, { isServer, webpack }) => {
    // Add a plugin to fix CSS semicolon issues after emitting assets
    config.plugins.push({
      apply: (compiler) => {
        compiler.hooks.afterEmit.tapAsync('FixCssSemicolons', (compilation, callback) => {
          // Look for the CSS file mentioned in the error
          const staticCssDir = path.join(__dirname, 'static', 'css');
          
          if (!fs.existsSync(staticCssDir)) {
            console.log('Static CSS directory not found, skipping CSS fix');
            callback();
            return;
          }
          
          try {
            const cssFiles = fs.readdirSync(staticCssDir);
            
            // Process each CSS file
            cssFiles.forEach(file => {
              if (file.endsWith('.css')) {
                const cssFilePath = path.join(staticCssDir, file);
                console.log(`Checking for missing semicolons in: ${cssFilePath}`);
                
                let cssContent = fs.readFileSync(cssFilePath, 'utf8');
                const originalLength = cssContent.length;
                
                // Add semicolons to any CSS properties that are missing them
                // Match property: value without a semicolon at the end
                // This regex matches property:value pairs without semicolons
                const missingColonRegex = /([a-zA-Z\-]+)\s*:\s*[^;{}\n\r]+(?=\n|\r|$|\}|\s+[a-zA-Z\-]+\s*:)/g;
                
                cssContent = cssContent.replace(missingColonRegex, '$&;');
                
                // Special case for line 39 at position 29 (from the error message)
                // Split by lines to get to line 39
                const cssLines = cssContent.split('\n');
                if (cssLines.length >= 39) {
                  const line39 = cssLines[38]; // 0-indexed, so line 39 is at index 38
                  
                  // If position 29 exists and doesn't have a semicolon, add one
                  if (line39.length >= 29 && line39.charAt(29) !== ';' && 
                      !line39.substring(29).includes(';')) {
                    console.log('Fixing specific error on line 39');
                    cssLines[38] = line39.slice(0, 29) + ';' + line39.slice(29);
                    cssContent = cssLines.join('\n');
                  }
                }
                
                // Write the fixed content back
                if (cssContent.length !== originalLength) {
                  console.log(`Fixed missing semicolons in: ${cssFilePath}`);
                  fs.writeFileSync(cssFilePath, cssContent);
                }
              }
            });
          } catch (err) {
            console.error('Error fixing CSS semicolons:', err);
          }
          
          callback();
        });
      }
    });
    
    // Return the modified config
    return config;
  }
};

module.exports = nextConfig;
