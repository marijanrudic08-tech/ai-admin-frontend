import { useState, useEffect } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Učitavanje povijesti iz localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Spremanje u localStorage
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { role: "user", content: input };
    setMessages([...messages, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const aiMessage = { role: "assistant", content: data.text };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("Greška:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔴 Funkcija za brisanje chata
  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem("chatMessages");
  };

  return (
    <div className="flex flex-col h-screen p-4">
      <div className="flex-1 overflow-y-auto border rounded p-3 mb-3 bg-gray-50">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 my-1 rounded ${
              msg.role === "user" ? "bg-blue-100 text-right" : "bg-green-100 text-left"
            }`}
          >
            {msg.content}
          </div>
        ))}
        {loading && <div className="italic text-gray-500">AI piše...</div>}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 border p-2 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Napiši poruku..."
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={sendMessage}
        >
          Pošalji
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={clearChat}
        >
          Obriši
        </button>
      </div>
    </div>
  );
}