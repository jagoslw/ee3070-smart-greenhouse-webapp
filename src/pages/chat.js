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
  getDocs,       // Added for fetching all docs to delete
  writeBatch,    // Added for efficient deletion
  doc            // Added for referencing docs
} from "firebase/firestore";
import "./chat.css";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  // 1. Listen for Chat History
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
      setMessages(msgs);
      
      const lastMsg = msgs[msgs.length - 1];
      if (lastMsg && lastMsg.role === "user" && !lastMsg.replied) {
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

  // 2. Clear History Function
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
      console.log("Chat history cleared!");
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
        {/* NEW: Clear History Button */}
        <button className="clear-chat-btn" onClick={clearHistory}>
          🗑️ Clear
        </button>
      </div>

      <div className="chat-window">
        {messages.map((msg) => (
          <div key={msg.id} className={`message-wrapper ${msg.role}`}>
            <div className="message-bubble">
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