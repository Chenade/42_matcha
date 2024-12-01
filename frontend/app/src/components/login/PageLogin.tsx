import React from "react";
import { Link } from 'react-router-dom';

import './login.css';

export const PageLogin = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevents the default form submission behavior
   await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: email, password: password }),
        }).then((response) => {
            if (!response.ok) {
                setErrors("Login failed. Please check your email and password.");
                return;
            }
            const token = response.headers.get('Authorization');
            localStorage.setItem("token", token || "");
            window.location.href = "/";
        }).catch((error) => {
            console.log('Error:', error);
        });
    };

    const [error, setErrors] = React.useState<string>();

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
            <div className="errors">
                    <p className="error">
                        {error}
                    </p>
            </div>
            <button type="submit">Login</button>
        </form>
        <div className="links">
            <Link to="/register">New to here? Join now</Link>
            <Link to="/forgot-password">Forgot password?</Link>
        </div>
    </div>
  );
};

