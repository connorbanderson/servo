import React from "react";
import Tooltip from "@material-ui/core/Tooltip";

const ConditionalTooltip = ({ visible, title, placement, children }) => {
  if (visible)
    return (
      <Tooltip title={title} placement={placement}>
        <div>{children}</div>
      </Tooltip>
    );
  else return children;
};

ConditionalTooltip.defaultProps = {
  visible: false,
  title: null,
  placement: "bottom-end",
  children: null
};

export default ConditionalTooltip;
