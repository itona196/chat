import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const socket = io("https://chat-6qhm.onrender.com");

function App() {
  const [msg, setMsg] = useState("");
  const [allMsgs, setAllMsgs] = useState([]);
  const [name, setName] = useState("");
  const [typing, setTyping] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    socket.on("welcome", (text) => {
      console.log(text);
    });

    socket.on("chatMessage", (data) => {
      setAllMsgs((prev) => [...prev, data]);
    });

    socket.on("typing", (data) => {
      setTyping(data);
      setTimeout(() => setTyping(null), 2000);
    });

    return () => {
      socket.off("welcome");
      socket.off("chatMessage");
      socket.off("typing");
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMsgs]);

  const handleSend = () => {
    if (!msg.trim() || !name.trim()) return;
    socket.emit("chatMessage", { username: name, message: msg });
    setMsg("");
  };

  const handleTyping = () => {
    socket.emit("typing", name);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  if (!name) {
    return (
      <div style={{ padding: 30, fontFamily: "Arial" }}>
        <h2>💬 Chat en temps réel</h2>
        <input
          placeholder="Entrez votre nom pour commencer"
          onBlur={(e) => setName(e.target.value.trim())}
          autoFocus
          style={{ padding: 8 }}
        />
      </div>
    );
  }

  return (
    <div style={{ padding: 30, fontFamily: "Arial" }}>
      <h2>💬 Chat en temps réel</h2>

      <div
        style={{
          border: "1px solid #ccc",
          height: 300,
          overflowY: "auto",
          padding: 10,
          marginBottom: 10,
          backgroundColor: "#f9f9f9",
          borderRadius: 6
        }}
      >
        {allMsgs.map((m, i) => (
          <div
            key={i}
            style={{
              marginBottom: 8,
              padding: 8,
              backgroundColor: m.username === name ? "#cce5ff" : "#e2e2e2",
              borderRadius: 10,
              maxWidth: "70%",
              alignSelf: m.username === name ? "flex-end" : "flex-start"
            }}
          >
            <strong>{m.username}</strong> : {m.message}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {typing && typing !== name && (
        <p style={{ fontStyle: "italic", color: "gray" }}>{typing} est en train d'écrire...</p>
      )}

      <div>
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={handleKeyDown}
          onKeyUp={handleTyping}
          placeholder="Votre message"
          style={{ padding: 8, width: "60%", marginRight: 10 }}
        />
        <button onClick={handleSend} style={{ padding: 8 }}>Envoyer</button>
      </div>
    </div>
  );
}

export default App;
