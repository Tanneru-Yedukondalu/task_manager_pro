import React from "react";

import "./VideoCall.css";

const VideoCall = ({
    localStream,
    remoteStream,
    callState,
    onEndCall,
    onMuteToggle,
    onCameraToggle,
    onAnswerCall,
    onRejectCall,
    receiver,
  }) => {
    return (
      <div className="video-call-overlay">
        <div className="video-call-container">
          {/* Incoming Call UI */}
          {callState === "receiving" && (
            <div className="incoming-call">
              <h3>{receiver} is calling you...</h3>
              <div className="incoming-call-buttons">
                <button onClick={onAnswerCall} className="accept-button">
                  Answer
                </button>
                <button onClick={onRejectCall} className="reject-button">
                  Reject
                </button>
              </div>
            </div>
          )}
  
          {/* Remote Video */}
          {callState === "calling" || callState === "inCall" ? (
            <div className="video-wrapper remote-video-wrapper">
              <h4 className="video-title">Remote Video</h4>
              {remoteStream ? (
                <video
                  className="video remote-video"
                  autoPlay
                  playsInline
                  ref={(video) => {
                    if (video && video.srcObject !== remoteStream) {
                      video.srcObject = remoteStream; // Ensure proper binding
                    }
                  }}
                />
              ) : (
                <div className="video-placeholder">Waiting for remote video...</div>
              )}
            </div>
          ) : null}
  
          {/* Local Video */}
          {callState === "calling" || callState === "inCall" ? (
            <div className="video-wrapper local-video-wrapper">
              <h4 className="video-title">Your Video</h4>
              {localStream ? (
                <video
                  className="video local-video"
                  autoPlay
                  playsInline
                  muted
                  ref={(video) => {
                    if (video && video.srcObject !== localStream) {
                      video.srcObject = localStream; // Ensure proper binding
                    }
                  }}
                />
              ) : (
                <div className="video-placeholder">Starting video...</div>
              )}
            </div>
          ) : null}
  
          {/* Video Call Controls */}
          {callState === "calling" || callState === "inCall" ? (
            <div className="video-controls">
              <button className="control-button mute-button" onClick={onMuteToggle}>
                Mute/Unmute
              </button>
              <button className="control-button camera-button" onClick={onCameraToggle}>
                Toggle Camera
              </button>
              <button className="control-button end-call-button" onClick={onEndCall}>
                End Call
              </button>
            </div>
          ) : null}
        </div>
      </div>
    );
  };
  
  export default VideoCall;
  