//Group video call pending


import React, { useState, useEffect, useRef } from 'react';
import './ChatBox.css';
import SendIcon from '@mui/icons-material/Send';
import VideoCallIcon from "@mui/icons-material/VideoCall";
import { io } from 'socket.io-client';
import UserIcon from "../../assets/userprofile.jpg";
import VideoCall from '../VideoCall/VideoCall';
import { fetchAllUsers, fetchMessages } from '../../api';
import GroupModal from '../GroupModal/GroupModal';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import GroupsIcon from '@mui/icons-material/Groups';
import config from '../../../config';

const ChatBox = ({ isOpen, toggleChat, username, setDisconnectSocket }) => {

  const [allUsers, setAllUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const [chatHistories, setChatHistories] = useState({});
  const [inputMessage, setInputMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [groups, setGroups] = useState([]); // Store groups
  const [searchTerm, setSearchTerm] = useState('');
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showGroups, setShowGroups] = useState(true); // Toggle for showing groups
  const [showDirectMessages, setShowDirectMessages] = useState(true); // Toggle for showing DMs
  const [receiver, setReceiver] = useState('');
  const [callOffer, setCallOffer] = useState(null); // Store the incoming offer
  const [callState, setCallState] = useState("idle"); // idle, calling, receiving, inCall
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const peerConnection = useRef(null);
  const iceCandidateQueue = useRef([]); // Queue to store ICE candidates
  const [isScreenSharing, setIsScreenSharing] = useState(false);



  //----------------------------All users info---------------------------//



  useEffect(() => {
    const loadAllUsers = async () => {
      try {
        const users = await fetchAllUsers();
        const filteredUsers = users.filter((user) => user.username !== username); // Exclude current user
        setAllUsers(filteredUsers.map((user) => user.username));
      } catch (error) {
        console.error("Error loading all users:", error);
      }
    };

    loadAllUsers();
  }, [username]); // Make sure username is part of the dependencies



  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      // Prevent the default behavior (new line in input)
      e.preventDefault();

      // Call the send message function when Enter is pressed
      handleSendMessage();
    }
  };


  //-----------------------------------------------------------------------------------//





  // -------------------Direct messages and Group messages and Filtering-----------------//

  const toggleDirectMessages = () => {
    setShowDirectMessages((prev) => !prev); // Toggle the state
  };
  const toggleGroups = () => {
    setShowGroups((prev) => !prev); // Toggle the state
  };

  // Filter users based on the search term
  const filteredUsers = allUsers.filter((user) =>
    user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );



  //---------------------------------chat messages----------------//


  const handleSendMessage = () => {
    if (!receiver) {
      alert('Please select a receiver before sending a message!');
      return;
    }
    if (inputMessage.trim()) {
      const isGroup = groups.some((group) => group.name === receiver);
      const message = {
        sender: username,
        receiver,
        message: inputMessage,
        group: isGroup ? receiver : null, // Add group if this is a group message
      };

      // Emit the message to the backend
      socket.emit('send_message', message);

      // Save the message locally to the chat history
      setChatHistories((prevHistories) => {
        const chatKey = isGroup ? receiver : receiver; // For individual chats, use receiver's name
        return {
          ...prevHistories,
          [chatKey]: [...(prevHistories[chatKey] || []), message],
        };
      });

      // Clear the input field
      setInputMessage('');
    }
  };

  console.log("show chat histories", chatHistories);





  //----------------Chat history------------------------//





  // Load messages when the receiver (user or group) changes
  useEffect(() => {
    const loadMessages = async () => {
      try {
        if (receiver) {
          // Fetch messages for the selected receiver (user or group)
          const messages = await fetchMessages(receiver, null); // Pass the receiver and group (if any)
          setChatHistories((prevHistories) => ({
            ...prevHistories,
            [receiver]: messages, // Update the chat history for the selected receiver
          }));
        }
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    };

    loadMessages();
  }, [receiver]); // Trigger this effect whenever the receiver changes






  //----------------------------Group Creation--------------------//


  const handleCreateGroup = (group) => {
    // Add the creator (current user) to the group members
    const updatedGroup = { ...group, members: [...group.members, username] };
    setGroups((prev) => [...prev, updatedGroup]);

    // Notify the server about the new group
    socket.emit('create_group', {
      groupName: updatedGroup.name,
      members: updatedGroup.members,
    });

    console.log("Created a group:", updatedGroup);
  };


  useEffect(() => {
    if (socket) {
      socket.on('new_group', (group) => {
        console.log('New group received:', group);
        // Add the group to the state
        setGroups((prev) => {
          // Prevent duplicates
          if (prev.some((g) => g.name === group.groupName)) return prev;
          return [...prev, { name: group.groupName, members: group.members }];
        });
      });

      return () => {
        socket.off('new_group');
      };
    }
  }, [socket]);

  useEffect(() => {
    console.log('Updated groups:', groups);
  }, [groups]);



  //-----------------------Video calling using WEBRTC-------------------//



  const configuration = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
  };

  useEffect(() => {
    const socketIo = io(config.SOCKET_URL, {
      transports: ['websocket', 'polling'], // Use both WebSocket and polling as fallback
      secure: true, // Explicitly use secure connections
      reconnectionAttempts: 5, // Retry connection if it fails
    });

    setSocket(socketIo);

    if (socketIo) {
      if (username) {
        socketIo.emit('login', { username }); // Send the username to the backend
      }

      socketIo.on('user_online', (users) => {
        setOnlineUsers(users.filter((user) => user !== username));
      });

      socketIo.on('receive_message', (data) => {
        setChatHistories((prevHistories) => {
          // Determine the chat key: group name for group messages, sender for individual messages
          const chatKey = data.group || data.sender;

          return {
            ...prevHistories,
            [chatKey]: [...(prevHistories[chatKey] || []), data],
          };
        });
      });


      //Receive incoming call offer

      socketIo.on("incoming_call", ({ caller, offer }) => {
        setReceiver(caller);
        setCallState("receiving");
        setCallOffer(offer);
      });

      //Receive answer from receiver
      socketIo.on("receive_answer", async ({ answer }) => {
        if (peerConnection.current) {
          await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
          console.log("Remote description set on caller (answer):", answer);
        }
      });

      // Handle ICE candidates
      socketIo.on("ice-candidate", async (data) => {
        const { candidate } = data;

        if (candidate) {
          if (peerConnection.current?.remoteDescription) {
            await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
            console.log("Added ICE candidate:", candidate);
          } else {
            iceCandidateQueue.current.push(candidate);
            console.log("Queued ICE candidate:", candidate);
          }
        }
      });
    }

    return () => {
      socketIo.disconnect();
      setSocket(null);
    };
  }, [username]);

  const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };

  useEffect(() => {
    if (setDisconnectSocket) {
      setDisconnectSocket(() => disconnectSocket);
    }
  }, [setDisconnectSocket, socket]);




  useEffect(() => {
    const handleUnload = () => {
      if (socket) {
        console.log("Disconnecting socket on page unload...");
        socket.disconnect();
      }
    };

    // Add event listener for page unload
    window.addEventListener("beforeunload", handleUnload);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);



  useEffect(() => {
    if (socket) {
      // Listen for the call_ended event
      socket.on("call_ended", ({ from }) => {
        console.log(`Call ended by: ${from}`);

        // Reset the call state and UI
        setCallState("idle");
        setLocalStream(null);
        setRemoteStream(null);

        // Close peer connection
        if (peerConnection.current) {
          peerConnection.current.close();
          peerConnection.current = null;
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("call_ended");
      }
    };
  }, [socket]);




  //-------------------video call streaming---------------//



  const startLocalStream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    setLocalStream(stream);
    return stream;
  };

  const createPeerConnection = () => {
    const pc = new RTCPeerConnection(configuration);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", { candidate: event.candidate, to: receiver });
      }
    };

    pc.ontrack = (event) => {
      const [stream] = event.streams;
      setRemoteStream(stream);
    };

    return pc;
  };


  const handleStartCall = async () => {
    setCallState("calling");
    const stream = await startLocalStream();
    peerConnection.current = createPeerConnection();
    stream.getTracks().forEach((track) => peerConnection.current.addTrack(track, stream));
    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);
    socket.emit("start_call", { offer, receiver });
  };


  const handleAnswerCall = async () => {
    setCallState("inCall");
    const stream = await startLocalStream();
    peerConnection.current = createPeerConnection();
    stream.getTracks().forEach((track) => peerConnection.current.addTrack(track, stream));

    if (callOffer) {
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(callOffer));
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);

      socket.emit("answer_call", { to: receiver, answer });

      // Add queued ICE candidates
      while (iceCandidateQueue.current.length > 0) {
        const candidate = iceCandidateQueue.current.shift();
        await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    }
  };


  const handleEndCall = () => {
    setCallState("idle");
    setLocalStream(null);
    setRemoteStream(null);
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    // Notify the backend about the call end
    socket.emit('call_ended', { to: receiver });
  };






  const handleMuteToggle = () => {
    // Toggle microphone mute
    localStream.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));
  };

  const handleCameraToggle = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled; // Toggle the camera
      });
    } else {
      console.warn("Camera toggle attempted, but localStream is not initialized.");
      alert("Your camera is not available. Please check your permissions or start the call again.");
    }
  };




  //------------------------------------------------------------------------------//



  //-----------------------------------------screen sharing---------------------//

  const handleScreenShareToggle = async () => {
    if (!isScreenSharing) {
      try {
        // Capture screen
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });

        // Replace the current video track with the screen track
        const screenTrack = screenStream.getTracks()[0];

        // Replace track in PeerConnection
        const sender = peerConnection.current
          .getSenders()
          .find((s) => s.track.kind === "video");

        if (sender) {
          sender.replaceTrack(screenTrack);
        }

        // Update state
        setLocalStream(screenStream);
        setIsScreenSharing(true);

        // Handle stop sharing event
        screenTrack.onended = () => {
          handleStopScreenShare();
        };
      } catch (err) {
        console.error("Error sharing screen:", err);
      }
    } else {
      handleStopScreenShare();
    }
  };

  const handleStopScreenShare = async () => {
    // Get the original camera stream
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    const videoTrack = stream.getTracks().find((track) => track.kind === "video");

    // Replace the screen track with the camera track
    const sender = peerConnection.current
      .getSenders()
      .find((s) => s.track.kind === "video");

    if (sender) {
      sender.replaceTrack(videoTrack);
    }

    // Update state
    setLocalStream(stream);
    setIsScreenSharing(false);
  };



  //--------------------------------------------------------------------------------------------------------




  return (
    isOpen && (
      <div className="chatbox">
        <div className="chatbox-container">
          {/* Online Users */}
          <div className="online-users">
            <div className="onlineuser">
              <h4>Online Users</h4>
            </div>
            <div className="onlineusers" >
              <div className="searchuser" >

                <div className="searchuser-input-container">
                  <span className="search-icon"> <SearchIcon /> </span> {/* Replace with a proper icon library if needed */}
                  <input
                    placeholder="Search user"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <button className="create-group-button" onClick={() => setShowGroupModal(true)}>
                  <GroupAddIcon />
                </button>
              </div>
              <div className="direct-messages-section" style={{
                height: showDirectMessages ? "calc(100% - 55%)" : "8%",
                transition: "height 0.3s ease",
              }}>
                <div className="section-header">
                  <h4>Direct Messages</h4>
                  <button className="toggle-button" onClick={toggleDirectMessages}>
                    {showDirectMessages ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                  </button>
                </div>

                {showDirectMessages && (



                  <ul>
                    {filteredUsers.map((user, index) => {
                      const isOnline = onlineUsers.includes(user);
                      return (
                        <li
                          key={index}
                          className={`user-item ${receiver === user ? 'selected' : ''}`}
                          onClick={() => setReceiver(user)}
                        >
                          <span className={`status-dot ${isOnline ? 'online' : 'offline'}`}></span>
                          <img src={UserIcon} alt={`${user}'s avatar`} className="user-avatar" />
                          {user}
                        </li>
                      );
                    })}
                  </ul>

                )}
              </div>

              <div className="groups-section" style={{
                height: showGroups ? "calc(100% - 55%)" : "8%",
                transition: "height 0.3s ease",
              }}>
                <div className="section-header">
                  <h4>Groups</h4>
                  <button className="toggle-button" onClick={toggleGroups}>
                    {showGroups ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                  </button>
                </div>

                {showGroups && (
                  <ul>
                    {filteredGroups.map((group, index) => (
                      <li
                        key={index}
                        className={`group-item ${receiver === group.name ? 'selected' : ''}`}
                        onClick={() => setReceiver(group.name)}
                      >

                        <GroupsIcon className="group-avatar" />

                        {group.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>




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
                  <button
                    className="video-call-button"
                    onClick={handleStartCall}
                    disabled={callState !== "idle"}
                  >
                    <VideoCallIcon />
                  </button>
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
                  {(chatHistories[receiver] || [])
                    .filter((message) => {
                      const isGroupChat = groups.some((group) => group.name === receiver);
                      if (isGroupChat) {
                        return message.group === receiver; // Show group messages for this group
                      }
                      return !message.group && (message.sender === username || message.sender === receiver); // Show messages for individual chats
                    })
                    .map((message, index) => (
                      <div
                        key={index}
                        className={`message ${message.sender === username ? 'self' : 'other'}`}
                      >
                        {message.sender !== username && (
                          <span className="message-sender" style={{border:"1px solid red"}}>
                            {message.sender}{' '}
                            {/* {message.group ? `(in ${message.group})` : ''} */}
                          </span>
                        )}
                        <p className="message-content" style={{border:"1px solid red"}}>{message.message}</p>
                      </div>
                    ))}
                </div>


              ) : (
                <div className="placeholder">
                  <p>Select a user or group to start chatting.</p>
                </div>
              )}
            </div>

            <div className="chatbox-footer">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown} // Add the event listener for Enter key
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
        {callState === "calling" || callState === "inCall" || callState === "receiving" ? (
          <VideoCall
            localStream={localStream}
            remoteStream={remoteStream}
            callState={callState}
            onEndCall={handleEndCall}
            onMuteToggle={handleMuteToggle}
            onCameraToggle={handleCameraToggle}
            onAnswerCall={handleAnswerCall}
            onRejectCall={handleEndCall}  // for now just ending the call on rejecting the call.
            receiver={receiver}
            onScreenShareToggle={handleScreenShareToggle} // Add this
            isScreenSharing={isScreenSharing} // Add this
            localUserName={username} // Pass the current user's username
            remoteUserName={receiver}

          />
        ) : null}



        {showGroupModal && (
          <GroupModal
            allUsers={allUsers}
            onlineUsers={onlineUsers}
            onClose={() => setShowGroupModal(false)}
            onCreateGroup={handleCreateGroup}
          />
        )}



      </div>
    )
  );
};

export default ChatBox;







