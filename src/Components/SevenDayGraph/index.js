import React from 'react';
import './SevenDayGraph.scss';
import Paper from "@material-ui/core/Paper";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  YAxis,
  XAxis,
  Tooltip
} from "recharts";
import {
  commarize,
} from "../../utils";
import Empty from '../Empty'

const SevenDayGraph = ({ coins, data }) => (
  <Paper className="sevenDayGraph">
    <span className="sevenDayGraph__title">Past 7 Days</span>
    {coins.length > 0 && data.length > 0 ? (
      <ResponsiveContainer width="100%" height={250}>
        <LineChart width={"100%"} height={250} data={data}>
          <Line
            type="monotone"
            dataKey="Total Holdings"
            stroke={
              data[data.length - 1][
                "Total Holdings"
              ] >= data[0]["Total Holdings"]
                ? "#81C784"
                : "red"
            }
            strokeWidth={2}
            dot={false}
          />
          <YAxis
            type="number"
            domain={["dataMin", "dataMax"]}
            hide={true}
          />
          <XAxis type="category" hide={true} />
          <Tooltip
            formatter={(value, name, props) => {
              return `$${commarize(
                parseInt(props.payload["Total Holdings"])
              )}`;
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    ) : (
      <Empty text='Add your first coin.' />
    )}
  </Paper>
);

SevenDayGraph.defaulProps = {
  coins: [],
  data: [],
};

export default SevenDayGraph;
