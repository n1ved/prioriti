const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'next.config.js');

console.log('Checking for existing Next.js config...');

if (fs.existsSync(configPath)) {
  console.log('Found existing next.config.js - please merge the webpack configuration from the new file manually');
  
  // Read the existing config to help with the merge
  const existingConfig = fs.readFileSync(configPath, 'utf8');
  console.log('\nExisting config:');
  console.log(existingConfig);
  
  console.log('\nPlease add the webpack configuration from the new file to your existing config.');
} else {
  console.log('No existing next.config.js found. The new config file can be used as is.');
}

console.log('\nAfter updating the config, run: npm run build');
