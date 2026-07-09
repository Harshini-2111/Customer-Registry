import { useEffect, useState } from "react";
import api from "../api/axios";
import ChatBox from "../components/ChatBox";

const statusColors = {
  Open: "badge-blue",
  "In Progress": "badge-yellow",
  Resolved: "badge-green",
  Closed: "badge-gray",
};

export default function AgentDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState(null);
  const [filter, setFilter] = useState("All");

  const load = async () => {
    try {
      const { data } = await api.get("/complaints");
      setComplaints(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load complaints");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const { data } = await api.put(`/complaints/${id}`, { status });
      setComplaints((prev) => prev.map((c) => (c._id === id ? { ...c, ...data } : c)));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update complaint");
    }
  };

  const filtered =
    filter === "All" ? complaints : complaints.filter((c) => c.status === filter);

  return (
    <div className="page">
      <div className="dashboard-header">
        <h2>Agent Dashboard</h2>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option>All</option>
          <option>Open</option>
          <option>In Progress</option>
          <option>Resolved</option>
          <option>Closed</option>
        </select>
      </div>

      {error && <p className="error-text">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : filtered.length === 0 ? (
        <p>No complaints found for this filter.</p>
      ) : (
        <div className="complaint-list">
          {filtered.map((c) => (
            <div key={c._id} className="card complaint-card">
              <div className="complaint-card-top">
                <h3>{c.subject}</h3>
                <span className={`badge ${statusColors[c.status]}`}>{c.status}</span>
              </div>
              <p className="complaint-meta">
                From: {c.user?.name} ({c.user?.email}) • {c.category} • Priority:{" "}
                {c.priority}
              </p>
              <p>{c.description}</p>

              <div className="agent-actions">
                <label>Update Status:</label>
                <select
                  value={c.status}
                  onChange={(e) => handleStatusChange(c._id, e.target.value)}
                >
                  <option>Open</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                  <option>Closed</option>
                </select>
                <button
                  className="btn secondary"
                  onClick={() => setActiveChat(c._id === activeChat ? null : c._id)}
                >
                  {activeChat === c._id ? "Hide Chat" : "Chat with Customer"}
                </button>
              </div>

              {activeChat === c._id && (
                <ChatBox complaintId={c._id} onClose={() => setActiveChat(null)} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
