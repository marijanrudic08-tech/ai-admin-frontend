import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chat`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: input }),
        }
      );

      const data = await res.json();
      const botMessage = { role: "assistant", content: data.reply };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Greška:", error);
      const errorMessage = {
        role: "assistant",
        content: "⚠️ Došlo je do greške. Provjeri backend.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", fontFamily: "Arial" }}>
      <h1>AI Admin Chat</h1>
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "10px",
          height: "400px",
          overflowY: "auto",
          marginBottom: "10px",
          backgroundColor: "#fafafa",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              margin: "8px 0",
              textAlign: msg.role === "user" ? "right" : "left",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: "12px",
                background: msg.role === "user" ? "#0070f3" : "#eaeaea",
                color: msg.role === "user" ? "#fff" : "#000",
              }}
            >
              {msg.content}
            </span>
          </div>
        ))}
        {loading && <p>⏳ Loading...</p>}
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Napiši poruku..."
          style={{ flex: 1, padding: "8px" }}
        />
        <button onClick={sendMessage} disabled={loading}>
          Pošalji
        </button>
        <button onClick={clearChat}>Obriši</button>
      </div>
    </div>
  );
}