import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        Customer Care Registry
      </Link>
      <div className="nav-links">
        <Link to="/">Home</Link>
        {user && user.role === "user" && (
          <>
            <Link to="/complaints">Lodge Complaint</Link>
            <Link to="/my-complaints">My Complaints</Link>
          </>
        )}
        {user && (user.role === "agent" || user.role === "admin") && (
          <Link to="/agent-dashboard">Agent Dashboard</Link>
        )}
        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
        {user && (
          <button className="link-btn" onClick={handleLogout}>
            Logout ({user.name})
          </button>
        )}
      </div>
    </nav>
  );
}
