import React from "react";
import SettingsIcon from '@mui/icons-material/Settings';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ChatIcon from '@mui/icons-material/Chat';
import FlagIcon from '@mui/icons-material/Flag';

const SettingsOptions = ({ isSettingsClicked, handleSettingsClick, handleEditClick, handleDeleteClick }) => {
    return (
        <div style={{ position: "relative", borderRadius: "30px" }} onClick={handleSettingsClick}>
            <SettingsIcon className="mui-icons" fontSize="" />

            {/* Render the four blocks if the SettingsIcon is clicked */}
            {isSettingsClicked && (
                <>
                    <div className="block top-left" onClick={handleEditClick}>
                        <EditIcon fontSize="large" />
                    </div>
                    <div className="block top-right" onClick={handleDeleteClick}>
                        <DeleteIcon fontSize="large" />
                    </div>
                    <div className="block bottom-left">
                        <ChatIcon fontSize="large" />
                    </div>
                    <div className="block bottom-right">
                        <FlagIcon fontSize="large" />
                    </div>
                </>
            )}
        </div>
    );
};

export default SettingsOptions;
