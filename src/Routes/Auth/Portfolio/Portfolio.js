// Frontend Libs
import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import { connect } from "react-redux";
import { authListener } from "../../../Redux/Actions/auth";
import {
  portfolioListner,
  addCoinToPortfolio,
  editPortfolioCoin
} from "../../../Redux/Actions/portfolios";
import _ from "lodash";

// Components
import Navbar from "../../../Components/Navbar";
import Table from "../../../Components/Table";
import GradientPrice from "../../../Components/GradientPrice";
import GradientButton from "../../../Components/GradientButton";
import Autocomplete from "../../../Components/Autocomplete";
import Input from "../../../Components/Input/input.js";

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

// Style
import "./Portfolio.scss";
import "../../../index.scss";

class Portfolio extends Component {
  componentWillMount() {
    const { authListener, portfolioListner, user } = this.props;
    this.getCoins();
    authListener();
  }

  state = {
    coins: [],
    coinsObject: null,
    isAddModalVisible: false,
    coinToAdd: null,
    isEditModalVisible: false,
    coinToEdit: null,
    amountPurchased: 0,
    amountInvested: 0,
    editAmountPurchased: null,
    editAmountInvested: null
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

  getCoins = () => {
    const reqUrl =
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=USD&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=1h,24h,7d,30d,200d,1y";
    fetch(reqUrl)
      .then(res => res.json())
      .then(
        coins => {
          const coinsObject = {};
          coins.map(coin => (coinsObject[coin.id] = coin));
          this.setState({ coins: coins, coinsObject: coinsObject });
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
    return payload;
  };

  toggleAddModal = coin => {
    const { isAddModalVisible } = this.state;
    this.setState({ isAddModalVisible: !isAddModalVisible, coinToAdd: coin });
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
    const { user, addCoinToPortfolio } = this.props;
    const { coinToAdd, amountInvested, amountPurchased } = this.state;
    const payload = {
      accountKey: user.uid,
      coinInfo: {
        coin: coinToAdd,
        amountPurchased: parseInt(amountPurchased),
        amountInvested: parseInt(amountInvested)
      }
    };
    addCoinToPortfolio(payload);
  };

  handleEditCoinPortfolio = () => {
    const { user, addCoinToPortfolio, portfolios } = this.props;
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
      coinKey: coinToEdit.portfolioId,
      updatedObject: {
        coin: coinToEdit.id,
        amountPurchased:
          editAmountPurchased !== null && editAmountPurchased !== ""
            ? parseInt(editAmountPurchased)
            : portfolios[1].coins[coinToEdit.portfolioId].amountPurchased,
        amountInvested:
          editAmountInvested !== null && editAmountInvested !== ""
            ? parseInt(editAmountInvested)
            : portfolios[1].coins[coinToEdit.portfolioId].amountInvested
      }
    };
    this.toggleEditModal();
    editPortfolioCoin(payload);
  };

  generatePortfolioTable = portfolio => {
    const { coins } = this.state;
    let payload = [];
    if (portfolio === undefined) return [];
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

  render() {
    const { portfolios, user, portfolioListner } = this.props;
    const {
      coins,
      coinsObject,
      isAddModalVisible,
      coinToAdd,
      coinToEdit,
      isEditModalVisible,
      amountPurchased,
      amountInvested,
      editAmountPurchased,
      editAmountInvested
    } = this.state;
    const barChartData = this.prepBarGraphData(coins);
    let userCoinTableList = [];
    if (user !== null && portfolios === null) {
      portfolioListner(user.uid);
    }
    if (user !== null && portfolios !== null && coins.length > 0) {
      userCoinTableList = this.generatePortfolioTable(portfolios[1]);
    }
    return (
      <div className="portfolioPageWrapper flexColStart">
        <Navbar />
        <div className="portfolioInnerWrapper">
          <div className="fullWidth flexRight">
            <div style={{ width: "300px", paddingBottom: "10px" }}>
              <Autocomplete
                style={{ position: "relative", zIndex: 99 }}
                coins={coins}
                onAdd={coin => this.toggleAddModal(coin)}
              />
            </div>
          </div>
          {userCoinTableList.length > 0 && (
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
                price_change_percentage_7d_in_currency: false,
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
                holdingsSortDirection: true,
                roiSortDirection: null,
                amountInvestedSortDirection: null,
                amountPurchasedSortDirection: null
              }}
            />
          )}
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
                src={coinToAdd && coinsObject[coinToAdd].image}
                alt={coinToAdd && coinsObject[coinToAdd].name}
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
                    ? portfolios[1].coins[coinToEdit.portfolioId].amountInvested
                    : editAmountInvested
                }
                onChange={amountInvested =>
                  this.handleUpdateEditAmountInvested(amountInvested)
                }
                handleSubmit={e => [
                  e.preventDefault(),
                  this.handleEditCoinPortfolio()
                ]}
                error={null}
              />
              <Input
                label="Amount Purchased"
                type="number"
                value={
                  editAmountPurchased === null
                    ? portfolios[1].coins[coinToEdit.portfolioId]
                        .amountPurchased
                    : editAmountPurchased
                }
                onChange={amountPurchased =>
                  this.handleUpdateEditAmountPurchased(amountPurchased)
                }
                handleSubmit={e => [
                  e.preventDefault(),
                  this.handleEditCoinPortfolio()
                ]}
                error={null}
              />
              <div className="fullWidth flexRight">
                <GradientButton
                  onClick={() => this.handleEditCoinPortfolio()}
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
  portfolios: state.portfolios.portfolios
});

const mapDispatchToProps = dispatch => ({
  authListener: payload => dispatch(authListener(payload)),
  addCoinToPortfolio: payload => dispatch(addCoinToPortfolio(payload)),
  editPortfolioCoin: payload => dispatch(editPortfolioCoin(payload)),
  portfolioListner: payload => dispatch(portfolioListner(payload))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Portfolio);
