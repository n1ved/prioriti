const fs = require('fs');
const path = require('path');

// Directory to search - use the project root
const rootDir = __dirname;

// Check for CSS syntax issues in source files
function checkCssSyntax(filePath, content) {
  let hasErrors = false;
  let fixedContent = content;
  
  // Check for missing semicolons in CSS properties
  // This regex looks for CSS property patterns without semicolons
  const missingColonRegex = /([a-zA-Z\-]+)\s*:\s*[^;{}\n\r]+(?=\n|\r|$|\})/g;
  
  let match;
  while ((match = missingColonRegex.exec(content)) !== null) {
    // Calculate the line number for better reporting
    const upToMatch = content.substring(0, match.index);
    const lineNum = upToMatch.split('\n').length;
    
    console.log(`Found missing semicolon in ${filePath}:${lineNum} - Property: ${match[1]}`);
    hasErrors = true;
    
    // Fix the content by adding a semicolon where needed
    const matchedText = match[0];
    const fixedText = matchedText + ';';
    
    // Replace just this occurrence
    fixedContent = fixedContent.substring(0, match.index) + 
                  fixedText +
                  fixedContent.substring(match.index + matchedText.length);
  }
  
  // Return the fixed content if errors were found
  return { hasErrors, fixedContent };
}

// Handle JS/TS files which may contain CSS in styles
function processJsFile(filePath, content) {
  let hasErrors = false;
  let fixedContent = content;
  
  // Look for style objects or CSS template literals
  // This regex finds CSS-like content in JS/TS files
  const cssInJsRegex = /(style\s*=\s*{[^}]*})|(css`[^`]*`)/g;
  
  let match;
  while ((match = cssInJsRegex.exec(content)) !== null) {
    const cssText = match[0];
    const { hasErrors: hasInnerErrors, fixedContent: fixedCss } = checkCssSyntax(
      `${filePath} (CSS-in-JS)`, 
      cssText
    );
    
    if (hasInnerErrors) {
      hasErrors = true;
      // Replace this CSS segment with the fixed version
      fixedContent = fixedContent.substring(0, match.index) + 
                    fixedCss + 
                    fixedContent.substring(match.index + cssText.length);
    }
  }
  
  return { hasErrors, fixedContent };
}

// Process a single file
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let result;
    
    // Process based on file extension
    if (['.css', '.scss', '.less'].includes(path.extname(filePath).toLowerCase())) {
      result = checkCssSyntax(filePath, content);
    } else if (['.js', '.jsx', '.ts', '.tsx'].includes(path.extname(filePath).toLowerCase())) {
      result = processJsFile(filePath, content);
    } else {
      return false;
    }
    
    // Write back if there were changes
    if (result.hasErrors) {
      console.log(`Fixing issues in ${filePath}`);
      fs.writeFileSync(filePath, result.fixedContent, 'utf8');
      return true;
    }
    
    return false;
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err);
    return false;
  }
}

// Scan directories recursively
function scanDirectory(dir) {
  let filesCorrected = 0;
  
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      if (item === 'node_modules' || item === '.next' || item === '.git') continue;
      
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        filesCorrected += scanDirectory(itemPath);
      } else if (stat.isFile()) {
        if (processFile(itemPath)) {
          filesCorrected++;
        }
      }
    }
  } catch (err) {
    console.error(`Error scanning directory ${dir}:`, err);
  }
  
  return filesCorrected;
}

// Clean build directories to ensure fresh build
function cleanBuild() {
  console.log('Cleaning build artifacts...');
  
  const dirsToClean = [
    path.join(rootDir, '.next'),
    path.join(rootDir, 'static')
  ];
  
  dirsToClean.forEach(dir => {
    if (fs.existsSync(dir)) {
      console.log(`Removing ${dir}`);
      try {
        // Simple delete might fail for directories, this is just a basic example
        // In production code, you might want to use a recursive directory deletion
        fs.rmSync(dir, { recursive: true, force: true });
      } catch (err) {
        console.error(`Failed to remove ${dir}:`, err);
      }
    }
  });
}

// Main execution
console.log('Starting source CSS fix script...');

// Clean first
cleanBuild();

// Scan and fix source files
console.log('Scanning for CSS syntax errors in source files...');
const filesCorrected = scanDirectory(path.join(rootDir, 'src'));
console.log(`Fixed ${filesCorrected} files with CSS syntax errors.`);

console.log('\nScript completed. Run the build with: npm run build');
