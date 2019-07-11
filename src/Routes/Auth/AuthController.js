import React, { Component } from "react";
import { connect } from "react-redux";
import Loader from "../../Components/Loader/";
import LoggedInView from "./LoggedInView/LoggedInView";
import { portfolioListner } from "../../Redux/Actions/portfolios";
import { fetchTop250 } from "../../Redux/Actions/coins";

class AuthController extends Component {
  componentDidMount() {
    const { portfolioListner, fetchTop250 } = this.props;
    portfolioListner();
    fetchTop250();
  }
  render() {
    const { portfolios, coins } = this.props;
    if (portfolios === null || coins.top250.length === 0) return <Loader />;
    else return <LoggedInView />;
  }
}

const mapStateToProps = state => ({
  portfolios: state.portfolios.portfolios,
  coins: state.coins
});

const mapDispatchToProps = dispatch => ({
  portfolioListner: payload => dispatch(portfolioListner(payload)),
  fetchTop250: payload => dispatch(fetchTop250(payload))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthController);
