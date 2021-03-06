import React, { Component, useState, useEffect } from "react";
import _ from "lodash";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Tooltip from "@material-ui/core/Tooltip";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import SortingTableCell from "./SortingTableCell";
import Button from "@material-ui/core/Button";

class SortingTable extends Component {
  componentDidMount() {
    const { presetFilter } = this.props;
    this.handleSort("holdings", presetFilter);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const isStateEqual = _.isEqual(nextState, this.state);
    const isPropsEqual = _.isEqual(nextProps, this.props);
    return !isStateEqual || !isPropsEqual;
  }

  state = {
    sortedData: [],
    dataOrderKey: "holdings",
    columnStateKey: "holdingsSortDirection",
    columnSortDirection: this.props.presetFilters,
    emptyFilters: {
      rankingSortDirection: null,
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
    }
  };

  handleSort = (dataOrderKey, columnStateKey) => {
    const { columnSortDirection, emptyFilters } = this.state;
    const newSortDirection =
      columnSortDirection[columnStateKey] === "desc" ? "asc" : "desc";
    const newColumnSortDirection = { ...emptyFilters };
    newColumnSortDirection[columnStateKey] = newSortDirection;
    this.setState({
      dataOrderKey: dataOrderKey,
      columnStateKey: columnStateKey,
      columnSortDirection: newColumnSortDirection,
      newSortDirection: newSortDirection
    });
  };

  numberWithCommas = number => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  commarize = number => {
    if (number === undefined) return "-";
    if (number >= 1e3) {
      var units = ["k", "M", "B", "T"];
      let unit = Math.floor((number.toFixed(0).length - 1) / 3) * 3;
      var num = (number / ("1e" + unit)).toFixed(1);
      var unitname = units[Math.floor(unit / 3) - 1];
      return num + unitname;
    }
    return number.toLocaleString();
  };

  prepGraphData = graphData => {
    const payload = [];
    graphData.map(dataPoint => {
      payload.push({ pv: dataPoint });
    });
    return payload;
  };

  handleColor = number => {
    if (number >= 0) {
      return "#81C784";
    } else return "#e57373";
  };

  round = number => {
    if (number === undefined) return "-";
    if (number === null) return number;
    if (number > 1) {
      return (Math.round(number * 100) / 100).toFixed(2);
    } else {
      return number.toFixed(2);
    }
  };

  render() {
    const {
      dataOrderKey,
      columnStateKey,
      emptyFilters,
      columnSortDirection,
      newSortDirection
    } = this.state;
    const { data, dataDisplayKeys, presetFilters, handleEdit } = this.props;
    const sortedData = _.orderBy(data, [dataOrderKey], [newSortDirection]);
    return (
      <Paper style={{ width: "100%" }} className="paperTableWrapper">
        <Table style={{ width: "100%" }} size="small">
          <TableHead className="customTableHead">
            <TableRow>
              {dataDisplayKeys.market_cap_rank && (
                <SortingTableCell
                  sortLabel="#"
                  sortKey={columnSortDirection.rankingSortDirection}
                  sortKeyString="rankingSortDirection"
                  dataKey="market_cap_rank"
                  handleSort={this.handleSort}
                />
              )}
              {dataDisplayKeys.amountPurchased && (
                <SortingTableCell
                  sortLabel={
                    <span style={{ width: "100%", textAlign: "left" }}>💰</span>
                  }
                  sortKey={columnSortDirection.amountPurchasedSortDirection}
                  sortKeyString="amountPurchasedSortDirection"
                  dataKey="amountPurchased"
                  handleSort={this.handleSort}
                />
              )}
              {dataDisplayKeys.name && (
                <SortingTableCell
                  sortLabel={
                    <span style={{ width: "100%", textAlign: "left" }}>
                      Name
                    </span>
                  }
                  sortKey={columnSortDirection.nameSortDirection}
                  sortKeyString="nameSortDirection"
                  dataKey="name"
                  handleSort={this.handleSort}
                />
              )}
              {dataDisplayKeys.holdings && (
                <SortingTableCell
                  sortLabel={
                    <span style={{ width: "100%", textAlign: "left" }}>
                      Holdings
                    </span>
                  }
                  sortKey={columnSortDirection.holdingsSortDirection}
                  sortKeyString="holdingsSortDirection"
                  dataKey="holdings"
                  handleSort={this.handleSort}
                />
              )}
              {dataDisplayKeys.amountInvested && (
                <SortingTableCell
                  sortLabel={
                    <span style={{ width: "100%", textAlign: "left" }}>
                      Invested
                    </span>
                  }
                  sortKey={columnSortDirection.amountInvestedSortDirection}
                  sortKeyString="amountInvestedSortDirection"
                  dataKey="amountInvested"
                  handleSort={this.handleSort}
                />
              )}
              {dataDisplayKeys.roi && (
                <SortingTableCell
                  sortLabel={
                    <span style={{ width: "100%", textAlign: "left" }}>
                      ROI
                    </span>
                  }
                  sortKey={columnSortDirection.roiSortDirection}
                  sortKeyString="roiSortDirection"
                  dataKey="roi"
                  handleSort={this.handleSort}
                />
              )}
              {dataDisplayKeys.current_price && (
                <SortingTableCell
                  sortLabel={
                    <span style={{ width: "100%", textAlign: "right" }}>
                      Price
                    </span>
                  }
                  sortKey={columnSortDirection.priceSortDirection}
                  sortKeyString="priceSortDirection"
                  dataKey="current_price"
                  handleSort={this.handleSort}
                />
              )}
              {dataDisplayKeys.total_volume && (
                <SortingTableCell
                  sortLabel={
                    <span style={{ width: "100%", textAlign: "right" }}>
                      Volume
                    </span>
                  }
                  sortKey={columnSortDirection.volumeSortDirection}
                  sortKeyString="volumeSortDirection"
                  dataKey="total_volume"
                  handleSort={this.handleSort}
                />
              )}
              {dataDisplayKeys.price_change_percentage_1h_in_currency && (
                <SortingTableCell
                  sortLabel={
                    <span style={{ width: "100%", textAlign: "right" }}>
                      1H
                    </span>
                  }
                  sortKey={columnSortDirection.oneHourSortDirection}
                  sortKeyString="oneHourSortDirection"
                  dataKey="price_change_percentage_1h_in_currency"
                  handleSort={this.handleSort}
                />
              )}
              {dataDisplayKeys.price_change_percentage_24h_in_currency && (
                <SortingTableCell
                  sortLabel={
                    <span style={{ width: "100%", textAlign: "right" }}>
                      24H
                    </span>
                  }
                  sortKey={columnSortDirection.oneDaySortDirection}
                  sortKeyString="oneDaySortDirection"
                  dataKey="price_change_percentage_24h_in_currency"
                  handleSort={this.handleSort}
                />
              )}
              {dataDisplayKeys.price_change_percentage_7d_in_currency && (
                <SortingTableCell
                  sortLabel={
                    <span style={{ width: "100%", textAlign: "right" }}>
                      7D
                    </span>
                  }
                  sortKey={columnSortDirection.sevenDaySortDirection}
                  sortKeyString="sevenDaySortDirection"
                  dataKey="price_change_percentage_7d_in_currency"
                  handleSort={this.handleSort}
                />
              )}
              {dataDisplayKeys.circulating_supply && (
                <TableCell
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "14px"
                  }}
                  align="right"
                >
                  Available Supply
                </TableCell>
              )}
              {dataDisplayKeys.ath_change_percentage && (
                <SortingTableCell
                  sortLabel={
                    <span style={{ width: "100%", textAlign: "right" }}>
                      ATH Δ
                    </span>
                  }
                  sortKey={columnSortDirection.athSortDirection}
                  sortKeyString="athSortDirection"
                  dataKey="ath_change_percentage"
                  handleSort={this.handleSort}
                />
              )}
              {dataDisplayKeys.market_cap && (
                <TableCell
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "14px"
                  }}
                  align="right"
                >
                  Market Cap
                </TableCell>
              )}
              {dataDisplayKeys.sparkline_in_7d && (
                <TableCell
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "14px"
                  }}
                  align="left"
                >
                  Past 7 Days
                </TableCell>
              )}
              {dataDisplayKeys.edit && (
                <TableCell
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "14px"
                  }}
                  align="center"
                />
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map(coin => {
              const lineColor =
                coin.price_change_percentage_7d_in_currency >= 0
                  ? "#81C784"
                  : "#e57373";
              const availableSupply =
                coin.total_supply !== null
                  ? (coin.circulating_supply / coin.total_supply) * 100
                  : "infinity";
              return (
                <TableRow key={coin.id}>
                  {dataDisplayKeys.market_cap_rank && (
                    <TableCell component="th" scope="row">
                      {coin.market_cap_rank}
                    </TableCell>
                  )}
                  {dataDisplayKeys.amountPurchased && (
                    <TableCell align="right">
                      {this.commarize(coin.amountPurchased)}
                    </TableCell>
                  )}
                  {dataDisplayKeys.name && (
                    <TableCell align="left">
                      <div className="flexLeft">
                        {coin.name ? (
                          <>
                            <img
                              src={coin.image}
                              alt={coin.name}
                              style={{
                                height: "24px",
                                width: "24px",
                                marginRight: "10px",
                                marginTop: "-2px"
                              }}
                            />
                            {coin.name}
                            <span
                              style={{
                                textTransform: "uppercase",
                                marginLeft: "5px"
                              }}
                            >{` (${coin.symbol})`}</span>
                          </>
                        ) : (
                          <span
                            style={{
                              textTransform: "uppercase"
                            }}
                          >
                            {coin.investmentName}
                          </span>
                        )}
                      </div>
                    </TableCell>
                  )}
                  {dataDisplayKeys.holdings && (
                    <TableCell align="right">
                      ${this.commarize(coin.holdings)}
                    </TableCell>
                  )}
                  {dataDisplayKeys.amountInvested && (
                    <TableCell align="right">
                      <div className="fullWidth flex">
                        ${this.commarize(coin.amountInvested)}
                      </div>
                    </TableCell>
                  )}
                  {dataDisplayKeys.roi && (
                    <TableCell align="center">
                      <span
                        style={{
                          color:
                            coin.roi !== 0
                              ? this.handleColor(coin.roi)
                              : "#BDBDBD"
                        }}
                      >
                        {coin.roi !== 0
                          ? `${this.commarize(this.round(coin.roi) * 100)}%`
                          : "N/A"}
                      </span>
                    </TableCell>
                  )}
                  {dataDisplayKeys.current_price && (
                    <TableCell align="right">
                      <div className="fullWidth flex">
                        ${this.commarize(coin.current_price)}
                      </div>
                    </TableCell>
                  )}
                  {dataDisplayKeys.total_volume && (
                    <TableCell align="right">
                      <div className="fullWidth flex">
                        ${this.commarize(coin.total_volume)}
                      </div>
                    </TableCell>
                  )}
                  {dataDisplayKeys.price_change_percentage_1h_in_currency && (
                    <TableCell align="right">
                      <span
                        style={{
                          color: this.handleColor(
                            coin.price_change_percentage_1h_in_currency
                          )
                        }}
                      >
                        {this.round(
                          coin.price_change_percentage_1h_in_currency
                        )}
                        %
                      </span>
                    </TableCell>
                  )}
                  {dataDisplayKeys.price_change_percentage_24h_in_currency && (
                    <TableCell align="right">
                      <span
                        style={{
                          color: this.handleColor(
                            coin.price_change_percentage_24h_in_currency
                          )
                        }}
                      >
                        {this.round(
                          coin.price_change_percentage_24h_in_currency
                        )}
                        %
                      </span>
                    </TableCell>
                  )}
                  {dataDisplayKeys.price_change_percentage_7d_in_currency && (
                    <TableCell align="right">
                      <span
                        style={{
                          color: this.handleColor(
                            coin.price_change_percentage_7d_in_currency
                          )
                        }}
                      >
                        {this.round(
                          coin.price_change_percentage_7d_in_currency
                        )}
                        %
                      </span>
                    </TableCell>
                  )}
                  {dataDisplayKeys.circulating_supply && (
                    <TableCell align="right">
                      {availableSupply !== "infinity" ? (
                        <Tooltip
                          placement="bottom"
                          title={`Supply: ${this.commarize(
                            coin.circulating_supply
                          )}`}
                        >
                          <div
                            className="flex"
                            style={{ width: "100%", position: "relative" }}
                          >
                            <div className="progressBar">
                              <div
                                style={{ width: `${availableSupply}%` }}
                                className={
                                  availableSupply >= 100
                                    ? "filledBar filledBarFull"
                                    : "filledBar"
                                }
                              >
                                <div className="movingActiveBar" />
                              </div>
                            </div>
                            <small style={{ marginLeft: "5px" }}>
                              {availableSupply >= 100
                                ? `100`
                                : Math.round(availableSupply)}
                              %
                            </small>
                          </div>
                        </Tooltip>
                      ) : (
                        <div className="flexRight" style={{ width: "100%" }}>
                          <img
                            src="/infinity.svg"
                            alt="infinateSupply"
                            style={{ height: "24px" }}
                          />
                          <small style={{ marginLeft: "5px" }}>
                            {this.commarize(coin.circulating_supply)}
                          </small>
                        </div>
                      )}
                    </TableCell>
                  )}
                  {dataDisplayKeys.ath_change_percentage && (
                    <TableCell align="right">
                      <span
                        style={{
                          color: this.handleColor(coin.ath_change_percentage)
                        }}
                      >
                        {this.round(coin.ath_change_percentage)}%
                      </span>
                    </TableCell>
                  )}
                  {dataDisplayKeys.market_cap && (
                    <TableCell align="right">
                      ${this.commarize(coin.market_cap)}
                    </TableCell>
                  )}
                  {dataDisplayKeys.sparkline_in_7d && (
                    <TableCell align="left">
                      <LineChart
                        width={150}
                        height={50}
                        data={
                          coin.sparkline_in_7d
                            ? this.prepGraphData(coin.sparkline_in_7d.price)
                            : []
                        }
                      >
                        <Line
                          type="monotone"
                          dataKey="pv"
                          stroke={lineColor}
                          strokeWidth={2}
                          dot={false}
                        />
                        <YAxis
                          type="number"
                          domain={["dataMin", "dataMax"]}
                          hide={true}
                        />
                      </LineChart>
                    </TableCell>
                  )}
                  {dataDisplayKeys.edit && (
                    <TableCell>
                      <div className="fullWidth flex">
                        <Button
                          onClick={() => handleEdit(coin)}
                          color="primary"
                        >
                          Edit
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

SortingTable.defaultProps = {
  data: [],
  dataDisplayKeys: {
    market_cap_rank: true,
    name: true,
    current_price: true,
    total_volume: true,
    price_change_percentage_1h_in_currency: true,
    price_change_percentage_24h_in_currency: true,
    price_change_percentage_7d_in_currency: true,
    circulating_supply: true,
    market_cap: true,
    sparkline_in_7d: true,
    roi: false,
    holdings: false,
    amountPurchased: false,
    amountInvested: false,
    edit: false
  },
  presetFilters: {
    rankingSortDirection: null,
    nameSortDirection: null,
    priceSortDirection: null,
    volumeSortDirection: null,
    oneHourSortDirection: null,
    oneDaySortDirection: null,
    sevenDaySortDirection: null,
    holdingsSortDirection: null,
    roiSortDirection: null,
    amountInvestedSortDirection: null,
    amountPurchasedSortDirection: null
  },
  handleEdit: () => console.log("handleEdit was not properly declared")
};

export default SortingTable;
