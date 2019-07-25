// Frontend Lib Imports
import React, { useState } from "react";
import { connect } from "react-redux";

// Component Imports
import IconButton from "@material-ui/core/IconButton";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Avatar from "../Avatar";
import Menu from "./menu";

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
            anchorEl={anchorEl}
            logout={logout}
            handleClose={() => updateAnchorEl(null)}
          />
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
