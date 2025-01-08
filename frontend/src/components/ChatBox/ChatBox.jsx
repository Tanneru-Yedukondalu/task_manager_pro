import React, { useState, useEffect } from 'react';
import './ChatBox.css';
import SendIcon from '@mui/icons-material/Send';
import { io } from 'socket.io-client';
import UserIcon from "../../assets/userprofile.jpg";

const ChatBox = ({ isOpen, toggleChat, username }) => {
  const [socket, setSocket] = useState(null);
  const [chatHistories, setChatHistories] = useState({});
  const [inputMessage, setInputMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [receiver, setReceiver] = useState('');

  useEffect(() => {
    const socketIo = io('http://localhost:5000'); // Connect to Flask-SocketIO server
    setSocket(socketIo);

    if (username) {
      socketIo.emit('login', { username }); // Send the username to the backend
    }

    socketIo.on('user_online', (users) => {
      setOnlineUsers(users.filter((user) => user !== username)); // Exclude current user
    });

    socketIo.on('receive_message', (data) => {
      setChatHistories((prevHistories) => ({
        ...prevHistories,
        [data.sender]: [...(prevHistories[data.sender] || []), data],
      }));
    });

    return () => {
      socketIo.disconnect();
    };
  }, [username]);

  const handleSendMessage = () => {
    if (!receiver) {
      alert('Please select a receiver before sending a message!');
      return;
    }
    if (inputMessage.trim()) {
      const message = { sender: username, receiver, message: inputMessage };

      // Emit the message to the backend
      socket.emit('send_message', message);

      // Save message to chat history
      setChatHistories((prevHistories) => ({
        ...prevHistories,
        [receiver]: [...(prevHistories[receiver] || []), message],
      }));

      setInputMessage('');
    }
  };

  return (
    isOpen && (
      <div className="chatbox">
        <div className="chatbox-container">
          {/* Online Users */}
          <div className="online-users">
            <div className="onlineuser">
              <h4>Online Users</h4>
            </div>
            <div className="onlineusers">
              <ul>
                {onlineUsers.map((user, index) => (
                  <li
                    key={index}
                    className={`user-item ${receiver === user ? 'selected' : ''}`}
                    onClick={() => setReceiver(user)}
                  >
                    <span className="online-dot"></span>
                    <img
                      src={UserIcon}
                      alt={`${user}'s avatar`}
                      className="user-avatar"
                    />
                    {user}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="chatbox-content">
            <div className="chatbox-header">
              {receiver ? (
                <>
                  <img
                    src={UserIcon}
                    alt={`${receiver}'s avatar`}
                    className="header-avatar"
                  />
                  <h3>Chat with {receiver}</h3>
                </>
              ) : (
                <h3>Start a conversation</h3>
              )}
              <button className="chatbox-close" onClick={toggleChat}>
                &times;
              </button>
            </div>
            <div className="chatbox-body">
              {receiver ? (
                <div className="messages">
                  {(chatHistories[receiver] || []).map((message, index) => (
                    <div
                      key={index}
                      className={`message ${
                        message.sender === username ? 'self' : 'other'
                      }`}
                    >
                      {message.sender !== username && (
                        <span className="message-sender">{message.sender}</span>
                      )}
                      <p className="message-content">{message.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="placeholder">
                  <p>Select a user to start chatting.</p>
                </div>
              )}
            </div>
            <div className="chatbox-footer">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type a message..."
                className="message-input"
                disabled={!receiver} // Disable input if no user is selected
              />
              <button
                onClick={handleSendMessage}
                className="send-button"
                title="Send Message"
                disabled={!receiver} // Disable button if no user is selected
              >
                <SendIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default ChatBox;
