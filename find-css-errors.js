const fs = require('fs');
const path = require('path');

// Directory to search - use the current directory (prioriti project root)
const rootDir = __dirname;

// CSS property pattern that might indicate a missing semicolon
function hasMissingCssSemicolon(line) {
  // CSS property pattern: property: value (without a semicolon at the end)
  const cssPropertyPattern = /^\s*[a-zA-Z\-]+\s*:\s*[^;{}\s][^;{}]*$/;
  
  // Ignore comments, brackets, etc.
  return line.trim() && 
         !line.trim().startsWith('//') && 
         !line.trim().startsWith('/*') && 
         !line.trim().endsWith('{') && 
         !line.trim().endsWith('}') && 
         cssPropertyPattern.test(line.trim());
}

// Function to extract template literals that look like CSS
function findCssInJsCode(fileContent) {
  const cssTemplateMatches = [];
  
  // Match CSS template literals (e.g., in styled-components, emotion, CSS modules)
  const cssTemplateRegex = /(?:css|styled|createStyles|makeStyles)\s*`([^`]+)`/g;
  let match;
  
  while ((match = cssTemplateRegex.exec(fileContent)) !== null) {
    if (match[1]) {
      cssTemplateMatches.push({
        content: match[1],
        startIndex: match.index
      });
    }
  }
  
  // Look for CSS objects (e.g., { color: 'red' })
  const cssObjectRegex = /style\s*=\s*{[^}]+}/g;
  while ((match = cssObjectRegex.exec(fileContent)) !== null) {
    cssTemplateMatches.push({
      content: match[0],
      startIndex: match.index
    });
  }
  
  return cssTemplateMatches;
}

// Function to scan file content
function scanFileContent(filePath, content) {
  const lines = content.split('\n');
  let hasErrors = false;
  
  // Regular CSS check
  lines.forEach((line, index) => {
    if (hasMissingCssSemicolon(line)) {
      console.log(`Possible missing semicolon in ${filePath} at line ${index + 1}:`);
      console.log(`  ${line}`);
      hasErrors = true;
    }
  });
  
  // For JS/TS files, check for CSS in template literals or objects
  if (['.js', '.jsx', '.ts', '.tsx'].includes(path.extname(filePath).toLowerCase())) {
    const cssMatches = findCssInJsCode(content);
    
    cssMatches.forEach(cssMatch => {
      const cssLines = cssMatch.content.split('\n');
      cssLines.forEach((cssLine, lineIndex) => {
        if (hasMissingCssSemicolon(cssLine)) {
          // Calculate the actual line number in the file
          const actualLineNumber = content.substring(0, cssMatch.startIndex).split('\n').length + lineIndex;
          console.log(`Possible missing semicolon in CSS-in-JS in ${filePath} at line ${actualLineNumber}:`);
          console.log(`  ${cssLine}`);
          hasErrors = true;
        }
      });
    });
  }
  
  return hasErrors;
}

// Function to recursively scan directories
function scanDirectory(dir, extensions) {
  try {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && file !== 'node_modules' && file !== '.next') {
        scanDirectory(filePath, extensions);
      } else if (
        stat.isFile() && 
        extensions.includes(path.extname(file).toLowerCase())
      ) {
        const content = fs.readFileSync(filePath, 'utf8');
        scanFileContent(filePath, content);
      }
    });
  } catch (err) {
    console.error(`Error scanning directory ${dir}:`, err);
  }
}

// Also check for CSS in compiled files
function checkGeneratedCssFiles() {
  const staticCssPath = path.join(rootDir, 'static', 'css');
  
  if (fs.existsSync(staticCssPath)) {
    console.log('Checking generated CSS files...');
    scanDirectory(staticCssPath, ['.css']);
  }
}

// Start scanning - include JS/TS files that might contain CSS
console.log('Scanning for CSS syntax errors...');
scanDirectory(rootDir, ['.css', '.scss', '.less', '.js', '.jsx', '.ts', '.tsx']);
checkGeneratedCssFiles();
console.log('Scan complete.');
