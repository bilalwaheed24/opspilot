import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API}/tasks`);
      const data = await res.json();
      setTasks(data.tasks || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const addTask = async () => {
    if (!title.trim()) return;
    setLoading(true);
    await fetch(`${API}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    setTitle("");
    await fetchTasks();
    setLoading(false);
  };

  const deleteTask = async (id) => {
    await fetch(`${API}/tasks/${id}`, { method: "DELETE" });
    await fetchTasks();
  };

  const toggleStatus = async (task) => {
    await fetch(`${API}/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: task.status === "pending" ? "completed" : "pending"
      }),
    });
    await fetchTasks();
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0f172a",
      color: "#e2e8f0",
      fontFamily: "system-ui, sans-serif",
      padding: "2rem"
    }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: "700",
          marginBottom: "0.25rem", color: "#38bdf8" }}>
          OpsPilot
        </h1>
        <p style={{ color: "#64748b", marginBottom: "2rem", fontSize: "0.9rem" }}>
          Task Management — Running on K3s
        </p>

        <div style={{ display: "flex", gap: "8px", marginBottom: "2rem" }}>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addTask()}
            placeholder="New task..."
            style={{
              flex: 1, padding: "10px 14px", borderRadius: "8px",
              border: "1px solid #334155", background: "#1e293b",
              color: "#e2e8f0", fontSize: "0.95rem", outline: "none"
            }}
          />
          <button onClick={addTask} disabled={loading}
            style={{
              padding: "10px 20px", borderRadius: "8px", border: "none",
              background: "#38bdf8", color: "#0f172a",
              fontWeight: "600", cursor: "pointer"
            }}>
            Add
          </button>
        </div>

        {tasks.length === 0 && (
          <p style={{ color: "#475569", textAlign: "center", marginTop: "3rem" }}>
            No tasks yet. Add one above.
          </p>
        )}

        {tasks.map(task => (
          <div key={task.id} style={{
            display: "flex", alignItems: "center", gap: "12px",
            padding: "12px 16px", background: "#1e293b",
            borderRadius: "8px", marginBottom: "8px",
            border: "1px solid #334155"
          }}>
            <input type="checkbox"
              checked={task.status === "completed"}
              onChange={() => toggleStatus(task)}
              style={{ width: "16px", height: "16px", cursor: "pointer" }}
            />
            <span style={{
              flex: 1,
              textDecoration: task.status === "completed" ? "line-through" : "none",
              color: task.status === "completed" ? "#475569" : "#e2e8f0"
            }}>
              {task.title}
            </span>
            <span style={{
              fontSize: "0.75rem", padding: "2px 8px", borderRadius: "999px",
              background: task.status === "completed" ? "#14532d" : "#1e3a5f",
              color: task.status === "completed" ? "#4ade80" : "#38bdf8"
            }}>
              {task.status}
            </span>
            <button onClick={() => deleteTask(task.id)}
              style={{ background: "none", border: "none",
                color: "#475569", cursor: "pointer", fontSize: "1.1rem" }}>
              ×
            </button>
          </div>
        ))}

        <div style={{
          marginTop: "2rem", padding: "12px 16px",
          background: "#1e293b", borderRadius: "8px",
          border: "1px solid #334155", fontSize: "0.8rem", color: "#475569"
        }}>
          {tasks.length} tasks · API: {API}
        </div>
      </div>
    </div>
  );
}