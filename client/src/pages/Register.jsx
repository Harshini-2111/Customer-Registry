import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await register(
        form.name,
        form.email,
        form.password,
        form.role
      );

      if (data.role === "agent" || data.role === "admin") {
        navigate("/agent-dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.log("Error:", err);
      console.log("Response:", err.response);
      console.log("Data:", err.response?.data);
      console.log("Status:", err.response?.status);

      setError(err.response?.data?.message || err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Register</h2>

        {error && <p className="error-text">{error}</p>}

        <label>Full Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          minLength={6}
          required
        />

        <label>Account Type</label>
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
        >
          <option value="user">Customer</option>
          <option value="agent">Support Agent</option>
        </select>

        <button
          type="submit"
          className="btn primary"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}