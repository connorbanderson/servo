import React from 'react'
import _ from "lodash";

const round = number => {
 if (number === null) return number;
 if (number > 1) {
   return (Math.round(number * 100) / 100).toFixed(2);
 } else {
   return number.toFixed(2);
 }
};

export const calculateHoldings = (portfolio, coins) => {
  let holdings = 0;
  if (portfolio === undefined || portfolio.coins === undefined) return [];
  const portfolioKeys = Object.keys(portfolio.coins);
  portfolioKeys.map(portfolioId => {
    const investment = portfolio.coins[portfolioId];
    const currentCoin = coins.filter(coin => coin.id === investment.coin)[0];
    holdings += currentCoin.current_price * investment.amountPurchased;
  });
  return holdings;
};

export const calculatePerformers = (portfolio, timeFrame, coins) => {
  const portfolioCoinList = [];
  Object.keys(portfolio.coins).map(portfolioId => {
    const sparkline = [];
    const investment = portfolio.coins[portfolioId];
    const currentCoin = coins.filter(coin => coin.id === investment.coin)[0];
    portfolioCoinList.push(currentCoin)
  });
  const payload = _.orderBy(portfolioCoinList, timeFrame, "desc");
  return payload
};

export const generateSevenDayLineChartData = (portfolio, coins) => {
  const payload = [];
  if (portfolio === undefined || portfolio.coins === undefined) return [];
  const portfolioKeys = Object.keys(portfolio.coins);
  const sparkLineList = [];
  portfolioKeys.map(portfolioId => {
    const sparkline = [];
    const investment = portfolio.coins[portfolioId];
    const currentCoin = coins.filter(coin => coin.id === investment.coin)[0];
    currentCoin.sparkline_in_7d.price.map(price =>
      sparkline.push(price * investment.amountPurchased)
    );
    sparkLineList.push(sparkline);
  });
  sparkLineList[0].map((item, index) => {
    let priceSum = 0;
    sparkLineList.map(sparkline => (priceSum += sparkline[index]));
    payload.push({
      "Total Holdings": parseInt(round(priceSum)),
      Date: round(priceSum)
    });
  });
  console.log('Hey this is the payload', payload);
  return payload;
};

export const generatePerformanceStats = (portfolio, timeFrame, coins) => {
  let performancePercentage = 0;
  const totalHoldings = calculateHoldings(portfolio, coins);
  if (portfolio === undefined || portfolio.coins === undefined) return [];
  const portfolioKeys = Object.keys(portfolio.coins);
  portfolioKeys.map(portfolioId => {
    const investment = portfolio.coins[portfolioId];
    const currentCoin = coins.filter(coin => coin.id === investment.coin)[0];
    const holdinsOfThisCoins =
      currentCoin.current_price * investment.amountPurchased;
    performancePercentage +=
      (holdinsOfThisCoins / totalHoldings) * currentCoin[timeFrame];
  });
  return round(performancePercentage);
};

export const commarize = number => {
  if (number >= 1e3) {
    var units = ["k", "M", "B", "T"];
    let unit = Math.floor((number.toFixed(0).length - 1) / 3) * 3;
    var num = (number / ("1e" + unit)).toFixed(2);
    var unitname = units[Math.floor(unit / 3) - 1];
    return num + unitname;
  }
  return number.toLocaleString();
};

export const styleRedGreen = number => number >= 0 ? "#81C784" : "red";
