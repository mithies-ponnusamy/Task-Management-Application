const axios = require('axios');

async function testLogin() {
  try {
    const response = await axios.post('http://localhost:5000/api/users/login', {
      email: 'admin@genworx.ai',
      password: '@admin123'
    });
    
    console.log('Login response:', response.data);
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
  }
}

testLogin();
