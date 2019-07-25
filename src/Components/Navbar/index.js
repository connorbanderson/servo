// Frontend Lib Imports
import React, { useState } from "react";
import { connect } from "react-redux";

// Component Imports
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Person from "@material-ui/icons/Person";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ExitToApp from "@material-ui/icons/ExitToApp";
import PersonOutline from "@material-ui/icons/PersonOutline";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Avatar from "../Avatar";

//Redux
import { logout } from "../../Redux/Actions/auth";

// Style Imports
import "./Navbar.scss";

// Asset Imports
import logo from "../../logo.svg";

//Constant Imports
import {
  AVATAR_PALETTE_400,
  AVATAR_PALETTE_600,
  ONLY_INT_REGX
} from "../../constants";

const Navbar = ({ user, logout }) => {
  const handleClose = () => updateAnchorEl(null);
  const [anchorEl, updateAnchorEl] = useState(null);
  const avatarColorId = user.uid.replace(ONLY_INT_REGX, "") % 14;
  const userName = user.displayName !== null ? user.displayName : user.email;
  return (
    <nav className="navBar">
      <div className="navBar__innerWrapper">
        <div className="navBar__lhs">
          <img src={logo} alt="servologo" className="navBar__logo" />
        </div>
        <div className="navBar__rhs">
          <Avatar user={user} />
          <div className="navBar__userNameWrapper">
            <b className="navBar__userName">{userName}</b>
            <div className="navBar__statusWrapper">
              <div className="navBar__onlineDot" />
              <small className="navBar__status">Online</small>
            </div>
          </div>
          <IconButton
            onClick={e => updateAnchorEl(e.currentTarget)}
            size="small"
          >
            <ExpandMore fontSize="inherit" />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
            className="navBar__menu"
          >
            <MenuItem disabled onClick={handleClose}>
              <div className="navBar__menuItemWrapper">
                <PersonOutline className="navBar__menuItemIcon" />
                Profile
              </div>
            </MenuItem>
            <MenuItem onClick={() => [handleClose, logout()]}>
              <div className="navBar__menuItemWrapper">
                <ExitToApp className="navBar__menuItemIcon" />
                Logout
              </div>
            </MenuItem>
          </Menu>
        </div>
      </div>
    </nav>
  );
};

const mapStateToProps = state => ({
  user: state.auth.user
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navbar);
