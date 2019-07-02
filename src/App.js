import React, { Component } from "react";
import _ from "lodash";
import { connect } from "react-redux";
import { addMessage, getMessages } from "./Redux/Actions/messages";
import { authListener } from "./Redux/Actions/auth";
import { portfolioListner, createPortfolio } from "./Redux/Actions/portfolios";
import { fetchTop250 } from "./Redux/Actions/coins";
import fire from "./fire";
import firebase from "firebase";
import "./App.scss";
import { logout } from "./Redux/Actions/auth";
import Login from "./Routes/NoAuth/Login/login.js";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import MarketCard from "./Components/MarketCard";
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
import Autocomplete from "./Components/Autocomplete";
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
import Table from "./Components/Table";
import Loader from "./Components/Loader";
import GradientButton from "./Components/GradientButton";
import Modal from "@material-ui/core/Modal";
import Input from "./Components/Input/input.js";

import Add from "@material-ui/icons/Add";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

import logo from "./logo.svg";

class App extends Component {
  componentWillMount() {
    const { authListener, fetchTop250 } = this.props;
    fetchTop250();
    authListener();
  }

  state = {
    isLogin: false,
    user: null,
    email: null,
    password: null,
    sortedCoins: null,
    isAvatarMenuOpen: false,
    anchorEl: null,
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
    newPortfolioName: ""
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

  toggleAvatarMenu = () =>
    this.setState({ isAvatarMenuOpen: !this.state.isAvatarMenuOpen });

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleClick = e => {
    this.setState({ anchorEl: e.currentTarget });
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

  handleRankingSort = () => {
    const { rankingSort, coins, emptyFilters } = this.state;
    if (rankingSort === null) {
      let sortedCoins = _.orderBy(coins, ["market_cap_rank"], ["desc"]);
      this.setState({
        ...emptyFilters,
        rankingSort: "desc",
        sortedCoins: sortedCoins
      });
    } else {
      if (rankingSort === "asc") {
        let sortedCoins = _.orderBy(coins, ["market_cap_rank"], ["desc"]);
        this.setState({
          ...emptyFilters,
          rankingSort: "desc",
          sortedCoins: sortedCoins
        });
      } else {
        let sortedCoins = _.orderBy(coins, ["market_cap_rank"], ["asc"]);
        this.setState({
          ...emptyFilters,
          rankingSort: "asc",
          sortedCoins: sortedCoins
        });
      }
    }
  };

  handleNameSort = () => {
    const { nameSort, coins, emptyFilters } = this.state;
    if (nameSort === null) {
      let sortedCoins = _.orderBy(coins, ["name"], ["desc"]);
      this.setState({
        ...emptyFilters,
        nameSort: "desc",
        sortedCoins: sortedCoins
      });
    } else {
      if (nameSort === "asc") {
        let sortedCoins = _.orderBy(coins, ["name"], ["desc"]);
        this.setState({
          ...emptyFilters,
          nameSort: "desc",
          sortedCoins: sortedCoins
        });
      } else {
        let sortedCoins = _.orderBy(coins, ["name"], ["asc"]);
        this.setState({
          ...emptyFilters,
          nameSort: "asc",
          sortedCoins: sortedCoins
        });
      }
    }
  };

  handlePriceSort = () => {
    const { priceSort, coins, emptyFilters } = this.state;
    if (priceSort === null) {
      let sortedCoins = _.orderBy(coins, ["current_price"], ["desc"]);
      this.setState({
        ...emptyFilters,
        priceSort: "desc",
        sortedCoins: sortedCoins
      });
    } else {
      if (priceSort === "asc") {
        let sortedCoins = _.orderBy(coins, ["current_price"], ["desc"]);
        this.setState({
          ...emptyFilters,
          priceSort: "desc",
          sortedCoins: sortedCoins
        });
      } else {
        let sortedCoins = _.orderBy(coins, ["current_price"], ["asc"]);
        this.setState({
          ...emptyFilters,
          priceSort: "asc",
          sortedCoins: sortedCoins
        });
      }
    }
  };

  handleOneHourSort = () => {
    const { oneHourSort, coins, emptyFilters } = this.state;
    if (oneHourSort === null) {
      let sortedCoins = _.orderBy(
        coins,
        ["price_change_percentage_1h_in_currency"],
        ["desc"]
      );
      this.setState({
        ...emptyFilters,
        oneHourSort: "desc",
        sortedCoins: sortedCoins
      });
    } else {
      if (oneHourSort === "asc") {
        let sortedCoins = _.orderBy(
          coins,
          ["price_change_percentage_1h_in_currency"],
          ["desc"]
        );
        this.setState({
          ...emptyFilters,
          oneHourSort: "desc",
          sortedCoins: sortedCoins
        });
      } else {
        let sortedCoins = _.orderBy(
          coins,
          ["price_change_percentage_1h_in_currency"],
          ["asc"]
        );
        this.setState({
          ...emptyFilters,
          oneHourSort: "asc",
          sortedCoins: sortedCoins
        });
      }
    }
  };

  handleOneDaySort = () => {
    const { oneDaySort, coins, emptyFilters } = this.state;
    if (oneDaySort === null) {
      let sortedCoins = _.orderBy(
        coins,
        ["price_change_percentage_24h_in_currency"],
        ["desc"]
      );
      this.setState({
        ...emptyFilters,
        oneDaySort: "desc",
        sortedCoins: sortedCoins
      });
    } else {
      if (oneDaySort === "asc") {
        let sortedCoins = _.orderBy(
          coins,
          ["price_change_percentage_24h_in_currency"],
          ["desc"]
        );
        this.setState({
          ...emptyFilters,
          oneDaySort: "desc",
          sortedCoins: sortedCoins
        });
      } else {
        let sortedCoins = _.orderBy(
          coins,
          ["price_change_percentage_24h_in_currency"],
          ["asc"]
        );
        this.setState({
          ...emptyFilters,
          oneDaySort: "asc",
          sortedCoins: sortedCoins
        });
      }
    }
  };

  handleSevenDaySort = () => {
    const { sevenDaySort, coins, emptyFilters } = this.state;
    if (sevenDaySort === null) {
      let sortedCoins = _.orderBy(
        coins,
        ["price_change_percentage_7d_in_currency"],
        ["desc"]
      );
      this.setState({
        ...emptyFilters,
        sevenDaySort: "desc",
        sortedCoins: sortedCoins
      });
    } else {
      if (sevenDaySort === "asc") {
        let sortedCoins = _.orderBy(
          coins,
          ["price_change_percentage_7d_in_currency"],
          ["desc"]
        );
        this.setState({
          ...emptyFilters,
          sevenDaySort: "desc",
          sortedCoins: sortedCoins
        });
      } else {
        let sortedCoins = _.orderBy(
          coins,
          ["price_change_percentage_7d_in_currency"],
          ["asc"]
        );
        this.setState({
          ...emptyFilters,
          sevenDaySort: "asc",
          sortedCoins: sortedCoins
        });
      }
    }
  };

  render() {
    const {
      addMessage,
      logout,
      isAuthed,
      user,
      coins,
      portfolios,
      authListener,
      portfolioListner
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
      newPortfolioName
    } = this.state;
    const whichCoins = sortedCoins !== null ? sortedCoins : coins;
    if (coins.length === 0) return <Loader />;
    if (isAuthed) {
      console.log('Initializing the portfolio Listener');
      portfolioListner(user.uid)
    }
    console.log('keyssss', portfolios && Object.keys(portfolios));
    return (
      <div className="App">
        {!isAuthed ? (
          <Login />
        ) : (
          <div className="dashboardWrapper">
            <nav className="dashboardNavbar">
              <div className="navbarInnerWrapper">
                <div className="lhs">
                  <img
                    src={logo}
                    alt="navbar logo"
                    style={{ height: "32px", width: "32px" }}
                  />
                </div>
                <div className="rhs flexRight">
                  <IconButton
                    aria-label="Delete"
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={e => this.handleClick(e)}
                    onMouseOver={e => this.handleClick(e)}
                  >
                    <Avatar
                      style={{ height: "32px", width: "32px" }}
                      alt="Remy Sharp"
                      src="https://scontent.fyyc4-1.fna.fbcdn.net/v/t1.15752-9/53270755_401825197043838_4318937078982246400_n.png?_nc_cat=105&_nc_ht=scontent.fyyc4-1.fna&oh=9e34adadc4dcb7d326ef65afb4b902d7&oe=5D893ECD"
                    />
                    <ExpandMore style={{ marginLeft: "3px" }} />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    id="simple-menu"
                    open={Boolean(anchorEl)}
                    onClose={() => this.handleClose()}
                    style={{ marginTop: "44px" }}
                    onMouseLeave={() => this.handleClose()}
                  >
                    <MenuItem onClick={() => this.handleClose()}>
                      <Person style={{ marginRight: "5px" }} />
                      Profile
                    </MenuItem>
                    <MenuItem onClick={() => [this.handleClose(), logout()]}>
                      <ExitToApp style={{ marginRight: "5px" }} />
                      Logout
                    </MenuItem>
                  </Menu>
                </div>
              </div>
            </nav>
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
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ background: "white" }}
                    onClick={() => this.toggleAddModal()}
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
              </div>

              {portfolios && Object.keys(portfolios).map(key => (
                <Paper className="portfolioPaper">
                  <div
                    style={{ marginBottom: "15px" }}
                    className="flexSpaceBetweenStart"
                  >
                    <div className="flexColLeft">
                      <div className="flexLeft">
                        <h2>{portfolios[key].name}</h2>
                        <div className="flex marginTS">
                          <ArrowDropUp style={{ color: "#81C784" }} />
                          <span style={{ color: "#81C784", fontSize: "22px" }}>
                            {this.round(
                              coins[1].price_change_percentage_24h_in_currency
                            )}
                            %
                          </span>
                        </div>
                      </div>
                      <div className="customRadioWrapper flex marginTS">
                        <div className="radioButton flex">
                          <span>1H</span>
                        </div>
                        <div className="radioButton radioButtonActive flex">
                          <span>24H</span>
                        </div>
                        <div className="radioButton flex">
                          <span>7D</span>
                        </div>
                      </div>
                    </div>
                    <h1
                      style={{ fontSize: "36px" }}
                      className="primaryGradientText"
                    >
                      $130,449
                    </h1>
                  </div>
                  {coins.length > 0 && (
                    <LineChart
                      width={420}
                      height={120}
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
                  )}
                  <div className="fullWidth flexRight marginTM marginBM">
                    <div style={{ marginLeft: "30px" }} className="statWrapper">
                      <div
                        style={{ flex: "0 0 auto" }}
                        className="fullWidth flex"
                      >
                        <img
                          className="marginRM"
                          src={coins[0].image}
                          style={{ height: "24px", width: "24px" }}
                        />
                        <span style={{ color: "#81C784" }}>
                          {this.round(
                            coins[0].price_change_percentage_24h_in_currency
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
                    <div style={{ marginLeft: "30px" }} className="statWrapper">
                      <div className="fullWidth flex">
                        <img
                          className="marginRM"
                          src={coins[5].image}
                          style={{ height: "24px", width: "24px" }}
                        />
                        <span style={{ color: "#e57373" }}>
                          {this.round(
                            coins[5].price_change_percentage_24h_in_currency
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
                  <div className="botActionMenu flexRight">
                    <Button color="primary">Manage</Button>
                  </div>
                </Paper>
              ))}

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
                  data={coins}
                  dataDisplayKeys={{
                    market_cap_rank: true,
                    name: true,
                    current_price: true,
                    price_change_percentage_1h_in_currency: true,
                    price_change_percentage_24h_in_currency: true,
                    price_change_percentage_7d_in_currency: true,
                    circulating_supply: true,
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
                    oneHourSortDirection: null,
                    oneDaySortDirection: null,
                    sevenDaySortDirection: null,
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
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  coins: state.coins.top100,
  portfolios: state.portfolios.portfolios,
  user: state.auth.user,
  isAuthed: state.auth.isAuthed
});

const mapDispatchToProps = dispatch => ({
  addMessage: payload => dispatch(addMessage(payload)),
  authListener: payload => dispatch(authListener(payload)),
  portfolioListner: payload => dispatch(portfolioListner(payload)),
  createPortfolio: (accountKey, payload) =>
    dispatch(createPortfolio(accountKey, payload)),
  fetchTop250: payload => dispatch(fetchTop250(payload)),
  logout: () => dispatch(logout())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
