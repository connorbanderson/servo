import React from "react";
import { styled } from "@material-ui/styles";
import Button from "@material-ui/core/Button";

const GradientButton = styled(({ color, ...other }) => <Button {...other} />)({
  background: props =>
    props.color === "purple"
      ? "linear-gradient(45deg, #E94057 30%, #F27121 90%)"
      : "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
  border: 0,
  borderRadius: 3,
  color: "white",
  height: 48,
  padding: "0 40px",
  margin: 8
});

export default GradientButton;

/*
boxShadow: props =>
  props.color === "purple"
    ? "0 3px 5px 2px rgba(255, 105, 135, .3)"
    : "0 3px 5px 2px rgba(33, 203, 243, .3)",
*/
