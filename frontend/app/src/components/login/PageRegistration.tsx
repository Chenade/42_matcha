// The app must allow a user to register by requesting at least their
// - email address
// - username,
// - last name
// - first name
// - a password that is somehow protected.

import React from "react";
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import './login.css';

// After registration, an
// email with a unique link must be sent to the registered user to verify their account.

// The user must be able to login using their username and password, and also receive
// an email allowing them to reset their password if they forget it. Additionally, the user
// must be able to log out with just one click from any page on the site.

const validatePassword = (password: string) => {
    const errors = [];
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long.');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character.');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter.');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter.');
    }
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number.');
    }
    return errors;
};

export const PageRegistration = () => {
      const [email, setEmail] = React.useState('');
      const [username, setUsername] = React.useState('');
      const [firstName, setFirstName] = React.useState('');
      const [lastName, setLastName] = React.useState('');
      const [password, setPassword] = React.useState('');
      const [showPassword, setShowPassword] = React.useState(false);
      const [errors, setErrors] = React.useState<string[]>([]);
    
      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const passwordErrors = validatePassword(password);

        if (passwordErrors.length > 0) {
          setErrors(passwordErrors);
          return;
        }
    
        setErrors([]);

        const response = await fetch('http://localhost:3000/sign-up', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            username: username,
            first_name: firstName,
            last_name: lastName,
            password: password, // hash the password on the server side
          }),
        });
    
        if (response.ok) {
          alert('Registration successful! Please check your email to verify your account.');
          // Redirect the user to the login page
            window.location.href = '/login';
        } else {
          const errorResponse = await response.json();
          setErrors([errorResponse.message || 'Registration failed. Please try again.']);
        }
      };
    
      return (
        <div className="container">
          <h2>Sign Up</h2>
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
            <label>
              Username:
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </label>
            <label>
              First Name:
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </label>
            <label>
              Last Name:
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </label>
            <label>
                Password:
                <div className="password-input-container">
                    <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    />
                    {password.length > 0 && <span
                        className="toggle-password-visibility"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>}
                </div>
            </label>
            {errors.length > 0 && (
                <div className="errors">
                    {errors.map((error, index) => (
                    <p key={index} className="error">
                        {error}
                    </p>
                    ))}
                </div>
            )}
            <button type="submit">Register</button>
          </form>
          <div className="links">
            <Link to="/login">Already have an account? Login</Link>
          </div>
        </div>
      );
}