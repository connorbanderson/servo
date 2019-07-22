import React from "react";

const GradientPrice = ({ price }) => (
  <h1 style={{ fontSize: "36px" }} className="primaryGradientText">
    {price === '' ? "$ -" : `$${price}`}
  </h1>
);

GradientPrice.defaultProps = {
  price: null
};

export default GradientPrice;
