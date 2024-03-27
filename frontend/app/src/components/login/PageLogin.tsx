import React from "react";

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
    <div>
        <form onSubmit={handleLogin}>
        <div>
            <label>
            Enter your email:
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            </label>
        </div>
        <div>
            <label>
            Enter your password:
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            </label>
        </div>
        <button type="submit">Click Me!</button>
        </form>
    </div>
  );
};