import React from "react";
import "../../index.scss";

const GradientPrice = ({ price }) => (
  <h1 style={{ fontSize: "36px" }} className="primaryGradientText">
    {`$${price}`}
  </h1>
);

GradientPrice.defaultProps = {
  price: null
};

export default GradientPrice;
