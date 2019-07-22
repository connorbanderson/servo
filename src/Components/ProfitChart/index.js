import React from "react";
import "./ProfitChart.scss";
import Arrow from "../Arrow";
import Empty from "../Empty";
import Paper from "@material-ui/core/Paper";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  YAxis,
  XAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

const ProfitChart = ({ coins, data }) => (
  <Paper className="profitChart">
    <span className="profitChart__title">Portfolio Performance</span>
    {coins.length > 0 && data.length !== 0 ? (
      <ResponsiveContainer width="100%" height={274}>
        <BarChart
          height={250}
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5
          }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="30%" stopColor="#E94057" />
              <stop offset="90%" stopColor="#F27121" />
            </linearGradient>
            <linearGradient id="colorXv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="30%" stopColor="#a8ff78" />
              <stop offset="90%" stopColor="#78ffd6" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="investment" stackId="a" fill="url(#colorUv)" />
          <Bar dataKey="profit" stackId="a">
            {data.map((coin, index) => {
              return (
                <Cell
                  fill={coin.profit >= 0 ? "url(#colorXv)" : "#fcebee"}
                  fillOpacity={1}
                  key={`cell-${index}`}
                />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    ) : (
      <Empty text="Add your first coin!" />
    )}
  </Paper>
);

ProfitChart.defaulProps = {
  data: [],
  text: "Portfolio Performance"
};

export default ProfitChart;
