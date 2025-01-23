import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import KanbanBoard from "../KanbanBoard/KanbanBoard";
import ProfileModal from "../Profile/ProfileModal";
import SettingsDropdown from "../SettingsDropdown/SettingsDropdown"; // Import the dropdown
import "./Header.css";
import { fetchTasksFromBackend } from "../../api";

const Header = ({handleLogout}) => {
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown visibility
  const [activeOption, setActiveOption] = useState(null); // Track the selected option
  const [isKanbanOpen, setIsKanbanOpen] = useState(false);
  const accessToken = localStorage.getItem('access_token');

  // Open Kanban board modal
  const handleKanban = () => {
    setIsKanbanOpen(true); // Show Kanban board
  };

  // Close Kanban board modal
  const closeKanbanBoard = async () => {
    setIsKanbanOpen(false); 
    await fetchTasksFromBackend();
    // Hide Kanban board

  };

  // Logout user
  const onLogout = () => {
    if (handleLogout) {
      handleLogout(); // Disconnect the socket
    }

    localStorage.clear(); // Clear local storage
    navigate("/"); // Redirect to login
  };

  // Toggle profile modal visibility
  const handleProfileClick = () => {
    setShowProfileModal(true);
  };

  const onClose = () => {
    setShowProfileModal(false);
  };

  // Toggle settings dropdown visibility
  const toggleSettingsDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Handle option click in the dropdown
  const handleOptionClick = (option) => {
    setActiveOption(option); // Set active option
    setIsDropdownOpen(false); // Close dropdown after option click
  };

  return (
    <div className="header-container">
      <div className="left-section">
        <div className="login-btn" onClick={handleKanban}>
          <HomeIcon />
          <div>Kanban Board</div>
        </div>
      </div>

      <div className="title">TASK MANAGER PRO</div>

      <div className="right-section">
        <div className="profile-btn" onClick={handleProfileClick}>
          <AccountCircleIcon />
          <div>Profile</div>
        </div>

        {/* Settings Button */}
        <div className="settings-btn" onClick={toggleSettingsDropdown}>
          <SettingsIcon />
          <div>Settings</div>
        </div>

        {/* Settings Dropdown */}
        {isDropdownOpen && (
          <SettingsDropdown activeOption={activeOption} onOptionClick={handleOptionClick} />
        )}

        <div className="logout-btn" onClick={onLogout}>
          <LogoutIcon />
          <div>Logout</div>
        </div>
      </div>

      {/* Render ProfileModal */}
      {showProfileModal && <ProfileModal onClose={onClose} />}


      {/* Kanban Board Modal */}
      {isKanbanOpen && <KanbanBoard accessToken={accessToken} onClose={closeKanbanBoard} />}
    </div>
  );
};

export default Header;
