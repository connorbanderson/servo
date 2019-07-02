import React from 'react'
import './Loader.scss'

const Loader = () => (
  <div className="squareHopperLoaderWrapper">
    <div className="container">
      <span className="square slidingSquare" />
      <div className="hoppingSquareWrapper">
        <span className="square hoppingSquare" />
        <span className="square hoppingSquare" />
        <span className="square hoppingSquare" />
        <span className="square hoppingSquare" />
      </div>
    </div>
  </div>
);

export default Loader;
