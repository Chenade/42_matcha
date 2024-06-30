import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './login.css';

export const PageForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset message
    setMessage('');

    // Here you would typically send the email to your server
    const response = await fetch('https://your-backend-endpoint/forget-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      setMessage('Password reset link has been sent to your email.');
    } else {
      const errorResponse = await response.json();
      setMessage(errorResponse.message || 'Failed to send reset link. Please try again.');
    }
  };

  return (
    <div className="container">
      <h2>Forget Password</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <button type="submit">Send Reset Link</button>
      </form>
      {message && <p className="message">{message}</p>}
      <div className="links">
        <Link to="/login">Back to Login</Link>
      </div>
    </div>
  );
};
