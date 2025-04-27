const fs = require('fs');

// Read the SBOM file
const sbom = JSON.parse(fs.readFileSync('sbom.json', 'utf8'));

// Extract license information with better error handling
const licenses = sbom.components
  .filter(component => component.licenses)
  .map(component => {
    // Extract license information safely
    const licenseInfo = component.licenses.map(l => {
      // Handle different possible structures
      if (l.license) {
        return l.license.id || l.license.name || l.license.url || 'Unknown';
      } else if (l.expression) {
        return l.expression;
      } else if (typeof l === 'string') {
        return l;
      }
      return 'Unknown license format';
    });
    
    return {
      name: component.name,
      version: component.version,
      licenses: licenseInfo
    };
  });

// Output as formatted JSON
console.log(JSON.stringify(licenses, null, 2));

// Optional: Output in a more readable format
console.log('\nLicense Summary:');
licenses.forEach(item => {
  console.log(`${item.name}@${item.version}: ${item.licenses.join(', ')}`);
});