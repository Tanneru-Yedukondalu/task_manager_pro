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
  onScreenShareToggle,
  isScreenSharing

}) => {
  return (
    <div className="video-call-overlay">
      <div className="video-call-container">
        {/* Incoming Call UI */}
        {callState === "receiving" && (
          <div className="incoming-call">
            <h3>Incoming call...</h3>
            <button onClick={onAnswerCall} className="accept-button">Answer</button>
            <button onClick={onRejectCall} className="reject-button">Reject</button>
          </div>
        )}

        {/* Video Layout */}
        {(callState === "calling" || callState === "inCall") && (
          <div className="video-wrapper">
            <h4>Remote Video</h4>
            {remoteStream ? (
              <video className="video remote-video" autoPlay playsInline ref={video => video && (video.srcObject = remoteStream)} />
            ) : <div className="video-placeholder">Waiting for remote video...</div>}

            <h4>Your Video</h4>
            {localStream ? (
              <video className="video local-video" autoPlay playsInline muted ref={video => video && (video.srcObject = localStream)} />
            ) : <div className="video-placeholder">Starting video...</div>}
          </div>
        )}

        {/* Video Call Controls */}
        {(callState === "calling" || callState === "inCall") && (
          <div className="video-controls">
            <button onClick={onMuteToggle} className="control-button mute-button">Mute/Unmute</button>
            <button onClick={onCameraToggle} className="control-button camera-button">Toggle Camera</button>
            <button onClick={onScreenShareToggle} className="control-button screenshare-button">
              {isScreenSharing ? "Stop Sharing" : "Share Screen"}
            </button>
            <button onClick={onEndCall} className="control-button end-call-button">End Call</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCall;
