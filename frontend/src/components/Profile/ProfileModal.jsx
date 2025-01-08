import React, { useState, useEffect } from "react";
import { fetchUserProfile } from "../../api";
import "./ProfileModal.css";

const ProfileModal = ({ onClose }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const response = await fetchUserProfile();
        setProfileData(response);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch user profile");
        setLoading(false);
      }
    };

    getUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="profile-modal-backdrop">
        <div className="profile-modal">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-modal-backdrop">
        <div className="profile-modal">{error}</div>
      </div>
    );
  }

  const getDefaultProfileImage = () => {
    return profileData?.username?.charAt(0).toUpperCase() || "U";
  };

  return (
    <div className="profile-modal-backdrop" onClick={onClose}>
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
        <div className="default-image">{getDefaultProfileImage()}</div>
        <h2>{profileData.username}</h2>

        {/* Profile Information Display */}
        <div className="profile-info">
          <span className="label">Email</span>
          <div className="separator"></div>
          <span>{profileData.email}</span>
        </div>
        <div className="profile-info">
          <span className="label">Account Created At</span>
          <div className="separator"></div>
          <span>{new Date(profileData.created_at).toLocaleString()}</span>
        </div>
        <div className="profile-info">
          <span className="label">First Name</span>
          <div className="separator"></div>
          <span>{profileData.first_name}</span>
        </div>
        <div className="profile-info">
          <span className="label">Last Name</span>
          <div className="separator"></div>
          <span>{profileData.last_name}</span>
        </div>
        <div className="profile-info">
          <span className="label">Role</span>
          <div className="separator"></div>
          <span>{profileData.role}</span>
        </div>

        {/* Buttons */}
        <button className="edit-btn" onClick={() => alert("Edit Profile feature coming soon!")}>
          Edit Profile
        </button>

        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ProfileModal;
