// Frontend Lib Imports
import React, { Component } from "react";
import { connect } from "react-redux";

// Component Imports
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Person from "@material-ui/icons/Person";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ExitToApp from "@material-ui/icons/ExitToApp";
import PersonOutline from "@material-ui/icons/PersonOutline";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
//Redux
import { logout } from "../../Redux/Actions/auth";

// Style Imports
import "./Navbar.scss";

// Asset Imports
import logo from "../../logo.svg";

//Constant Imports
import { AVATAR_PALETTE_400, AVATAR_PALETTE_600, ONLY_INT_REGX } from '../../constants'

class Navbar extends Component {
  state = {
    anchorEl: null
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };
  handleClick = e => {
    this.setState({ anchorEl: e.currentTarget });
  };

  render() {
    const { anchorEl } = this.state;
    const { user, logout } = this.props;
    const avatarColorId =  user.uid.replace(ONLY_INT_REGX, '') % 14
    return (
      <nav className="dashboardNavbar">
        <div className="navbarInnerWrapper">
          <div className="lhs">
            <img
              src={logo}
              alt="navbar logo"
              style={{ height: "32px", width: "32px" }}
            />
          </div>
          <div className="middle" />
          <div className="rhs flexRight">
            <Avatar
              style={{ height: "32px", width: "32px", marginRight: "5px" }}
              alt="Remy Sharp"
              src={user.photoURL ? user.photoURL : "https://scontent.fyyc4-1.fna.fbcdn.net/v/t1.15752-9/53270755_401825197043838_4318937078982246400_n.png?_nc_cat=105&_nc_ht=scontent.fyyc4-1.fna&oh=9e34adadc4dcb7d326ef65afb4b902d7&oe=5D893ECD"}
            />
            <div className="flexColRight">
              <b style={{ marginLeft: "5px", marginRight: "5px", opacity: 0.7}}>
                {user.displayName !== null ? user.displayName : user.email}
              </b>
              <div className="flexLeft">
                <div className="onlineDot" />
                <small style={{ marginLeft: "5px", opacity: 0.5 }}>
                  Online
                </small>
              </div>
            </div>
            <IconButton
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={this.handleClick}
              aria-label="ExpandMore"
              size="small"
            >
              <ExpandMore fontSize="inherit" />
            </IconButton>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={this.handleClose}
              style={{ marginTop: "30px" }}
            >
              <MenuItem disabled onClick={this.handleClose}>
                <div className="flexLeft">
                  <PersonOutline style={{ marginRight: "5px" }} /> Profile
                </div>
              </MenuItem>
              <MenuItem onClick={()=>[this.handleClose, logout()]}>
                <div className="flexLeft">
                  <ExitToApp style={{ marginRight: "5px" }} />
                  Logout
                </div>
              </MenuItem>
            </Menu>
          </div>
        </div>
      </nav>
    );
  }
}

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

/*

<Button
  className="squareButton"
  variant="contained"
  size="small"
  onClick={() => logout()}
  style={{ backgroundColor: "white", width: "32px" }}
>
  <ExitToApp style={{}} />
</Button>

*/
