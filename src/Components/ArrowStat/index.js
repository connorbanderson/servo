import React from 'react';
import './ArrowStat.scss';
import Arrow from "../Arrow"

const ArrowStat = ({ performance, emptyPortfolio, text }) => (
  <div className="arrowStat arrowStat--marginM">
    <div className="arrowStat__row">
      <Arrow percentage={performance} />
      <span className="arrowStat__stat" style={{color: performance >= 0 ? "#81C784" : "red"}}>
        {emptyPortfolio ? "-" : performance}%
      </span>
    </div>
    <span className="arrowStat__title">{text}</span>
  </div>
);

ArrowStat.defaulProps = {
  performance: 0,
  emptyPortfolio: false,
  text: 'Arrow Stat Text',
};

export default ArrowStat;
