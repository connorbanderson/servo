import React from 'react'
import ArrowDropUp from "@material-ui/icons/ArrowDropUp";
import ArrowDropDown from "@material-ui/icons/ArrowDropDown";

const Arrow = ({ percentage }) => {
  if (percentage >= 0) return <ArrowDropUp style={{ color: "#81C784" }} />
  else return <ArrowDropDown style={{ color: "red" }} />
}

export default Arrow;
