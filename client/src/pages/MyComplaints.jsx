import { useEffect, useState } from "react";
import api from "../api/axios";
import ChatBox from "../components/ChatBox";

const statusColors = {
  Open: "badge-blue",
  "In Progress": "badge-yellow",
  Resolved: "badge-green",
  Closed: "badge-gray",
};

export default function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/complaints/my");
        setComplaints(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load complaints");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="page">
      <h2>My Complaints</h2>
      {error && <p className="error-text">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : complaints.length === 0 ? (
        <p>You haven't lodged any complaints yet.</p>
      ) : (
        <div className="complaint-list">
          {complaints.map((c) => (
            <div key={c._id} className="card complaint-card">
              <div className="complaint-card-top">
                <h3>{c.subject}</h3>
                <span className={`badge ${statusColors[c.status]}`}>{c.status}</span>
              </div>
              <p className="complaint-meta">
                {c.category} • Priority: {c.priority} •{" "}
                {new Date(c.createdAt).toLocaleDateString()}
              </p>
              <p>{c.description}</p>
              <button
                className="btn secondary"
                onClick={() => setActiveChat(c._id === activeChat ? null : c._id)}
              >
                {activeChat === c._id ? "Hide Chat" : "Open Chat"}
              </button>
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
