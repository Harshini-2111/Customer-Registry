import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Complaints() {
  const [form, setForm] = useState({
    subject: "",
    category: "Other",
    description: "",
    priority: "Medium",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      await api.post("/complaints", form);
      setMessage("Complaint lodged successfully!");
      setTimeout(() => navigate("/my-complaints"), 900);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to lodge complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="card form-card">
        <h2>Lodge a Complaint</h2>
        {error && <p className="error-text">{error}</p>}
        {message && <p className="success-text">{message}</p>}
        <form onSubmit={handleSubmit}>
          <label>Subject</label>
          <input name="subject" value={form.subject} onChange={handleChange} required />

          <label>Category</label>
          <select name="category" value={form.category} onChange={handleChange}>
            <option>Billing</option>
            <option>Technical</option>
            <option>Delivery</option>
            <option>Product Quality</option>
            <option>Other</option>
          </select>

          <label>Priority</label>
          <select name="priority" value={form.priority} onChange={handleChange}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          <label>Description</label>
          <textarea
            name="description"
            rows={5}
            value={form.description}
            onChange={handleChange}
            required
          />

          <button type="submit" className="btn primary" disabled={loading}>
            {loading ? "Submitting..." : "Submit Complaint"}
          </button>
        </form>
      </div>
    </div>
  );
}
