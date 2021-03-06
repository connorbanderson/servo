// Frontend Libs
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { authListener } from "../../../Redux/Actions/auth";
import { portFolioTableDisplayKeys } from "../../../constants.js";
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
  calculateHoldings,
  generateSevenDayLineChartData,
  generatePerformanceStats,
  commarize,
  validatePortfolioName
} from "../../../utils";
// Components
import Navbar from "../../../Components/Navbar";
import Table from "../../../Components/Table";
import Loader from "../../../Components/Loader";
import GradientPrice from "../../../Components/GradientPrice";
import GradientButton from "../../../Components/GradientButton";
import GradientText from "../../../Components/GradientText";
import Autocomplete from "../../../Components/Autocomplete";
import ArrowStat from "../../../Components/ArrowStat";
import Input from "../../../Components/Input/input.js";
import ProfitChart from "../../../Components/ProfitChart";
import AddCoinPortfolioModal from "../../../Components/AddCoinPortfolioModal";
import SevenDayGraph from "../../../Components/SevenDayGraph";
import DeleteIcon from "@material-ui/icons/Delete";
import Paper from "@material-ui/core/Paper";
import Modal from "@material-ui/core/Modal";
import KeyboardBackspace from "@material-ui/icons/KeyboardBackspace";
import Button from "@material-ui/core/Button";
// Style
import "./Portfolio.scss";

class Portfolio extends Component {
  componentWillMount() {
    const { authListener, fetchTop250 } = this.props;
    authListener();
    fetchTop250();
    console.log("PORTFOLIO DID MOUNT");
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

  handleEditCoinPortfolio = selectedPortfolio => {
    const { user, match } = this.props;
    const {
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
    const { user, match } = this.props;
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

  render() {
    const {
      portfolios,
      user,
      portfolioListner,
      coins,
      isAuthed,
      match
    } = this.props;
    const {
      isAddModalVisible,
      coinToAdd,
      coinToEdit,
      isEditModalVisible,
      editAmountPurchased,
      editAmountInvested,
      redirectUrl,
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

    const emptyPortfolio = selectedPortfolio.coins === undefined;
    return (
      <div className="portfolio">
        <Navbar user={user} />
        <div className="portfolio__wrapper">
          <div className="portfolio__topRow">
            <Button onClick={() => this.setState({ redirectUrl: "/" })}>
              <KeyboardBackspace />
              <span style={{ marginLeft: "4px" }}>Back</span>
            </Button>
            <div style={{ width: "300px", paddingBottom: "10px" }}>
              <Autocomplete
                style={{ position: "relative", zIndex: 99 }}
                coins={coins}
                onAdd={coin => this.toggleAddModal(coin)}
              />
            </div>
          </div>

          <Paper className="portfolioTopPaper flexSpaceBetween">
            <div style={{ width: "25%" }} className="flexLeft">
              <GradientText text={selectedPortfolio.name} />
            </div>
            <div className="flex">
              <ArrowStat
                performance={oneHourPerformance}
                emptyPortfolio={emptyPortfolio}
                text="1H Performance"
              />
              <ArrowStat
                performance={oneDayPerformance}
                emptyPortfolio={emptyPortfolio}
                text="24H Performance"
              />
              <ArrowStat
                performance={sevenDayPerformance}
                emptyPortfolio={emptyPortfolio}
                text="7D Performance"
              />
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
                color="primary"
                style={{ marginLeft: "25px" }}
              >
                Edit
              </Button>
            </div>
          </Paper>
   

          <SevenDayGraph coins={coins} data={sevenDayPriceData} />
          <ProfitChart coins={coins} data={barChartData} />

          {userCoinTableList.length > 0 && (
            <div style={{ marginTop: "10px", marginBottom: "10px" }}>
              <Table
                handleEdit={(coinToEdit, portfolioId) =>
                  this.toggleEditModal(coinToEdit)
                }
                data={userCoinTableList}
                dataDisplayKeys={portFolioTableDisplayKeys}
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

        <AddCoinPortfolioModal
          isVisible={isAddModalVisible}
          toggleVisible={() => this.toggleAddModal()}
          coinToAdd={coinToAdd}
          addCoinToPortfolio={addCoinToPortfolio}
          user={user}
          match={match}
        />

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
                    portfolioKey: `-${match.params.id}`
                  }),
                  this.setState({ isEditModalVisible: false })
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
  portfolioListner: payload => dispatch(portfolioListner(payload))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Portfolio);
