import React from "react";
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

const Header = () => {
  return (
    <div className="header">
      <div className="a">
        <div className="ab">
          <HomeIcon />
          <div>Login</div>
        </div>
      </div>

      <div className="b">TASK MANAGER PRO</div>

      <div className="c">
        <div className="d">
          <AccountCircleIcon />
          <div>Profile</div>
        </div>
        <div className="d">
          <SettingsIcon />
          <div>Settings</div>
        </div>
        <div className="d">
          <LogoutIcon />
          <div>Logout</div>
        </div>
      </div>
    </div>
  );
};

export default Header;
