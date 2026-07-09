import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:8000";

export default function ChatBox({ complaintId, onClose }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const { data } = await api.get(`/messages/${complaintId}`);
        setMessages(data);
      } catch (err) {
        console.error(err);
      }
    };
    loadMessages();

    socketRef.current = io(SOCKET_URL);
    socketRef.current.emit("joinRoom", complaintId);
    socketRef.current.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [complaintId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      const { data } = await api.post(`/messages/${complaintId}`, { text });
      socketRef.current.emit("sendMessage", { complaintId, message: data });
      setMessages((prev) => [...prev, data]);
      setText("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="chatbox">
      <div className="chatbox-header">
        <h4>Complaint Chat</h4>
        {onClose && (
          <button className="link-btn" onClick={onClose}>
            Close
          </button>
        )}
      </div>
      <div className="chatbox-messages">
        {messages.map((m) => (
          <div
            key={m._id}
            className={`chat-message ${m.sender?._id === user._id ? "own" : "other"}`}
          >
            <span className="chat-sender">{m.sender?.name || "Unknown"}</span>
            <p>{m.text}</p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form className="chatbox-input" onSubmit={handleSend}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit" className="btn primary">
          Send
        </button>
      </form>
    </div>
  );
}
