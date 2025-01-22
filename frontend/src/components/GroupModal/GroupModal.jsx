import React, { useState } from "react";
import "./GroupModal.css";

const GroupModal = ({ allUsers = [], onlineUsers = [], onClose, onCreateGroup }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState("");

  const handleCreate = () => {
    if (groupName.trim() && selectedUsers.length > 0) {
      onCreateGroup({ name: groupName, members: selectedUsers });
      onClose();
    } else {
      alert("Please provide a group name and select at least one user.");
    }
  };

  return (
    <div className="group-modal-overlay">
      <div className="group-modal">
        <div className="modal-header">
          <h3>Create Group</h3>
          <button className="close-modal-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <input
          type="text"
          className="group-name-input"
          placeholder="Enter group name..."
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <div className="user-selection">
          {/* Safely handle the mapping of allUsers */}
          {(allUsers || []).map((user) => {
            const isOnline = onlineUsers.includes(user);
            return (
              <div key={user} className="user-option">
                <input
                  type="checkbox"
                  id={user}
                  checked={selectedUsers.includes(user)}
                  onChange={() =>
                    setSelectedUsers((prev) =>
                      prev.includes(user)
                        ? prev.filter((u) => u !== user)
                        : [...prev, user]
                    )
                  }
                />
                <label htmlFor={user}>
                  {user}
                  <span
                    className={`user-status ${isOnline ? "online" : "offline"}`}
                  >
                    {isOnline ? "Online" : "Offline"}
                  </span>
                </label>
              </div>
            );
          })}
        </div>
        <div className="modal-actions">
          <button className="create-group-btn" onClick={handleCreate}>
            Create Group
          </button>
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupModal;
