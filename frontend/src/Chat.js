// frontend/src/pages/Chat.js
import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";

// Define the styles object with blue shades and layout adjustments
const styles = {
  container: {
    maxWidth: "800px",
    margin: "30px auto",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#f9fbfd", // Very light blue background
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  header: {
    color: "#0056b3", // Dark blue for header
    borderBottom: "2px solid #007bff", // Primary blue underline
    paddingBottom: "10px",
    marginBottom: "20px",
  },
  roomContainer: {
    marginBottom: "30px",
    border: "1px solid #cce0ff", // Light blue border
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.05)",
  },
  roomHeader: {
    margin: "0",
    padding: "10px 15px",
    backgroundColor: "#e6f2ff", // Light blue background for room title
    color: "#0056b3",
    borderBottom: "1px solid #cce0ff",
  },
  messageArea: {
    height: "250px",
    overflowY: "auto",
    padding: "15px",
    background: "#ffffff", // White background for message area
    display: "flex", // Use flex for easy column layout
    flexDirection: "column",
  },
  messageWrapper: {
    display: "flex",
    marginBottom: "10px",
  },
  messageBase: {
    padding: "10px 15px",
    borderRadius: "18px",
    maxWidth: "70%",
    wordWrap: "break-word",
    fontSize: "14px",
    display: "inline-block", // Allows the background color to wrap the content tightly
    position: "relative",
  },
  sentMessageWrapper: {
    justifyContent: "flex-end", // Push to the right
  },
  receivedMessageWrapper: {
    justifyContent: "flex-start", // Push to the left
  },
  sentMessage: {
    backgroundColor: "#007bff", // Primary blue for sent messages
    color: "white",
  },
  receivedMessage: {
    backgroundColor: "#e0e0e0", // Light grey for received messages
    color: "#333",
  },
  timestamp: {
    display: 'block',
    fontSize: '10px',
    opacity: 0.8,
    marginTop: '5px',
    textAlign: 'right',
    color: 'inherit', // Inherit color for contrast
  },
  inputArea: {
    marginTop: "0",
    padding: "15px",
    display: "flex",
    backgroundColor: "#f4f7f9", // Light blue-grey background for input
    borderTop: "1px solid #cce0ff",
  },
  input: {
    flex: 1,
    padding: "10px 15px",
    border: "1px solid #b3cde6",
    borderRadius: "20px",
    marginRight: "10px",
    fontSize: "14px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#007bff", // Primary blue button
    color: "white",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "background-color 0.3s ease",
  },
};

const socket = io("http://localhost:5000");

const Chat = () => {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  
  const messageEndRefs = useRef({}); 

  const [messages, setMessages] = useState({});
  const [newMsgs, setNewMsgs] = useState({});
  const [rooms, setRooms] = useState([]);

  // Function to scroll to the bottom of a specific chat room
  const scrollToBottom = (roomId) => {
    messageEndRefs.current[roomId]?.scrollIntoView({ behavior: "smooth" });
  };
  
  // Effect to scroll to the bottom whenever messages change for any room
  useEffect(() => {
      rooms.forEach(scrollToBottom);
  }, [messages, rooms]);


  // Join appointment rooms for this user
  useEffect(() => {
    socket.emit("joinAppointments", userId);

    socket.on("joinedRooms", async (joinedRooms) => {
      setRooms(joinedRooms);

      // Load old messages per room
      for (const roomId of joinedRooms) {
        try {
          const res = await axios.get(
            `http://localhost:5000/api/messages/${roomId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          setMessages((prev) => ({
            ...prev,
            [roomId]: res.data.map((m) => ({
              senderId: m.sender._id,
              message: m.message,
              timestamp: m.createdAt,
            })),
          }));
        } catch (err) {
          console.error("Error fetching messages:", err);
        }
      }
    });

    // Listen for incoming socket messages
    socket.on("message", (msg) => {
      setMessages((prev) => ({
        ...prev,
        [msg.appointmentId]: [
          ...(prev[msg.appointmentId] || []),
          {
            senderId: msg.senderId,
            message: msg.message,
            timestamp: msg.timestamp,
          },
        ],
      }));
    });

    return () => {
      socket.off("joinedRooms");
      socket.off("message");
    };
  }, [userId, token]);

  // Send message
  const sendMessage = (roomId) => {
    const text = newMsgs[roomId];
    if (!text?.trim()) return;

    socket.emit("chatMessage", {
      appointmentId: roomId,
      senderId: userId,
      message: text,
      // The server will typically add the timestamp, but we'll use a local one for immediate rendering
      timestamp: new Date().toISOString(), 
    });

    // Optimistically add the message to the local state right away
    setMessages((prev) => ({
        ...prev,
        [roomId]: [
            ...(prev[roomId] || []),
            {
                senderId: userId,
                message: text,
                timestamp: new Date().toISOString(),
            },
        ],
    }));

    setNewMsgs((prev) => ({ ...prev, [roomId]: "" }));
  };

  const handleKeyPress = (e, roomId) => {
    if (e.key === 'Enter') {
      sendMessage(roomId);
      e.preventDefault(); // Prevents newline in input if it was a textarea
    }
  };


  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Real-Time Chat 💬</h2>

      {rooms.length === 0 && <p>No active chat appointments found.</p>}

      {rooms.map((roomId) => {
        // Create a ref for each room's scroll anchor
        messageEndRefs.current[roomId] = messageEndRefs.current[roomId] || React.createRef();

        return (
          <div key={roomId} style={styles.roomContainer}>
            <h4 style={styles.roomHeader}>Appointment ID: {roomId}</h4>
            
            <div style={styles.messageArea}>
              {(messages[roomId] || []).map((m, idx) => {
                const isSent = m.senderId === userId;
                const wrapperStyle = isSent ? styles.sentMessageWrapper : styles.receivedMessageWrapper;
                const messageStyle = {
                  ...styles.messageBase,
                  ...(isSent ? styles.sentMessage : styles.receivedMessage),
                };
                const senderName = isSent
                  ? "You"
                  : (role === "therapist" ? "Patient" : "Therapist");
                  
                const timeString = new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });


                return (
                  <div key={idx} style={{ ...styles.messageWrapper, ...wrapperStyle }}>
                    <div style={messageStyle}>
                      <small style={{ display: 'block', fontWeight: 'bold', marginBottom: '3px', color: isSent ? 'white' : '#333' }}>
                        {senderName}
                      </small>
                      {m.message}
                      <span style={{ ...styles.timestamp, color: isSent ? 'rgba(255, 255, 255, 0.8)' : '#666' }}>
                          {timeString}
                      </span>
                    </div>
                  </div>
                );
              })}
              {/* This empty div is the scroll anchor */}
              <div ref={el => messageEndRefs.current[roomId] = el} />
            </div>

            <div style={styles.inputArea}>
              <input
                value={newMsgs[roomId] || ""}
                onChange={(e) =>
                  setNewMsgs((prev) => ({ ...prev, [roomId]: e.target.value }))
                }
                onKeyPress={(e) => handleKeyPress(e, roomId)}
                placeholder="Type your message here..."
                style={styles.input}
              />
              <button
                onClick={() => sendMessage(roomId)}
                style={styles.button}
                disabled={!newMsgs[roomId]?.trim()} // Disable send button if empty
              >
                Send
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Chat;