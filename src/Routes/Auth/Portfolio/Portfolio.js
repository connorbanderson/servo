// Frontend Libs
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import { connect } from "react-redux";
import { authListener } from "../../../Redux/Actions/auth";
import {
  portfolioListner,
  addCoinToPortfolio,
  editPortfolioCoin,
  deleteCoinFromPortfolio
} from "../../../Redux/Actions/portfolios";
import {
  fetchTop250
} from "../../../Redux/Actions/coins";
import _ from "lodash";

// Components
import Navbar from "../../../Components/Navbar";
import Table from "../../../Components/Table";
import Loader from "../../../Components/Loader";
import GradientPrice from "../../../Components/GradientPrice";
import GradientButton from "../../../Components/GradientButton";
import Autocomplete from "../../../Components/Autocomplete";
import Input from "../../../Components/Input/input.js";
import DeleteIcon from "@material-ui/icons/Delete";

import Paper from "@material-ui/core/Paper";
import Modal from "@material-ui/core/Modal";
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
import ArrowDropUp from "@material-ui/icons/ArrowDropUp";
import ArrowDropDown from "@material-ui/icons/ArrowDropDown";
import KeyboardBackspace from "@material-ui/icons/KeyboardBackspace";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
// Style
import "./Portfolio.scss";
import "../../../index.scss";

class Portfolio extends Component {

  componentWillMount() {
    const { authListener, portfolioListner, user, match, fetchTop250 } = this.props;
    authListener();
    fetchTop250();
  }

  state = {
    coinsObject: null,
    isAddModalVisible: false,
    coinToAdd: null,
    isEditModalVisible: false,
    coinToEdit: null,
    amountPurchased: 0,
    amountInvested: 0,
    editAmountPurchased: null,
    editAmountInvested: null,
    redirectUrl: null,
  };

  commarize = number => {
    if (number >= 1e3) {
      var units = ["k", "M", "B", "T"];
      let unit = Math.floor((number.toFixed(0).length - 1) / 3) * 3;
      var num = (number / ("1e" + unit)).toFixed(2);
      var unitname = units[Math.floor(unit / 3) - 1];
      return num + unitname;
    }
    return number.toLocaleString();
  };

  handleUpdateAmountPurchased = amountPurchased => {
    this.setState({ amountPurchased: amountPurchased });
  };

  handleUpdateAmountInvested = amountInvested => {
    this.setState({ amountInvested: amountInvested });
  };

  handleUpdateEditAmountPurchased = amountPurchased => {
    this.setState({ editAmountPurchased: amountPurchased });
  };

  handleUpdateEditAmountInvested = amountInvested => {
    this.setState({ editAmountInvested: amountInvested });
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
    return payload;
  };

  toggleAddModal = selectedCoin => {
    const { isAddModalVisible } = this.state;
    const { coins } = this.props;
    this.setState({ isAddModalVisible: !isAddModalVisible, coinToAdd: selectedCoin });
  };

  toggleEditModal = coin => {
    const { isEditModalVisible } = this.state;
    this.setState({
      isEditModalVisible: !isEditModalVisible,
      coinToEdit: coin
    });
  };

  getRandomArbitrary = (min, max) => Math.random() * (max - min) + min;

  handleAddCoinToPortfolio = () => {
    const { user, addCoinToPortfolio, match } = this.props;
    const { coinToAdd, amountInvested, amountPurchased } = this.state;
    const payload = {
      accountKey: user.uid,
      portfolioKey: `-${match.params.id}`,
      coinInfo: {
        coin: coinToAdd,
        amountPurchased: parseInt(amountPurchased),
        amountInvested: parseInt(amountInvested)
      }
    };
    addCoinToPortfolio(payload);
  };

  handleEditCoinPortfolio = selectedPortfolio => {
    const { user, addCoinToPortfolio, portfolios, match } = this.props;
    const {
      coinToAdd,
      amountInvested,
      amountPurchased,
      editAmountPurchased,
      editAmountInvested,
      coinToEdit
    } = this.state;

    const payload = {
      accountKey: user.uid,
      portfolioKey: `-${match.params.id}`,
      coinKey: coinToEdit.portfolioId,
      updatedObject: {
        coin: coinToEdit.id,
        amountPurchased:
          editAmountPurchased !== null && editAmountPurchased !== ""
            ? parseInt(editAmountPurchased)
            : selectedPortfolio.coins[coinToEdit.portfolioId].amountPurchased,
        amountInvested:
          editAmountInvested !== null && editAmountInvested !== ""
            ? parseInt(editAmountInvested)
            : selectedPortfolio.coins[coinToEdit.portfolioId].amountInvested
      }
    };
    this.toggleEditModal();
    editPortfolioCoin(payload);
  };

  handleDeleteCoinFromPortfolio = () => {
    const { coinToEdit } = this.state;
    const { user, match } = this.props;
    const payload = {
      accountKey: user.uid,
      portfolioKey: `-${match.params.id}`,
      coinKey: coinToEdit.portfolioId
    };
    deleteCoinFromPortfolio(payload);
  };

  generatePortfolioTable = portfolio => {
    const { coins } = this.props;
    let payload = [];
    if (portfolio === undefined || portfolio.coins === undefined) return [];
    const portfolioKeys = Object.keys(portfolio.coins);
    const portfolioTable = [];
    portfolioKeys.map(portfolioId => {
      const investment = portfolio.coins[portfolioId];
      const coinToAdd = coins.filter(coin => coin.id === investment.coin);
      const holdings = investment.amountPurchased * coinToAdd[0].current_price;
      const coinsObject = {
        ...coinToAdd[0],
        holdings: holdings,
        amountInvested: parseInt(investment.amountInvested),
        amountPurchased: parseInt(investment.amountPurchased),
        roi:
          investment.amountInvested > 0
            ? (parseInt(holdings) - parseInt(investment.amountInvested)) /
              parseInt(investment.amountInvested)
            : 0,
        portfolioId: portfolioId
      };
      portfolioTable.push(coinsObject);
      payload = _.orderBy(portfolioTable, "holdings", "desc");
    });
    return payload;
  };

  generateBarChartData = portfolio => {
    const { coins } = this.props;
    const payload = [];
    if (portfolio === undefined || portfolio.coins === undefined) return [];
    const portfolioKeys = Object.keys(portfolio.coins);
    portfolioKeys.map(portfolioId => {
      const investment = portfolio.coins[portfolioId];
      const currentCoin = coins.filter(coin => coin.id === investment.coin)[0];
      const profit =
        currentCoin.current_price * investment.amountPurchased -
        investment.amountInvested;
      payload.push({
        name: currentCoin.name,
        investment: investment.amountInvested,
        profit: profit,
        total: profit + investment.amountInvested
      });
    });
    return _.orderBy(payload, "total", "desc");
  };

  generatePerformanceStats = (portfolio, timeFrame) => {
    const { coins } = this.props;
    let performancePercentage = 0;
    const totalHoldings = this.calculateHoldings(portfolio);
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
    return this.round(performancePercentage);
  };

  calculateHoldings = portfolio => {
    const { coins } = this.props;
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

  round = number => {
    if (number === null) return number;
    if (number > 1) {
      return (Math.round(number * 100) / 100).toFixed(2);
    } else {
      return number.toFixed(2);
    }
  };

  generateSevenDayLineChartData = portfolio => {
    const { coins } = this.props;
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
        "Total Holdings": this.round(priceSum),
        Date: this.round(priceSum)
      });
    });
    return payload;
  };

  render() {
    const { portfolios, user, portfolioListner, coins, isAuthed } = this.props;
    const {
      coinsObject,
      isAddModalVisible,
      coinToAdd,
      coinToEdit,
      isEditModalVisible,
      amountPurchased,
      amountInvested,
      editAmountPurchased,
      editAmountInvested,
      redirectUrl
    } = this.state;
    let userCoinTableList = [];
    let sevenDayPriceData = [];
    let barChartData = [];
    let oneHourPerformance = 0;
    let oneDayPerformance = 0;
    let sevenDayPerformance = 0;
    let holdings = 0;
    if (user !== null && portfolios.portfolios === null) {
      portfolioListner(user.uid);
    }
    let selectedPortfolio = null;
    selectedPortfolio =
      portfolios.portfolios !== null
        ? portfolios.portfolios[`-${this.props.match.params.id}`]
        : null;
    if (selectedPortfolio === null) return <Loader />;
    if (user !== null && portfolios.portfolios !== null && coins.length > 0) {
      userCoinTableList = this.generatePortfolioTable(selectedPortfolio);
      barChartData = this.generateBarChartData(selectedPortfolio);
      oneHourPerformance = this.generatePerformanceStats(
        selectedPortfolio,
        "price_change_percentage_1h_in_currency"
      );
      oneDayPerformance = this.generatePerformanceStats(
        selectedPortfolio,
        "price_change_percentage_24h_in_currency"
      );
      sevenDayPerformance = this.generatePerformanceStats(
        selectedPortfolio,
        "price_change_percentage_7d_in_currency"
      );
      holdings = this.commarize(this.calculateHoldings(selectedPortfolio));
      sevenDayPriceData = this.generateSevenDayLineChartData(selectedPortfolio);
    }
    if (selectedPortfolio === undefined || !isAuthed) return <Redirect to="/" />;
    if (redirectUrl !== null) return <Redirect to={redirectUrl} />
    console.log('PORTFOLIO!!!', coins);
    return (
      <div className="portfolioPageWrapper flexColStart">
        <Navbar user={user} />
        <div className="portfolioInnerWrapper">
        <div
          style={{ margin: "0 10px" }}
          className="fullWidth flexLeft"
        >

        </div>
          <div
            style={{ margin: "0 10px" }}
            className="fullWidth flexSpaceBetween"
          >
            <div className="flexLeft">
              <Button onClick={()=>this.setState({redirectUrl: "/"})} style={{ marginRight: "20px" }}>
                <KeyboardBackspace />
                <span style={{ marginLeft: "4px" }}>Back</span>
              </Button>

            </div>

            <div style={{ width: "300px", paddingBottom: "10px" }}>
              <Autocomplete
                style={{ position: "relative", zIndex: 99 }}
                coins={coins}
                onAdd={coin => this.toggleAddModal(coin)}
              />
            </div>
          </div>

          {coins.length > 0 && (
            <Paper className="portfolioTopPaper flexSpaceBetween">
              <div style={{ width: "25%" }} className="flexLeft">
                <h1
                  className="primaryGradientText"
                  style={{ marginRight: "25px", fontSize: "36px" }}
                >
                  {selectedPortfolio.name}
                </h1>
              </div>
              <div className="flex">
                <div
                  style={{ marginLeft: "25px", marginRight: "25px" }}
                  className="statWrapper"
                >
                  <div className="fullWidth flex">
                    {oneHourPerformance >= 0 ? (
                      <ArrowDropUp style={{ color: "#81C784" }} />
                    ) : (
                      <ArrowDropDown style={{ color: "red" }} />
                    )}
                    <span
                      style={{
                        color: oneHourPerformance >= 0 ? "#81C784" : "red",
                        fontSize: "20px"
                      }}
                    >
                      {oneHourPerformance}%
                    </span>
                  </div>
                  <span
                    style={{
                      marginTop: "10px",
                      fontSize: "12px",
                      opacity: "0.4"
                    }}
                  >
                    1H Performance
                  </span>
                </div>
                <div
                  style={{ marginLeft: "25px", marginRight: "25px" }}
                  className="statWrapper"
                >
                  <div className="fullWidth flex">
                    {oneDayPerformance >= 0 ? (
                      <ArrowDropUp style={{ color: "#81C784" }} />
                    ) : (
                      <ArrowDropDown style={{ color: "red" }} />
                    )}
                    <span
                      style={{
                        color: oneDayPerformance >= 0 ? "#81C784" : "red",
                        fontSize: "20px"
                      }}
                    >
                      {oneDayPerformance}%
                    </span>
                  </div>
                  <span
                    style={{
                      marginTop: "10px",
                      fontSize: "12px",
                      opacity: "0.4"
                    }}
                  >
                    24H Performance
                  </span>
                </div>
                <div
                  style={{ marginLeft: "25px", marginRight: "25px" }}
                  className="statWrapper"
                >
                  <div className="fullWidth flex">
                    {sevenDayPerformance >= 0 ? (
                      <ArrowDropUp style={{ color: "#81C784" }} />
                    ) : (
                      <ArrowDropDown style={{ color: "red" }} />
                    )}
                    <span
                      style={{
                        color: sevenDayPerformance >= 0 ? "#81C784" : "red",
                        fontSize: "20px"
                      }}
                    >
                      {sevenDayPerformance}%
                    </span>
                  </div>
                  <span
                    style={{
                      marginTop: "10px",
                      fontSize: "12px",
                      opacity: "0.4"
                    }}
                  >
                    7D Performance
                  </span>
                </div>
              </div>
              <div style={{ width: "25%" }} className="flexRight">
                <GradientPrice price={holdings} />
              </div>
            </Paper>
          )}

          <Paper className="portfolio7DayGraphPaper">
            <span className="sevenDayTitle">Past 7 Days</span>
            {coins.length > 0 && sevenDayPriceData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart width={"100%"} height={250} data={sevenDayPriceData}>
                  <Line
                    type="monotone"
                    dataKey="Total Holdings"
                    stroke={
                      sevenDayPriceData[sevenDayPriceData.length - 1][
                        "Total Holdings"
                      ] >= sevenDayPriceData[0]["Total Holdings"]
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
                      return `$${this.commarize(
                        parseInt(props.payload["Total Holdings"])
                      )}`;
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <span>Loading</span>
            )}
          </Paper>

          <Paper className="portfolioProfitGraphPaper">
            {coins.length > 0 ? (
              <ResponsiveContainer width="100%" height={274}>
                <BarChart
                  height={250}
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
                    {barChartData.map((coin, index) => {
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
          {userCoinTableList.length > 0 && (
            <div style={{ marginTop: "10px", marginBottom: "10px" }}>
              <Table
                handleEdit={(coinToEdit, portfolioId) =>
                  this.toggleEditModal(coinToEdit)
                }
                data={userCoinTableList}
                dataDisplayKeys={{
                  market_cap_rank: false,
                  name: true,
                  current_price: true,
                  price_change_percentage_1h_in_currency: true,
                  price_change_percentage_24h_in_currency: true,
                  price_change_percentage_7d_in_currency: true,
                  circulating_supply: false,
                  market_cap: false,
                  sparkline_in_7d: true,
                  roi: true,
                  holdings: true,
                  amountPurchased: true,
                  amountInvested: true,
                  edit: true
                }}
                presetFilters={{
                  rankingSortDirection: null,
                  nameSortDirection: null,
                  priceSortDirection: null,
                  oneHourSortDirection: null,
                  oneDaySortDirection: null,
                  sevenDaySortDirection: null,
                  holdingsSortDirection: "asc",
                  roiSortDirection: null,
                  amountInvestedSortDirection: null,
                  amountPurchasedSortDirection: null
                }}
                presetFilter="holdingsSortDirection"
              />
            </div>
          )}
        </div>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={isAddModalVisible}
          onClose={() => this.toggleAddModal()}
          className="modalContainer"
        >
          <div className="defaultModal">
            <div className="fullWidth flex">
              Adding
              <img
                src={coinToAdd && coins.filter(coin => coin.id === coinToAdd)[0].image}
                alt={coinToAdd && coins.filter(coin => coin.id === coinToAdd)[0].name}
                style={{
                  height: "24px",
                  width: "24px",
                  margin: "0 5px"
                }}
              />
              {coinToAdd} to Portfolio
            </div>
            <Input
              autoFocus
              label="Amount Invested"
              type="number"
              onChange={amountInvested =>
                this.handleUpdateAmountInvested(amountInvested)
              }
              handleSubmit={e => [
                e.preventDefault(),
                this.handleAddCoinToPortfolio()
              ]}
              error={null}
            />
            <Input
              label="Amount Purchased"
              type="number"
              onChange={amountPurchased =>
                this.handleUpdateAmountPurchased(amountPurchased)
              }
              handleSubmit={e => [
                e.preventDefault(),
                this.handleAddCoinToPortfolio()
              ]}
              error={null}
            />
            <div className="fullWidth flexRight">
              <GradientButton
                onClick={() => this.handleAddCoinToPortfolio()}
                variant="contained"
                color="purple"
              >
                Add
              </GradientButton>
            </div>
          </div>
        </Modal>
        {coinToEdit !== null && coinToEdit !== undefined && (
          <Modal
            aria-labelledby="edit-portfolio-holding"
            aria-describedby="Edit Your Portfolios Investment or Holding Amount"
            open={isEditModalVisible}
            onClose={() => this.toggleEditModal()}
            className="modalContainer"
          >
            <div className="defaultModal">
              <div className="fullWidth flex">
                Manage
                <img
                  src={coinToEdit.image}
                  alt={coinToEdit.name}
                  style={{
                    height: "24px",
                    width: "24px",
                    margin: "0 5px"
                  }}
                />
                {coinToEdit.name}
              </div>
              <Input
                autoFocus
                label="Amount Invested"
                type="number"
                value={
                  editAmountInvested === null
                    ? selectedPortfolio.coins[coinToEdit.portfolioId]
                        .amountInvested
                    : editAmountInvested
                }
                onChange={amountInvested =>
                  this.handleUpdateEditAmountInvested(amountInvested)
                }
                handleSubmit={e => [
                  e.preventDefault(),
                  this.handleEditCoinPortfolio(selectedPortfolio)
                ]}
                error={null}
              />
              <Input
                label="Amount Purchased"
                type="number"
                value={
                  editAmountPurchased === null
                    ? selectedPortfolio.coins[coinToEdit.portfolioId]
                        .amountPurchased
                    : editAmountPurchased
                }
                onChange={amountPurchased =>
                  this.handleUpdateEditAmountPurchased(amountPurchased)
                }
                handleSubmit={e => [
                  e.preventDefault(),
                  this.handleEditCoinPortfolio(selectedPortfolio)
                ]}
                error={null}
              />
              <div className="fullWidth flexRight">
                <Button
                  onClick={() => [
                    this.handleDeleteCoinFromPortfolio(),
                    this.toggleEditModal()
                  ]}
                  variant="outlined"
                  color="secondary"
                >
                  Delete
                  <DeleteIcon style={{ marginLeft: "5px" }} />
                </Button>
                <GradientButton
                  onClick={() =>
                    this.handleEditCoinPortfolio(selectedPortfolio)
                  }
                  variant="contained"
                  color="purple"
                >
                  Save
                </GradientButton>
              </div>
            </div>
          </Modal>
        )}
      </div>
    );
  }
}

Portfolio.defaultProps = {};

const mapStateToProps = state => ({
  user: state.auth.user,
  isAuthed: state.auth.isAuthed,
  portfolios: state.portfolios,
  coins: state.coins.top250,
});

const mapDispatchToProps = dispatch => ({
  authListener: payload => dispatch(authListener(payload)),
  fetchTop250: payload => dispatch(fetchTop250(payload)),
  addCoinToPortfolio: payload => dispatch(addCoinToPortfolio(payload)),
  editPortfolioCoin: payload => dispatch(editPortfolioCoin(payload)),
  deleteCoinFromPortfolio: payload =>
    dispatch(deleteCoinFromPortfolio(payload)),
  portfolioListner: payload => dispatch(portfolioListner(payload))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Portfolio);
