import React, { useState } from "react";
import "./SettingsDropdown.css"; // CSS for dropdown

const SettingsDropdown = ({ activeOption, onOptionClick }) => {
  return (
    <div className="settings-dropdown">
      <ul>
        <li
          onClick={() => onOptionClick("History")}
          className={activeOption === "History" ? "active" : ""}
        >
          History
        </li>
        <li
          onClick={() => onOptionClick("Clear Tasks")}
          className={activeOption === "Clear Tasks" ? "active" : ""}
        >
          Clear Tasks
        </li>
        <li
          onClick={() => onOptionClick("Privacy")}
          className={activeOption === "Privacy" ? "active" : ""}
        >
          Privacy
        </li>
        <li
          onClick={() => onOptionClick("Security")}
          className={activeOption === "Security" ? "active" : ""}
        >
          Security
        </li>
        <li
          onClick={() => onOptionClick("Language")}
          className={activeOption === "Language" ? "active" : ""}
        >
          Language
        </li>
      </ul>
    </div>
  );
};

export default SettingsDropdown;
