/* eslint-disable no-unused-vars */
import React, { useState } from 'react';

function LoginPage() {

  const [loggedInEmail, setLoggedInEmail] = useState('');
  const [userRole, setUserRole] = useState('');

  async function handleLogin(email, password) {
    try {
      console.log("Attempting to login");
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.message === "Login successful") {
        try {
          console.log("Login successful");
          localStorage.setItem('token', data.token);
          setLoggedInEmail(email);
          setUserRole(data.role); 

          window.location.href = '/home'; 
        } catch (error) {
          console.error('Error saving token to localStorage:', error);
        }       
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  }

  return (
    <div className='container'>
      <div className="mt-3">
        <form onSubmit={(e) => {
          e.preventDefault();
          const email = e.target.email.value;
          const password = e.target.password.value;
          handleLogin(email, password);
        }}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input type="email" className="form-control" id="email" name="email" placeholder="Enter your email" required />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" id="password" name="password" placeholder="Enter your password" required />
          </div>
          <button type="submit" className="btn btn-primary">Login</button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
