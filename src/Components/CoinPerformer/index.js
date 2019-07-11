import React from "react";
import { styleRedGreen, round } from "../../utils";

const CoinPerformer = ({ coin, text, style }) => {
  const sevenDayPerformance = coin.price_change_percentage_7d_in_currency;
  const textColor = styleRedGreen(coin.price_change_percentage_7d_in_currency);
  return (
    <div style={{...style}} className="statWrapper">
      <div style={{ flex: "0 0 auto" }} className="fullWidth flex">
        <img
          className="marginRM"
          src={coin && coin.image}
          style={{ height: "24px", width: "24px" }}
        />
        <span style={{ color: textColor }}>
          {round(coin.price_change_percentage_7d_in_currency)}%
        </span>
      </div>
      <span
        style={{
          marginTop: "10px",
          fontSize: "12px",
          opacity: "0.4"
        }}
      >
        {text}
      </span>
    </div>
  );
};

CoinPerformer.defaultProps = {
  coin: null,
  text: "Placeholder Text",
  style: {}
};

export default CoinPerformer;
