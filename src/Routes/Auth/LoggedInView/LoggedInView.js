import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import _ from "lodash";
import { connect } from "react-redux";
import { createPortfolio } from "../../../Redux/Actions/portfolios";
import "./LoggedInView.scss";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Table from "../../../Components/Table";
import Modal from "../../../Components/Modal";
import GradientButton from "../../../Components/GradientButton";
import ConditionalTooltip from "../../../Components/ConditionalTooltip";
import Input from "../../../Components/Input/input.js";
import Add from "@material-ui/icons/Add";
import Navbar from "../../../Components/Navbar";
import CurrencyButton from "../../../Components/CurrencyButton";
import PortfolioCard from "../../../Components/PortfolioCard";
import '../../../styles/global.scss'
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

  handleRedirect = url => this.setState({ redirectUrl: url });

  render() {
    const { isAuthed, coins, portfolios } = this.props;
    const { isAddModalVisible, newPortfolioName, redirectUrl } = this.state;
    const hasCreatedMaxPortfolios = Object.keys(portfolios).length >= 2;
    if (redirectUrl !== null) return <Redirect to={redirectUrl} />;
    //todo: I dont think this check is necessary since we have the auth and app controllers....
    if (!isAuthed) return <Redirect to="/" />;
    return (
      <div className="App">
        <div className="dashboardWrapper">
          <Navbar />
          <div className="dashboardInnerWrapper">
            <div
              style={{ margin: "0 10px", zIndex: 5 }}
              className="fullWidth flexSpaceBetween"
            >
              <CurrencyButton />
              <div className="flexRight">
                <ConditionalTooltip
                  visible={hasCreatedMaxPortfolios}
                  placement="bottom-end"
                  title="Maximum number of portfolios created"
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => this.toggleAddModal()}
                    disabled={hasCreatedMaxPortfolios}
                    className='servoButton--secondary'
                  >
                    <Add style={{ fontSize: "22px", color: "#E94057" }} />
                    <span
                      className="primaryGradientText"
                      style={{ fontSize: "14px", marginLeft: "5px" }}
                    >
                      Portfolio
                    </span>
                  </Button>
                </ConditionalTooltip>
              </div>
            </div>

            {Object.keys(portfolios).map(portfolioKey => (
              <PortfolioCard
                portfolio={portfolios[portfolioKey]}
                portfolioKey={portfolioKey}
                coins={coins}
                handleRedirect={this.handleRedirect}
              />
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
            isVisible={isAddModalVisible}
            toggleModal={()=>this.setState({ isAddModalVisible: !isAddModalVisible})}
            title="Add a New Portfolio"
            >
            <Input
              color="secondary"
              autoFocus
              label="Name"
              value={newPortfolioName}
              onChange={name => this.handleUpdateNewPortfolioName(name)}
              handleSubmit={e => [
                e.preventDefault(),
                this.handleAddNewPortfolio()
              ]}
              error={null}
              className='servoInput--primary'
            />
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
  createPortfolio: (accountKey, payload) =>
    dispatch(createPortfolio(accountKey, payload))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoggedInView);


/*
<MaterialModal
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
</MaterialModal>
*/
