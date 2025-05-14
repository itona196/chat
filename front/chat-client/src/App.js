import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import "./App.css";

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

<<<<<<< HEAD
    socket.on("loadMessages", (messages) => {
      setAllMsgs(messages);
    });

=======
>>>>>>> f5c80b0f1468ad24cffa279820b498ad1c3cdeb6
    return () => {
      socket.off("welcome");
      socket.off("chatMessage");
      socket.off("typing");
<<<<<<< HEAD
      socket.off("loadMessages");
=======
>>>>>>> f5c80b0f1468ad24cffa279820b498ad1c3cdeb6
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
    if (name.trim()) {
      socket.emit("typing", name);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  if (!name) {
    return (
      <div className="container">
        <h2>💬 Chat en temps réel</h2>
        <input
          placeholder="Entrez votre nom pour commencer"
          onBlur={(e) => {
            const entered = e.target.value.trim();
            if (entered) {
              setName(entered);
              socket.emit("newUser", entered);
            }
          }}
          autoFocus
          className="username-input"
        />
      </div>
    );
  }

  return (
    <div className="container">
      <h2>💬 Chat en temps réel</h2>

      <div className="chat-box">
        {allMsgs.map((m, i) => (
          <div
            key={i}
            className={`chat-bubble ${m.username === name ? "own" : "other"}`}
          >
            <strong>{m.username}</strong> : {m.message}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {typing && typing !== name && (
        <p className="typing-indicator">{typing} est en train d'écrire...</p>
      )}

      <div className="input-group">
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={handleKeyDown}
          onKeyUp={handleTyping}
          placeholder="Votre message"
          className="message-input"
        />
        <button onClick={handleSend} className="send-button">Envoyer</button>
      </div>
    </div>
  );
}

export default App;
