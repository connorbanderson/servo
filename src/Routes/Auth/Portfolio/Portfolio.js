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
  deleteCoinFromPortfolio,
  editPortfolioName,
  deletePortfolio
} from "../../../Redux/Actions/portfolios";
import { fetchTop250 } from "../../../Redux/Actions/coins";
import _ from "lodash";
import {
  round,
  calculateHoldings,
  generateSevenDayLineChartData,
  generatePerformanceStats,
  commarize,
  styleRedGreen,
  validatePortfolioName
} from "../../../utils";
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

class Portfolio extends Component {
  componentWillMount() {
    const {
      authListener,
      portfolioListner,
      user,
      match,
      fetchTop250
    } = this.props;
    //authListener();
    //fetchTop250();
  }

  state = {
    isAddModalVisible: false,
    isEditModalVisible: false,
    newPortfolioName: null,
    coinToAdd: null,
    isEditPortfolioModalVisible: false,
    coinToEdit: null,
    amountPurchased: "",
    amountInvested: "",
    editAmountPurchased: null,
    editAmountInvested: null,
    redirectUrl: null,
    amountInvestedError: false,
    amountPurchasedError: false,
    editAmountInvestedError: false,
    editAmountPurchasedError: false,
    newPortfolioNameError: false
  };

  handleUpdatePortfolioName = newName => {
    this.setState({ newPortfolioName: newName });
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

  toggleAddModal = selectedCoin => {
    const { isAddModalVisible } = this.state;
    const { coins } = this.props;
    this.setState({
      isAddModalVisible: !isAddModalVisible,
      coinToAdd: selectedCoin
    });
  };

  toggleEditModal = coin => {
    const { isEditModalVisible } = this.state;
    const { portfolios, match } = this.props;
    const selectedPortfolio =
      portfolios.portfolios !== null
        ? portfolios.portfolios[`-${match.params.id}`]
        : null;
    if (isEditModalVisible) {
      this.setState({
        isEditModalVisible: !isEditModalVisible,
        coinToEdit: null,
        editAmountPurchased: null,
        editAmountInvested: null
      });
    } else {
      this.setState({
        isEditModalVisible: !isEditModalVisible,
        coinToEdit: coin,
        editAmountPurchased:
          selectedPortfolio.coins[coin.portfolioId].amountPurchased,
        editAmountInvested:
          selectedPortfolio.coins[coin.portfolioId].amountInvested
      });
    }
  };

  handleAddCoinToPortfolio = () => {
    const { user, addCoinToPortfolio, match } = this.props;
    const { coinToAdd, amountInvested, amountPurchased } = this.state;

    const numberChecker = /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/;
    const isAmountInvestedValid = numberChecker.test(amountInvested);
    const isAmountPurchasedValid = numberChecker.test(amountPurchased);

    const payload = {
      accountKey: user.uid,
      portfolioKey: `-${match.params.id}`,
      coinInfo: {
        coin: coinToAdd,
        amountPurchased: parseInt(amountPurchased),
        amountInvested: parseInt(amountInvested)
      }
    };
    if (isAmountInvestedValid && isAmountPurchasedValid) {
      addCoinToPortfolio(payload);
    } else {
      this.setState({
        amountInvestedError: !isAmountInvestedValid,
        amountPurchasedError: !isAmountPurchasedValid
      });
    }
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
    const numberChecker = /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/;
    const isEditAmountInvestedValid = numberChecker.test(editAmountInvested);
    const isEditAmountPurchasedValid = numberChecker.test(editAmountPurchased);
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
    if (isEditAmountInvestedValid && isEditAmountPurchasedValid) {
      this.toggleEditModal();
      editPortfolioCoin(payload);
    } else {
      this.setState({
        editAmountInvestedError: !isEditAmountInvestedValid,
        editAmountPurchasedError: !isEditAmountPurchasedValid
      });
    }
  };

  handleEditPortfolio = selectedPortfolio => {
    const { newPortfolioName } = this.state;
    const { user, match, editPortfolioName } = this.props;
    const isNewPortfolioNameValid = validatePortfolioName(newPortfolioName);
    if (isNewPortfolioNameValid) {
      editPortfolioName({
        accountKey: user.uid,
        portfolioKey: `-${match.params.id}`,
        newName: newPortfolioName
      });
      this.setState({
        isEditPortfolioModalVisible: false
      });
    } else {
      this.setState({
        newPortfolioNameError: !isNewPortfolioNameValid
      });
    }
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
      let coinsObject = {};
      if (coinToAdd.length > 0) {
        const holdings =
          investment.amountPurchased * coinToAdd[0].current_price;
        coinsObject = {
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
      } else {
        coinsObject = {
          ...coinToAdd[0],
          holdings: 0,
          amountInvested: parseInt(investment.amountInvested),
          amountPurchased: parseInt(investment.amountPurchased),
          roi: 0,
          portfolioId: portfolioId,
          investmentName: investment.coin,
          id: investment.coin
        };
      }
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
      let profit = 0;
      let name = investment.coin;
      if (currentCoin) {
        profit =
          currentCoin.current_price * investment.amountPurchased -
          investment.amountInvested;
        name = currentCoin.name;
      }
      payload.push({
        name: name,
        investment: investment.amountInvested,
        profit: profit,
        total: profit + investment.amountInvested
      });
    });
    return _.orderBy(payload, "total", "desc");
  };

  longestSubsequence = (x, y) => {
    let subsequenceLength = 0;
    if (x.length === 0 || y.length === 0) return subsequenceLength;
    const xSubset = [...x].slice(1);
    const ySubset = [...y].slice(1);
    if (x[0] === y[0]) {
      subsequenceLength = 1 + this.longestSubsequence(xSubset, ySubset);
    } else {
      const pathOne = this.longestSubsequence(x, ySubset);
      const pathTwo = this.longestSubsequence(xSubset, y);
      subsequenceLength = pathOne >= pathTwo ? pathOne : pathTwo;
    }
    return subsequenceLength;
  };

  render() {
    const {
      portfolios,
      user,
      portfolioListner,
      coins,
      isAuthed,
      deletePortfolio,
      match
    } = this.props;
    const {
      isAddModalVisible,
      coinToAdd,
      coinToEdit,
      isEditModalVisible,
      amountPurchased,
      amountInvested,
      editAmountPurchased,
      editAmountInvested,
      redirectUrl,
      amountInvestedError,
      amountPurchasedError,
      editAmountInvestedError,
      editAmountPurchasedError,
      newPortfolioName,
      isEditPortfolioModalVisible,
      newPortfolioNameError
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
      oneHourPerformance = generatePerformanceStats(
        selectedPortfolio,
        "price_change_percentage_1h_in_currency",
        coins
      );
      oneDayPerformance = generatePerformanceStats(
        selectedPortfolio,
        "price_change_percentage_24h_in_currency",
        coins
      );
      sevenDayPerformance = generatePerformanceStats(
        selectedPortfolio,
        "price_change_percentage_7d_in_currency",
        coins
      );
      holdings = commarize(calculateHoldings(selectedPortfolio, coins));
      sevenDayPriceData = generateSevenDayLineChartData(
        selectedPortfolio,
        coins
      );
    }
    if (selectedPortfolio === undefined || !isAuthed)
      return <Redirect to="/" />;
    if (redirectUrl !== null) return <Redirect to={redirectUrl} />;

    const result = this.longestSubsequence("abc", "aedace");

    return (
      <div className="portfolioPageWrapper flexColStart">
        <Navbar user={user} />
        <div className="portfolioInnerWrapper">
          <div style={{ margin: "0 10px" }} className="fullWidth flexLeft" />
          <div
            style={{ margin: "0 10px" }}
            className="fullWidth flexSpaceBetween"
          >
            <div className="flexLeft">
              <Button
                onClick={() => this.setState({ redirectUrl: "/" })}
                style={{ marginRight: "20px" }}
              >
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
                <Button
                  onClick={() =>
                    this.setState({
                      isEditPortfolioModalVisible: !isEditPortfolioModalVisible
                    })
                  }
                  variant="outlined"
                  color="secondary"
                  style={{ marginLeft: "25px" }}
                >
                  Edit
                </Button>
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
                      return `$${commarize(
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
                src={
                  coinToAdd &&
                  coins.filter(coin => coin.id === coinToAdd)[0].image
                }
                alt={
                  coinToAdd &&
                  coins.filter(coin => coin.id === coinToAdd)[0].name
                }
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
              value={amountInvested}
              onChange={amountInvested =>
                this.handleUpdateAmountInvested(amountInvested)
              }
              handleSubmit={e => [
                e.preventDefault(),
                this.handleAddCoinToPortfolio()
              ]}
              error={amountInvestedError}
              helperText={
                amountInvestedError
                  ? "Please Enter a valid Positive Number"
                  : null
              }
              clearError={() =>
                this.setState({
                  amountInvestedError: false,
                  amountPurchasedError: false
                })
              }
            />
            <Input
              label="Amount Purchased"
              type="number"
              onChange={amountPurchased =>
                this.handleUpdateAmountPurchased(amountPurchased)
              }
              value={amountPurchased}
              handleSubmit={e => [
                e.preventDefault(),
                this.handleAddCoinToPortfolio()
              ]}
              error={amountPurchasedError}
              helperText={
                amountPurchasedError
                  ? "Please Enter a valid Positive Number"
                  : null
              }
              clearError={() =>
                this.setState({
                  amountInvestedError: false,
                  amountPurchasedError: false
                })
              }
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
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={isEditPortfolioModalVisible}
          onClose={() => this.setState({ isEditPortfolioModalVisible: false })}
          className="modalContainer"
        >
          <div className="defaultModal">
            <div className="fullWidth flex">
              <b> Edit Portfolio </b>
            </div>
            <Input
              autoFocus
              label="Name"
              value={
                newPortfolioName !== null
                  ? newPortfolioName
                  : selectedPortfolio.name
              }
              onChange={name => this.handleUpdatePortfolioName(name)}
              handleSubmit={e => [
                e.preventDefault(),
                this.handleEditPortfolio()
              ]}
              error={newPortfolioNameError}
              helperText={
                newPortfolioNameError ? "Please Enter a valid name" : null
              }
              clearError={() =>
                this.setState({
                  newPortfolioNameError: false
                })
              }
            />
            <div className="fullWidth flexRight" style={{ marginTop: "10px" }}>
              <Button
                onClick={() => [
                  deletePortfolio({
                    accountKey: user.uid,
                    portfolioKey: `-${match.params.id}`,
                  }),
                  this.setState({isEditModalVisible: false})
                ]}
                variant="outlined"
                color="secondary"
                size="small"
              >
                Delete
                <DeleteIcon style={{ marginLeft: "5px" }} />
              </Button>
              <GradientButton
                onClick={() => this.handleEditPortfolio()}
                variant="contained"
                color="purple"
              >
                Save
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
                error={editAmountInvestedError}
                helperText={
                  editAmountInvestedError
                    ? "Please Enter a valid Positive Number"
                    : null
                }
                clearError={() =>
                  this.setState({
                    editAmountInvestedError: false,
                    editAmountPurchasedError: false
                  })
                }
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
                error={editAmountPurchasedError}
                helperText={
                  editAmountPurchasedError
                    ? "Please Enter a valid Positive Number"
                    : null
                }
                clearError={() =>
                  this.setState({
                    editAmountInvestedError: false,
                    editAmountPurchasedError: false
                  })
                }
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
  coins: state.coins.top250
});

const mapDispatchToProps = dispatch => ({
  authListener: payload => dispatch(authListener(payload)),
  fetchTop250: payload => dispatch(fetchTop250(payload)),
  addCoinToPortfolio: payload => dispatch(addCoinToPortfolio(payload)),
  editPortfolioCoin: payload => dispatch(editPortfolioCoin(payload)),
  deleteCoinFromPortfolio: payload =>
  dispatch(deleteCoinFromPortfolio(payload)),
  portfolioListner: payload => dispatch(portfolioListner(payload)),
  editPortfolioName: payload => dispatch(editPortfolioName(payload)),
  deletePortfolio: payload => dispatch(deletePortfolio(payload))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Portfolio);
