const fs = require('fs');
const path = require('path');

// The exact file mentioned in the error
const specificCssFile = path.join(__dirname, 'static', 'css', '15bfecc7400f94b1.css');

// Function to check a CSS file line by line for missing semicolons
function checkCssFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    // Try to find any CSS files in the directory
    const dir = path.dirname(filePath);
    if (fs.existsSync(dir)) {
      console.log(`Checking all CSS files in directory: ${dir}`);
      const files = fs.readdirSync(dir);
      const cssFiles = files.filter(file => file.endsWith('.css'));
      console.log(`Found ${cssFiles.length} CSS files:`);
      cssFiles.forEach(file => console.log(` - ${file}`));
      
      // Process each CSS file
      cssFiles.forEach(file => {
        const fullPath = path.join(dir, file);
        console.log(`\nChecking ${fullPath}:`);
        processCssFile(fullPath);
      });
    }
    return;
  }
  
  processCssFile(filePath);
}

function processCssFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  let hasErrors = false;
  let fixedContent = '';
  let lineNum = 0;
  
  lines.forEach((line, index) => {
    lineNum = index + 1;
    
    // Add the line to the fixed content
    if (lineNum !== lines.length) {
      fixedContent += line + '\n';
    } else {
      fixedContent += line;
    }
    
    // Check for CSS property without semicolon
    const propertyPattern = /^\s*([a-zA-Z\-]+)\s*:\s*([^;{}\s][^;{}]*)$/;
    const match = line.match(propertyPattern);
    
    if (match && !line.trim().endsWith(';')) {
      console.log(`Line ${lineNum}: Missing semicolon after CSS property: ${line}`);
      
      // Fix the content by appending a semicolon at the end
      fixedContent = fixedContent.slice(0, -1) + ';';
      if (lineNum !== lines.length) {
        fixedContent += '\n';
      }
      
      hasErrors = true;
    }
  });
  
  // If errors found, write the fixed content back to file
  if (hasErrors) {
    console.log(`Fixing errors in ${filePath}`);
    try {
      fs.writeFileSync(filePath, fixedContent);
      console.log('CSS file has been fixed.');
    } catch (err) {
      console.error(`Error writing to file: ${err.message}`);
    }
  } else {
    console.log(`No CSS syntax errors found in ${filePath}`);
  }
}

// Check if any CSS files exist in the .next directory
function findCssFilesInNextOutput() {
  console.log('Looking for CSS files in the Next.js output...');
  const possiblePaths = [
    path.join(__dirname, '.next', 'static', 'css'),
    path.join(__dirname, '.next', 'static', 'chunks', 'app'),
    path.join(__dirname, 'static', 'css')
  ];
  
  for (const dir of possiblePaths) {
    if (fs.existsSync(dir)) {
      console.log(`Checking directory: ${dir}`);
      try {
        const files = fs.readdirSync(dir);
        const cssFiles = files.filter(file => file.endsWith('.css'));
        if (cssFiles.length > 0) {
          console.log(`Found ${cssFiles.length} CSS files:`);
          cssFiles.forEach(file => {
            const fullPath = path.join(dir, file);
            console.log(`\nChecking ${fullPath}:`);
            processCssFile(fullPath);
          });
        }
      } catch (err) {
        console.error(`Error reading directory ${dir}: ${err.message}`);
      }
    }
  }
}

console.log('Starting CSS error fix script...');
// First try the specific file mentioned in the error
checkCssFile(specificCssFile);

// Look for CSS files in the Next.js output directories
findCssFilesInNextOutput();

console.log('\nScript completed. If fixes were made, try running the build again with: npm run build');
