// Test login endpoint
const loginData = {
  email: 'admin@genworx.ai',
  password: '@admin123'
};

fetch('http://localhost:5000/api/users/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(loginData)
})
.then(response => response.json())
.then(data => {
  console.log('Login response:', data);
})
.catch(error => {
  console.error('Login error:', error);
});
