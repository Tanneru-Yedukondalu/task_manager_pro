import React, { useState } from "react";
import "./GroupModal.css";
const GroupModal = ({ onlineUsers, onClose, onCreateGroup }) => {
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [groupName, setGroupName] = useState('');
  
    const handleCreate = () => {
      if (groupName.trim() && selectedUsers.length > 0) {
        onCreateGroup({ name: groupName, members: selectedUsers });
        onClose();
      } else {
        alert('Please provide a group name and select at least one user.');
      }
    };
  
    return (
      <div className="group-modal">
        <h3>Create Group</h3>
        <input
          type="text"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <div className="user-selection">
          {onlineUsers.map((user) => (
            <div key={user}>
              <input
                type="checkbox"
                id={user}
                checked={selectedUsers.includes(user)}
                onChange={() =>
                  setSelectedUsers((prev) =>
                    prev.includes(user) ? prev.filter((u) => u !== user) : [...prev, user]
                  )
                }
              />
              <label htmlFor={user}>{user}</label>
            </div>
          ))}
        </div>
        <button onClick={handleCreate}>Create Group</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    );
  };

  export default GroupModal;
  