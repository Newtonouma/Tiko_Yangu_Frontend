// Simple API connection test
// You can run this in browser console to test the connection

const testApiConnection = async () => {
  try {
    console.log('Testing API connection...');
    
    // Test basic connectivity
    const response = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'testpassword'
      })
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', [...response.headers.entries()]);
    
    const data = await response.text();
    console.log('Response body:', data);
    
    if (response.ok) {
      console.log('✅ API connection successful');
    } else {
      console.log('❌ API returned error status:', response.status);
    }
    
  } catch (error) {
    console.error('❌ Connection failed:', error);
    
    if (error.message.includes('fetch')) {
      console.log('💡 This looks like a network/CORS issue');
      console.log('Make sure:');
      console.log('1. Backend server is running on http://localhost:3000');
      console.log('2. CORS is properly configured in the backend');
      console.log('3. No firewall is blocking the connection');
    }
  }
};

// Run the test
testApiConnection();