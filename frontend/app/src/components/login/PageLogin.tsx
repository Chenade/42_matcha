import React from "react";
import { Link } from 'react-router-dom';

import './login.css';

export const PageLogin = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevents the default form submission behavior
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      // Save the token in the local storage
      localStorage.setItem("token", data.token);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
            <label>
                Email:
                <input type="email" name="email" required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </label>
            <label>
                Password:
                <input type="password" name="password" required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </label>
            <button type="submit">Login</button>
        </form>
        <div className="links">
            <Link to="/register">New to here? Join now</Link>
            <Link to="/forgot-password">Forgot password?</Link>
        </div>
    </div>
  );
};

