import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://192.168.101.21:3000");

function App() {
  const [msg, setMsg] = useState("");
  const [allMsgs, setAllMsgs] = useState([]);
  const [name, setName] = useState("");
  const [greet, setGreet] = useState("");

  useEffect(() => {
    socket.on("welcome", (text) => {
      setGreet(text);
    });

    socket.on("chatMessage", (data) => {
      setAllMsgs((prev) => prev.concat(data));
    });

    return () => {
      socket.off("welcome");
      socket.off("chatMessage");
    };
  }, []);

  const handleSend = () => {
    if (!name || !msg.trim()) return;
    socket.emit("chatMessage", { username: name, message: msg });
    setMsg("");
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>{greet}</h1>

      {!name && (
        <input
          placeholder="Username"
          onBlur={(e) => setName(e.target.value.trim())}
        />
      )}

      <div style={{ marginTop: 25 }}>
        {allMsgs.map((m, i) => (
          <p key={i}>
            <b>{m.username}</b>: {m.message}
          </p>
        ))}
      </div>

      <input
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}

export default App;
