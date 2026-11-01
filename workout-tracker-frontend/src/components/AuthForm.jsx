import { useState } from "react";
export default function AuthForm({ onLoginSuccess }) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const endpoint = isLoginMode
      ? "http://localhost:5000/api/auth/login"
      : "http://localhost:5000/api/auth/register";
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      onLoginSuccess(data.token, data.user);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>{isLoginMode ? "Login to Workout Tracker" : "Create an Account"}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        {!isLoginMode && (
          <div>
            <label>Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
        )}

        <div>
          <label>Email</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            required
            minLength="6"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </div>

        <button type="submit">{isLoginMode ? "Login" : "Sign Up"}</button>
      </form>

      <p>
        {isLoginMode ? "Don't have an account?" : "Already have an account?"}
        <button
          type="button"
          onClick={() => {
            setIsLoginMode(!isLoginMode);
            setError("");
          }}
        >
          {isLoginMode ? "Sign Up" : "Login"}
        </button>
      </p>
    </div>
  );
}
