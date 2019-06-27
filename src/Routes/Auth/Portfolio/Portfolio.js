// Frontend Libs
import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";

// Components
import Navbar from "../../../Components/Navbar";
import GradientPrice from "../../../Components/GradientPrice";
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

// Style
import "./Portfolio.scss";
import "../../../index.scss";

class Portfolio extends Component {
  componentWillMount() {
    this.getCoins();
  }

  state = {
    coins: []
  };

  getCoins = () => {
    const reqUrl =
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=USD&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=1h,24h,7d,30d,200d,1y";
    fetch(reqUrl)
      .then(res => res.json())
      .then(
        coins => {
          this.setState({ coins: coins });
        },
        error => {
          console.log("error", error);
        }
      );
  };

  prepGraphData = graphData => {
    const payload = [];
    graphData.map(dataPoint => {
      payload.push({ pv: dataPoint });
    });
    return payload;
  };

  prepBarGraphData = graphData => {
    const barData = graphData.slice(1, 11);
    const payload = [];
    barData.map(coin => {
      const investment = this.getRandomArbitrary(1000, 10000);
      const profit = this.getRandomArbitrary(-1, 1.5) * investment;
      payload.push({
        name: coin.name,
        investment: investment,
        profit: profit,
        total: profit + investment
      });
    });
    console.log(payload);
    return payload;
  };

  getRandomArbitrary = (min, max) => Math.random() * (max - min) + min;
  render() {
    const { coins } = this.state;
    console.log(coins[0]);
    const barChartData = this.prepBarGraphData(coins);
    return (
      <div className="portfolioPageWrapper flexColStart">
        <Navbar />
        <div className="portfolioInnerWrapper">
          <Paper className="portfolioTopPaper flexSpaceBetween">
            <div className="lhs">
              <h1>To Da Moon</h1>
              <div className="priceWrapper">
                <span>uparrow</span>
                <span>5.04%</span>
              </div>
              <h2>$23,444</h2>
              <GradientPrice
                price={coins.length > 0 ? coins[0].current_price : 0}
              />
            </div>

            <div className="rhs flex">
              <h3>Top Performer</h3>
              <h3>Worst Performer</h3>
              <h3>Most Volume</h3>
              <h3>MktCap / Volume</h3>
            </div>
          </Paper>

          <Paper className="portfolio7DayGraphPaper">
            {coins.length > 0 ? (
              <ResponsiveContainer width="100%" height={500}>
                <LineChart
                  width={"100%"}
                  height={500}
                  data={this.prepGraphData(coins[0].sparkline_in_7d.price)}
                >
                  <Line
                    type="monotone"
                    dataKey="pv"
                    stroke="#81C784"
                    strokeWidth={2}
                    dot={false}
                  />
                  <YAxis
                    type="number"
                    domain={["dataMin", "dataMax"]}
                    hide={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <span>Loading</span>
            )}
          </Paper>

          <Paper className="portfolioProfitGraphPaper">
            {coins.length > 0 ? (
              <ResponsiveContainer width="100%" height={500}>
                <BarChart
                  width={"100%"}
                  height={500}
                  data={barChartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5
                  }}
                >
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="30%"
                        stopColor="#E94057"
                      />
                      <stop
                        offset="90%"
                        stopColor="#F27121"
                      />
                    </linearGradient>
                    <linearGradient id="colorXv" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="30%"
                        stopColor="#a8ff78"
                      />
                      <stop
                        offset="90%"
                        stopColor="#78ffd6"
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="investment" stackId="a" fill="url(#colorUv)" />
                  <Bar dataKey="profit" stackId="a">
                    {barChartData.map((coin, index) => {
                      console.log(coin, index);
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
              <span>Loading</span>
            )}
          </Paper>
        </div>
      </div>
    );
  }
}

Portfolio.defaultProps = {};

export default Portfolio;
