const https = require('http');

// Test the lead sprints API endpoint
const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/lead/sprints',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    // You'll need to replace this with a valid JWT token from a logged in team lead
    'Authorization': 'Bearer YOUR_JWT_TOKEN_HERE'
  }
};

const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log('\n=== API Response ===');
      console.log(JSON.stringify(parsed, null, 2));
    } catch (e) {
      console.log('\n=== Raw Response ===');
      console.log(data);
    }
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

console.log('Testing /api/lead/sprints endpoint...');
console.log('Note: You need to replace YOUR_JWT_TOKEN_HERE with a valid token');

// Comment out the actual request since we don't have a token ready
// req.end();

console.log('Script ready. To test with a real token:');
console.log('1. Login to the frontend');
console.log('2. Copy the JWT token from localStorage or network requests');
console.log('3. Replace YOUR_JWT_TOKEN_HERE in this script');
console.log('4. Uncomment req.end() line');
console.log('5. Run: node test-api.js');
