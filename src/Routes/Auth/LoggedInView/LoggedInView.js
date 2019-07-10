import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import _ from "lodash";
import { connect } from "react-redux";
import { createPortfolio } from "../../../Redux/Actions/portfolios";
import fire from "../../../fire";
import firebase from "firebase";
import "./LoggedInView.scss";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import MarketCard from "../../../Components/MarketCard";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import DirectionsIcon from "@material-ui/icons/Directions";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Checkbox from "@material-ui/core/Checkbox";
import Avatar from "@material-ui/core/Avatar";
import Tooltip from "@material-ui/core/Tooltip";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import DeleteIcon from "@material-ui/icons/Delete";
import ExpandMore from "@material-ui/icons/ExpandMore";
import ExitToApp from "@material-ui/icons/ExitToApp";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import ArrowDropUp from "@material-ui/icons/ArrowDropUp";
import ArrowDropDown from "@material-ui/icons/ArrowDropDown";
import Person from "@material-ui/icons/Person";
import Radio from "@material-ui/core/Radio";
import Table from "../../../Components/Table";
import Loader from "../../../Components/Loader";
import GradientButton from "../../../Components/GradientButton";
import Modal from "@material-ui/core/Modal";
import Input from "../../../Components/Input/input.js";
import Add from "@material-ui/icons/Add";
import Navbar from "../../../Components/Navbar";
import history from "../../../history";
import {
  calculateHoldings,
  generateSevenDayLineChartData,
  generatePerformanceStats,
  commarize,
  calculatePerformers,
  styleRedGreen
} from "../../../utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

import logo from "./logo.svg";

class LoggedInView extends Component {
  state = {
    sortedCoins: null,
    rankingSort: "asc",
    nameSort: null,
    priceSort: null,
    oneHourSort: null,
    oneDaySort: null,
    sevenDaySort: null,
    emptyFilters: {
      rankingSort: null,
      nameSort: null,
      priceSort: null,
      oneHourSort: null,
      oneDaySort: null,
      sevenDaySort: null
    },
    isAddModalVisible: false,
    newPortfolioName: "",
    redirectUrl: null
  };

  handleAddNewPortfolio = () => {
    const { newPortfolioName } = this.state;
    const { createPortfolio, user } = this.props;
    const payload = {
      name: newPortfolioName,
      coins: {
        dummyData: {
          amountInvested: 10000,
          amountPurchased: 1,
          coin: "bitcoin"
        }
      }
    };
    createPortfolio(user.uid, payload);
  };

  handleUpdateNewPortfolioName = name => {
    this.setState({ newPortfolioName: name });
  };

  toggleAddModal = () => {
    this.setState({ isAddModalVisible: !this.state.isAddModalVisible });
  };

  prepGraphData = graphData => {
    const payload = [];
    graphData.map(dataPoint => {
      payload.push({ pv: dataPoint });
    });
    return payload;
  };

  round = number => {
    if (number === null) return number;
    if (number > 1) {
      return (Math.round(number * 100) / 100).toFixed(2);
    } else {
      return number.toFixed(2);
    }
  };

  handleColor = number => {
    if (number >= 0) {
      return "#81C784";
    } else return "#e57373";
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

  numberWithCommas = number => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  render() {
    const {
      addMessage,
      isAuthed,
      user,
      coins,
      portfolios,
      authListener,
      portfolioListner,
      kappa
    } = this.props;
    const {
      isLogin,
      sortedCoins,
      isAvatarMenuOpen,
      anchorEl,
      rankingSort,
      nameSort,
      priceSort,
      oneHourSort,
      oneDaySort,
      sevenDaySort,
      isAddModalVisible,
      newPortfolioName,
      redirectUrl
    } = this.state;
    const whichCoins = sortedCoins !== null ? sortedCoins : coins;
    const hasCreatedMaxPortfolios = Object.keys(portfolios).length >= 2;
    if (redirectUrl !== null) return <Redirect to={redirectUrl} />;
    if (!isAuthed) return <Redirect to="/" />;
    console.log(user);
    return (
      <div className="App">
        <div className="dashboardWrapper">
          <Navbar />
          <div className="dashboardInnerWrapper">
            <div
              style={{ margin: "0 10px", zIndex: 5 }}
              className="fullWidth flexSpaceBetween"
            >
              <ButtonGroup
                className="customButtonGroup"
                variant="contained"
                size="small"
                aria-label="Small contained button group"
              >
                <Button
                  className="currencyButtonSelected"
                  style={{ backgroundColor: "white" }}
                >
                  USD
                </Button>
                <Button
                  disabled
                  className="currencyButton"
                  style={{ backgroundColor: "white" }}
                >
                  CAD
                </Button>
              </ButtonGroup>
              <div
                className="flexRight"
                style={{ width: "300px", paddingBottom: "10px" }}
              >
                {hasCreatedMaxPortfolios ? (
                  <Tooltip
                    title="Maxium number of portfolios created."
                    placement="bottom-end"
                  >
                    <div>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => this.toggleAddModal()}
                        disabled={hasCreatedMaxPortfolios}
                      >
                        <Add style={{ fontSize: "22px", color: "#E94057" }} />
                        <span
                          className="primaryGradientText"
                          style={{ fontSize: "14px", marginLeft: "5px" }}
                        >
                          Portfolio
                        </span>
                      </Button>
                    </div>
                  </Tooltip>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => this.toggleAddModal()}
                    disabled={hasCreatedMaxPortfolios}
                    style={{ backgroundColor: "white" }}
                  >
                    <Add style={{ fontSize: "22px", color: "#E94057" }} />
                    <span
                      className="primaryGradientText"
                      style={{ fontSize: "14px", marginLeft: "5px" }}
                    >
                      Portfolio
                    </span>
                  </Button>
                )}
              </div>
            </div>

            {Object.keys(portfolios).map(portfolioKey => {
              const portfolio = portfolios[portfolioKey];
              const lineChartData = generateSevenDayLineChartData(
                portfolio,
                coins
              );
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
              const styleColor = performancePercentage >= 0 ? "#81C784" : "red";
              const holdings = commarize(
                calculateHoldings(portfolios[portfolioKey], coins)
              )
              console.log(topPerformer);
              return (
                <Paper className="portfolioPaper">
                  <div
                    style={{ marginBottom: "15px" }}
                    className="flexSpaceBetweenStart"
                  >
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
                            {Math.abs(performancePercentage)}%
                          </span>
                        </div>
                      </div>
                      <div className="flexLeft marginTS">
                        <small style={{opacity: 0.3, fontWeight: 'bold'}}>Past 7 Days</small>
                      </div>
                    </div>
                    <h1
                      style={{ fontSize: "36px" }}
                      className="primaryGradientText"
                    >
                      ${holdings !== '' ? holdings : 0}
                    </h1>
                  </div>
                  <LineChart width={420} height={120} data={lineChartData}>
                    <Line
                      type="monotone"
                      dataKey="Total Holdings"
                      stroke={styleColor}
                      strokeWidth={2}
                      dot={false}
                    />
                    <YAxis
                      type="number"
                      domain={["dataMin", "dataMax"]}
                      hide={true}
                    />
                  </LineChart>
                  {performers.length < 2 && (
                    <div
                      style={{ height: "45px" }}
                      className="fullWidth flexRight marginTM marginBM"
                    />
                  )}
                  {performers.length >= 2 && (
                    <div className="fullWidth flexRight marginTM marginBM">
                      <div
                        style={{ marginLeft: "30px" }}
                        className="statWrapper"
                      >
                        <div
                          style={{ flex: "0 0 auto" }}
                          className="fullWidth flex"
                        >
                          <img
                            className="marginRM"
                            src={topPerformer && topPerformer.image}
                            style={{ height: "24px", width: "24px" }}
                          />
                          <span
                            style={{
                              color: styleRedGreen(
                                topPerformer.price_change_percentage_7d_in_currency
                              )
                            }}
                          >
                            {this.round(
                              topPerformer.price_change_percentage_7d_in_currency
                            )}
                            %
                          </span>
                        </div>
                        <span
                          style={{
                            marginTop: "10px",
                            fontSize: "12px",
                            opacity: "0.4"
                          }}
                        >
                          Top Performer
                        </span>
                      </div>

                      <div
                        style={{ marginLeft: "30px" }}
                        className="statWrapper"
                      >
                        <div className="fullWidth flex">
                          <img
                            className="marginRM"
                            src={worstPerformer.image}
                            style={{ height: "24px", width: "24px" }}
                          />
                          <span
                            style={{
                              color: styleRedGreen(
                                worstPerformer.price_change_percentage_7d_in_currency
                              )
                            }}
                          >
                            {this.round(
                              worstPerformer.price_change_percentage_7d_in_currency
                            )}
                            %
                          </span>
                        </div>
                        <span
                          style={{
                            marginTop: "10px",
                            fontSize: "12px",
                            opacity: "0.4"
                          }}
                        >
                          Worst Performer
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="botActionMenu flexRight">
                    <Button
                      onClick={() =>
                        this.setState({
                          redirectUrl: `/portfolio/${portfolioKey.substring(1)}`
                        })
                      }
                      color="primary"
                    >
                      Manage
                    </Button>
                  </div>
                </Paper>
              );
            })}

            <Paper
              className="paperTableWrapper"
              style={{
                backgroundColor: "white",
                zIndex: 2,
                overflow: "hidden",
                marginTop: "20px"
              }}
            >
              <Table
                data={coins.slice(0, 49)}
                dataDisplayKeys={{
                  market_cap_rank: true,
                  name: true,
                  current_price: true,
                  total_volume: true,
                  price_change_percentage_1h_in_currency: true,
                  price_change_percentage_24h_in_currency: true,
                  price_change_percentage_7d_in_currency: true,
                  circulating_supply: true,
                  ath_change_percentage: true,
                  market_cap: false,
                  sparkline_in_7d: true,
                  roi: false,
                  holdings: false,
                  amountPurchased: false,
                  amountInvested: false,
                  edit: false
                }}
                presetFilters={{
                  rankingSortDirection: "asc",
                  nameSortDirection: null,
                  priceSortDirection: null,
                  volumeSortDirection: null,
                  oneHourSortDirection: null,
                  oneDaySortDirection: null,
                  sevenDaySortDirection: null,
                  athSortDirection: null,
                  holdingsSortDirection: null,
                  roiSortDirection: null,
                  amountInvestedSortDirection: null,
                  amountPurchasedSortDirection: null
                }}
                presetFilter="rankingSortDirection"
              />
            </Paper>
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
                <b> New Portfolio </b>
              </div>
              <Input
                autoFocus
                label="Name"
                value={newPortfolioName}
                onChange={name => this.handleUpdateNewPortfolioName(name)}
                handleSubmit={e => [
                  e.preventDefault(),
                  this.handleAddNewPortfolio()
                ]}
                error={null}
              />
              <div
                className="fullWidth flexRight"
                style={{ marginTop: "10px" }}
              >
                <GradientButton
                  onClick={() => this.handleAddNewPortfolio()}
                  variant="contained"
                  color="purple"
                >
                  Add
                </GradientButton>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  coins: state.coins.top250,
  portfolios: state.portfolios.portfolios,
  user: state.auth.user,
  isAuthed: state.auth.isAuthed
});

const mapDispatchToProps = dispatch => ({
  createPortfolio: (accountKey, payload) => dispatch(createPortfolio(accountKey, payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoggedInView);
