import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import _ from "lodash";
import { connect } from "react-redux";
import { createPortfolio } from "../../../Redux/Actions/portfolios";
import { dashboardTableDisplayKeys } from "../../../constants";
import "./LoggedInView.scss";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import AuthedLayout from "../../../Components/AuthedLayout";
import Table from "../../../Components/Table";
import Modal from "../../../Components/Modal";
import GradientButton from "../../../Components/GradientButton";
import ConditionalTooltip from "../../../Components/ConditionalTooltip";
import Input from "../../../Components/Input/input.js";
import Add from "@material-ui/icons/Add";
import Navbar from "../../../Components/Navbar";
import CurrencyButton from "../../../Components/CurrencyButton";
import PortfolioCard from "../../../Components/PortfolioCard";
import "../../../styles/global.scss";

class LoggedInView extends Component {
  state = {
    isAddModalVisible: false,
    newPortfolioName: "",
    redirectUrl: null
  };

  handleAddNewPortfolio = () => {
    const { newPortfolioName } = this.state;
    const { user } = this.props;
    const portfolioInfo = {
      name: newPortfolioName,
      coins: {}
    };
    createPortfolio(user.uid, portfolioInfo);
    this.setState({ isAddModalVisible: false });
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
    return (
      <AuthedLayout>
        <div className="dashboard">
          <Navbar />
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
                portfolio={portfolios[portfolioKey]}
                portfolioKey={portfolioKey}
                coins={coins}
                handleRedirect={this.handleRedirect}
              />
            ))}
            <Paper className="dashboard__tableWrapper">
              <Table
                data={coins.slice(0, 49)}
                dataDisplayKeys={dashboardTableDisplayKeys}
                presetFilters={{ rankingSortDirection: "asc" }}
                presetFilter="rankingSortDirection"
              />
            </Paper>
          </div>
          <Modal
            isVisible={isAddModalVisible}
            toggleModal={() => this.toggleAddModal()}
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
              className="servoInput--primary"
            />
          </Modal>
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
