import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { dashboardTableDisplayKeys } from "../../../constants";
import "./LoggedInView.scss";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import AuthedLayout from "../../../Components/AuthedLayout";
import Table from "../../../Components/Table";
import Modal from "../../../Components/Modal";
import ConditionalTooltip from "../../../Components/ConditionalTooltip";
import NewPortfolioModal from "../../../Components/NewPortfolioModal";
import Input from "../../../Components/Input/input.js";
import Add from "@material-ui/icons/Add";
import Navbar from "../../../Components/Navbar";
import CurrencyButton from "../../../Components/CurrencyButton";
import PortfolioCard from "../../../Components/PortfolioCard";
import "../../../styles/global.scss";

class LoggedInView extends Component {
  state = {
    isAddModalVisible: false,
    redirectUrl: null
  };

  toggleAddModal = () => {
    this.setState({ isAddModalVisible: !this.state.isAddModalVisible });
  };

  handleRedirect = url => this.setState({ redirectUrl: url });

  render() {
    const { isAuthed, coins, portfolios, user } = this.props;
    const { isAddModalVisible, newPortfolioName, redirectUrl } = this.state;
    const hasCreatedMaxPortfolios = Object.keys(portfolios).length >= 2;
    if (redirectUrl !== null) return <Redirect to={redirectUrl} />;
    return (
      <AuthedLayout>
        <Navbar /> 
        <div className="dashboard">
          <div className="dashboard__innerWrapper">
            <div className="dashboard__topRow">
              <CurrencyButton />
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
                  className="servoButton--secondary"
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
            {Object.keys(portfolios).map(portfolioKey => (
              <PortfolioCard
                key={`portfolioCard-${portfolioKey}`}
                portfolio={portfolios[portfolioKey]}
                portfolioKey={portfolioKey}
                coins={coins}
                handleRedirect={this.handleRedirect}
              />
            ))}
            <Paper className="dashboard__tableWrapper">
              <Table
                data={coins.slice(0, 99)}
                dataDisplayKeys={dashboardTableDisplayKeys}
                presetFilters={{ rankingSortDirection: "asc" }}
                presetFilter="rankingSortDirection"
              />
            </Paper>
          </div>
          <NewPortfolioModal
            user={user}
            isVisible={isAddModalVisible}
            toggleVisible={() => this.toggleAddModal()}
          />
        </div>
      </AuthedLayout>
    );
  }
}

const mapStateToProps = state => ({
  coins: state.coins.top250,
  portfolios: state.portfolios.portfolios,
  user: state.auth.user,
  isAuthed: state.auth.isAuthed
});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoggedInView);
