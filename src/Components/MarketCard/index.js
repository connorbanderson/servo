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
  return(
    <div key={coin.name} className="cryptoCard">
      <span>{coin.name}</span>
      <span>${coin.current_price}</span>
      <LineChart width={100} height={50} data={prepGraphData(coin.sparkline_in_7d.price)}>
        <Line
          type="monotone"
          dataKey="pv"
          stroke="#8884d8"
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
