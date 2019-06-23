import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

const MarketCard = ({ coin }) => {
  console.log(coin);
  const lineColor = coin.price_change_percentage_7d_in_currency >= 0 ? '#4CAF50' : '#E91E63';
  return(
    <div key={coin.name} className="cryptoCard">
      <span>{coin.name}</span>
      <span>${coin.current_price}</span>
      <LineChart width={100} height={50} data={prepGraphData(coin.sparkline_in_7d.price)}>
        <Line
          type="monotone"
          dataKey="pv"
          stroke={lineColor}
          strokeWidth={2}
          dot={false}
        />
        <YAxis type="number" domain={['dataMin', 'dataMax']} hide={true}/>
      </LineChart>
    </div>
  )
}

export default MarketCard;

const prepGraphData = ( graphData ) => {
  const payload = []
  graphData.map(dataPoint => {
    payload.push({pv: dataPoint})
  })
  return payload
}
