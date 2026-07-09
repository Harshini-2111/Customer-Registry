import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="page home-page">
      <div className="hero">
        <h1>Welcome to the Customer Care Registry</h1>
        <p>
          A centralized system to log, track, and resolve customer complaints
          efficiently — helping teams spot trends and deliver faster, more
          consistent support.
        </p>
        {!user && (
          <div className="hero-actions">
            <Link to="/register" className="btn primary">
              Get Started
            </Link>
            <Link to="/login" className="btn secondary">
              Login
            </Link>
          </div>
        )}
        {user && user.role === "user" && (
          <div className="hero-actions">
            <Link to="/complaints" className="btn primary">
              Lodge a Complaint
            </Link>
            <Link to="/my-complaints" className="btn secondary">
              View My Complaints
            </Link>
          </div>
        )}
        {user && (user.role === "agent" || user.role === "admin") && (
          <div className="hero-actions">
            <Link to="/agent-dashboard" className="btn primary">
              Go to Agent Dashboard
            </Link>
          </div>
        )}
      </div>

      <div className="features">
        <div className="feature-card">
          <h3>Track Every Issue</h3>
          <p>Maintain a full history of every customer interaction in one place.</p>
        </div>
        <div className="feature-card">
          <h3>Faster Resolution</h3>
          <p>Agents can prioritize, assign, and chat with customers in real time.</p>
        </div>
        <div className="feature-card">
          <h3>Data-Driven Insights</h3>
          <p>Spot recurring pain points and improve service quality over time.</p>
        </div>
      </div>
    </div>
  );
}
