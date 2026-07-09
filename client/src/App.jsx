import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Complaints from "./pages/Complaints";
import MyComplaints from "./pages/MyComplaints";
import AgentDashboard from "./pages/AgentDashboard";

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/complaints"
            element={
              <ProtectedRoute roles={["user"]}>
                <Complaints />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-complaints"
            element={
              <ProtectedRoute roles={["user"]}>
                <MyComplaints />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agent-dashboard"
            element={
              <ProtectedRoute roles={["agent", "admin"]}>
                <AgentDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </>
  );
}
