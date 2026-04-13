import React, { useState, useEffect, useRef } from "react";
import { db } from "../components/firebase";
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limitToLast, 
  onSnapshot, 
  serverTimestamp,
  getDocs,
  writeBatch,
  doc
} from "firebase/firestore";
import "./chat.css";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  // Request notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, "Chat"), 
      orderBy("timestamp", "asc"),
      limitToLast(20) 
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // --- ALARM DETECTION & NOTIFICATION ---
      const latestMsg = msgs[msgs.length - 1];
      if (latestMsg && latestMsg.isAlarm && latestMsg.role === "ai") {
        if (Notification.permission === "granted") {
          new Notification("Greenhouse Alarm!", {
            body: latestMsg.text,
            icon: "/alarm-icon.png" // Optional: add an icon path
          });
        }
      }

      setMessages(msgs);
      
      if (latestMsg && latestMsg.role === "user" && !latestMsg.replied) {
        setIsTyping(true);
      } else {
        setIsTyping(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const clearHistory = async () => {
    if (!window.confirm("Are you sure you want to delete all chat history?")) return;
    try {
      const chatRef = collection(db, "Chat");
      const snapshot = await getDocs(chatRef);
      const batch = writeBatch(db);
      snapshot.docs.forEach((document) => {
        batch.delete(doc(db, "Chat", document.id));
      });
      await batch.commit();
    } catch (err) {
      console.error("Error clearing history:", err);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = input;
    setInput("");
    try {
      await addDoc(collection(db, "Chat"), {
        role: "user",
        text: userMsg,
        replied: false,
        timestamp: serverTimestamp()
      });
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="header-left">
          <h2>Ollama Intelligence</h2>
          <div className="status-indicator">
            <span className="dot"></span> Local AI Online
          </div>
        </div>
        <button className="clear-chat-btn" onClick={clearHistory}>🗑️ Clear</button>
      </div>

      <div className="chat-window">
        {messages.map((msg) => (
          <div key={msg.id} className={`message-wrapper ${msg.role}`}>
            {/* Added conditional 'alarm-highlight' class */}
            <div className={`message-bubble ${msg.isAlarm ? 'alarm-highlight' : ''}`}>
              {msg.text && <div className="text-content">{msg.text}</div>}
              {msg.image && (
                <div className="image-content">
                  <img 
                    alt="Greenhouse Visual" 
                    className="chat-embedded-img" 
                    src={msg.image.startsWith('data:image') ? msg.image : `data:image/jpeg;base64,${msg.image}`} 
                  />
                </div>
              )}
              <span className="message-time">
                {msg.timestamp 
                  ? msg.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                  : "Sending..."}
              </span>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="message-wrapper ai">
            <div className="message-bubble typing">
              Ollama is thinking<span>.</span><span>.</span><span>.</span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <form className="chat-input-area" onSubmit={sendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about greenhouse vitals..."
        />
        <button type="submit">SEND</button>
      </form>
    </div>
  );
}

export default Chat;