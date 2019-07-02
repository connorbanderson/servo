// Frontend Lib Imports
import React, { Component } from "react";
import { connect } from "react-redux";

// Component Imports
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ExitToApp from "@material-ui/icons/ExitToApp";
import Person from "@material-ui/icons/Person";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
//Redux
import { logout } from "../../Redux/Actions/auth";

// Style Imports
import "./Navbar.scss";

// Asset Imports
import logo from "../../logo.svg";

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
    console.log("user..", user);
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
              style={{ height: "32px", width: "32px" }}
              alt="Remy Sharp"
              src="https://scontent.fyyc4-1.fna.fbcdn.net/v/t1.15752-9/53270755_401825197043838_4318937078982246400_n.png?_nc_cat=105&_nc_ht=scontent.fyyc4-1.fna&oh=9e34adadc4dcb7d326ef65afb4b902d7&oe=5D893ECD"
            />
            <span style={{ marginLeft: "5px", marginRight: "25px" }}>
              {user.displayName !== null ? user.displayName : user.email}
            </span>
            <Button
              className="squareButton"
              variant="contained"
              size="small"
              onClick={() => logout()}
              style={{ backgroundColor: "white", width: "32px" }}
            >
              <ExitToApp style={{}} />
            </Button>
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
