import React from "react";
import {
  calculateHoldings,
  generateSevenDayLineChartData,
  generatePerformanceStats,
  commarize,
  calculatePerformers,
  styleRedGreen,
  round
} from "../../utils";
import { LineChart, Line, YAxis } from "recharts";
import ArrowDropUp from "@material-ui/icons/ArrowDropUp";
import ArrowDropDown from "@material-ui/icons/ArrowDropDown";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import CoinPerformer from "../CoinPerformer";
import Empty from "../Empty";

const PortfolioCard = ({ portfolio, portfolioKey, coins, handleRedirect }) => {
  const lineChartData = generateSevenDayLineChartData(portfolio, coins);
  const emptyPortfolio = portfolio.coins === undefined;
  const performancePercentage = generatePerformanceStats(
    portfolio,
    "price_change_percentage_7d_in_currency",
    coins
  );
  const performers = calculatePerformers(
    portfolio,
    "price_change_percentage_7d_in_currency",
    coins
  );
  const topPerformer = performers[0];
  const worstPerformer = performers[performers.length - 1];
  const styleColor = styleRedGreen(performancePercentage);
  const holdings = commarize(calculateHoldings(portfolio, coins));
  return (
    <Paper className="portfolioPaper">
      <div style={{ marginBottom: "15px" }} className="flexSpaceBetweenStart">
        <div className="flexColLeft">
          <div className="flexLeft">
            <h2>{portfolio.name}</h2>
            <div className="flex marginTS">
              {performancePercentage >= 0 ? (
                <ArrowDropUp style={{ color: styleColor }} />
              ) : (
                <ArrowDropDown style={{ color: styleColor }} />
              )}
              <span style={{ color: styleColor, fontSize: "22px" }}>
                {emptyPortfolio ? "-" : Math.abs(performancePercentage)}%
              </span>
            </div>
          </div>
          <div className="flexLeft marginTS">
            <small style={{ opacity: 0.3, fontWeight: "bold" }}>
              Past 7 Days
            </small>
          </div>
        </div>
        <h1 style={{ fontSize: "36px" }} className="primaryGradientText">
          ${emptyPortfolio ? "-" : holdings}
        </h1>
      </div>
      {!emptyPortfolio ? (
        <LineChart width={420} height={120} data={lineChartData}>
          <Line
            type="monotone"
            dataKey="Total Holdings"
            stroke={styleColor}
            strokeWidth={2}
            dot={false}
          />
          <YAxis type="number" domain={["dataMin", "dataMax"]} hide={true} />
        </LineChart>
      ) : (
        <Empty text="Manage your portfolio to add your first coin." />
      )}

      {performers.length >= 1 && (
        <div className="fullWidth flexRight marginTM marginBM">
          <CoinPerformer
            coin={topPerformer}
            text="Top Performer"
            style={{ marginLeft: "30px" }}
          />
          {performers.length >= 2 && (
            <CoinPerformer
              coin={worstPerformer}
              text="Wost Performer"
              style={{ marginLeft: "30px" }}
            />
          )}
        </div>
      )}
      <div className="botActionMenu flexRight">
        <Button
          onClick={() =>
            handleRedirect(`/portfolio/${portfolioKey.substring(1)}`)
          }
          color="primary"
        >
          Manage
        </Button>
      </div>
    </Paper>
  );
};

PortfolioCard.defaultProps = {
  portfolio: null,
  coins: [],
  handleRedirect: () => console.log("handleRedirect not declared")
};

export default PortfolioCard;
