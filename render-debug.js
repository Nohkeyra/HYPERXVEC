const fs = require('fs');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
console.log('=== PACKAGE.JSON CONTENTS ===');
console.log(JSON.stringify(packageJson, null, 2));
console.log('=== SCRIPTS AVAILABLE ===');
console.log(packageJson.scripts);
console.log('=== BUILD COMMAND ===');
console.log(packageJson.scripts?.build || 'NOT FOUND');
