import React from "react";
// Style Imports
import "./Navbar.scss";
import MaterialMenu from "@material-ui/core/Menu";
import MaterialMenuItem from "@material-ui/core/MenuItem";
import ExitToApp from "@material-ui/icons/ExitToApp";
import PersonOutline from "@material-ui/icons/PersonOutline";

const Menu = ({ anchorEl, logout, handleClose }) => (
  <MaterialMenu
    id="simple-menu"
    anchorEl={anchorEl}
    keepMounted
    open={Boolean(anchorEl)}
    onClose={handleClose}
    className="navBar__menu"
  >
    <MaterialMenuItem disabled onClick={handleClose}>
      <div className="navBar__menuItemWrapper">
        <PersonOutline className="navBar__menuItemIcon" />
        Profile
      </div>
    </MaterialMenuItem>
    <MaterialMenuItem onClick={() => [handleClose, logout()]}>
      <div className="navBar__menuItemWrapper">
        <ExitToApp className="navBar__menuItemIcon" />
        Logout
      </div>
    </MaterialMenuItem>
  </MaterialMenu>
);

export default Menu;
