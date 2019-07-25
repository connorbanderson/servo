import React from "react";
import MaterialAvatar from "@material-ui/core/Avatar";
import "./Avatar.scss";

const Avatar = ({ user }) => {
  const avatarImage = user.photoURL ? user.photoURL : null;
  return (
    <MaterialAvatar className="navBar__avatar" alt="avatar" src={avatarImage} />
  );
};

Avatar.defaultProps = {
  user: null
};

export default Avatar;
