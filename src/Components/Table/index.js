import React, { useState, useEffect } from "react";
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

const SortingTable = ({ data, dataDisplayKeys, presetFilters, handleEdit }) => {

  useEffect(() => {
    setSortedData(data);
  });

  const [sortedData, setSortedData] = useState(data);

  const [columnSortDirection, setColumnSortDirection] = useState(presetFilters);

  const handleSort = (dataOrderKey, columnStateKey) => {
    const newSortDirection =
      columnSortDirection[columnStateKey] === "desc" ? "asc" : "desc";
    const sortedData = _.orderBy(data, [dataOrderKey], [newSortDirection]);
    const updatedFilters = presetFilters;
    updatedFilters[columnStateKey] = newSortDirection;
    setSortedData(sortedData);
    setColumnSortDirection({ ...updatedFilters });
  };

  const numberWithCommas = number => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const commarize = number => {
    if (number >= 1e3) {
      var units = ["k", "M", "B", "T"];
      let unit = Math.floor((number.toFixed(0).length - 1) / 3) * 3;
      var num = (number / ("1e" + unit)).toFixed(2);
      var unitname = units[Math.floor(unit / 3) - 1];
      return num + unitname;
    }
    return number.toLocaleString();
  };

  const prepGraphData = graphData => {
    const payload = [];
    graphData.map(dataPoint => {
      payload.push({ pv: dataPoint });
    });
    return payload;
  };

  const handleColor = number => {
    if (number >= 0) {
      return "#81C784";
    } else return "#e57373";
  };

  const round = number => {
    if (number === null) return number;
    if (number > 1) {
      return (Math.round(number * 100) / 100).toFixed(2);
    } else {
      return number.toFixed(2);
    }
  };

  return (
    <Paper className="paperTableWrapper">
      <Table style={{ width: "100%" }} size="small">
        <TableHead className="customTableHead">
          <TableRow>
            {dataDisplayKeys.market_cap_rank && (
              <SortingTableCell
                sortLabel="#"
                sortKey={columnSortDirection.rankingSortDirection}
                sortKeyString="rankingSortDirection"
                dataKey="market_cap_rank"
                handleSort={handleSort}
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
                handleSort={handleSort}
              />
            )}
            {dataDisplayKeys.name && (
              <SortingTableCell
                sortLabel={
                  <span style={{ width: "100%", textAlign: "left" }}>Name</span>
                }
                sortKey={columnSortDirection.nameSortDirection}
                sortKeyString="nameSortDirection"
                dataKey="name"
                handleSort={handleSort}
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
                handleSort={handleSort}
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
                handleSort={handleSort}
              />
            )}
            {dataDisplayKeys.roi && (
              <SortingTableCell
                sortLabel={
                  <span style={{ width: "100%", textAlign: "left" }}>ROI</span>
                }
                sortKey={columnSortDirection.roiSortDirection}
                sortKeyString="roiSortDirection"
                dataKey="roi"
                handleSort={handleSort}
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
                handleSort={handleSort}
              />
            )}
            {dataDisplayKeys.price_change_percentage_1h_in_currency && (
              <SortingTableCell
                sortLabel={
                  <span style={{ width: "100%", textAlign: "right" }}>1H</span>
                }
                sortKey={columnSortDirection.oneHourSortDirection}
                sortKeyString="oneHourSortDirection"
                dataKey="price_change_percentage_1h_in_currency"
                handleSort={handleSort}
              />
            )}
            {dataDisplayKeys.price_change_percentage_24h_in_currency && (
              <SortingTableCell
                sortLabel={
                  <span style={{ width: "100%", textAlign: "right" }}>24H</span>
                }
                sortKey={columnSortDirection.oneDaySortDirection}
                sortKeyString="oneDaySortDirection"
                dataKey="price_change_percentage_24h_in_currency"
                handleSort={handleSort}
              />
            )}
            {dataDisplayKeys.price_change_percentage_7d_in_currency && (
              <SortingTableCell
                sortLabel={
                  <span style={{ width: "100%", textAlign: "right" }}>7D</span>
                }
                sortKey={columnSortDirection.sevenDaySortDirection}
                sortKeyString="sevenDaySortDirection"
                dataKey="price_change_percentage_7d_in_currency"
                handleSort={handleSort}
              />
            )}
            {dataDisplayKeys.circulating_supply && (
              <TableCell
                style={{ color: "white", fontWeight: "bold", fontSize: "14px" }}
                align="right"
              >
                Available Supply
              </TableCell>
            )}
            {dataDisplayKeys.market_cap && (
              <TableCell
                style={{ color: "white", fontWeight: "bold", fontSize: "14px" }}
                align="right"
              >
                Market Cap
              </TableCell>
            )}
            {dataDisplayKeys.sparkline_in_7d && (
              <TableCell
                style={{ color: "white", fontWeight: "bold", fontSize: "14px" }}
                align="left"
              >
                Past 7 Days
              </TableCell>
            )}
            {dataDisplayKeys.edit && (
              <TableCell
                style={{ color: "white", fontWeight: "bold", fontSize: "14px" }}
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
              <TableRow key={coin.name}>
                {dataDisplayKeys.market_cap_rank && (
                  <TableCell component="th" scope="row">
                    {coin.market_cap_rank}
                  </TableCell>
                )}
                {dataDisplayKeys.amountPurchased && (
                  <TableCell align="right">
                    {commarize(coin.amountPurchased)}
                  </TableCell>
                )}
                {dataDisplayKeys.name && (
                  <TableCell align="left">
                    <div className="flexLeft">
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
                    </div>
                  </TableCell>
                )}
                {dataDisplayKeys.holdings && (
                  <TableCell align="right">
                    ${commarize(coin.holdings)}
                  </TableCell>
                )}
                {dataDisplayKeys.amountInvested && (
                  <TableCell align="right">
                    <div className="fullWidth flex">
                      ${commarize(coin.amountInvested)}
                    </div>
                  </TableCell>
                )}
                {dataDisplayKeys.roi && (
                  <TableCell align="center">
                    <span
                      style={{
                        color:
                          coin.roi !== 0 ? handleColor(coin.roi) : "#BDBDBD"
                      }}
                    >
                      {coin.roi !== 0
                        ? `${commarize(round(coin.roi) * 100)}%`
                        : "N/A"}
                    </span>
                  </TableCell>
                )}
                {dataDisplayKeys.current_price && (
                  <TableCell align="right">
                    <div className="fullWidth flex">
                      ${commarize(coin.current_price)}
                    </div>
                  </TableCell>
                )}
                {dataDisplayKeys.price_change_percentage_1h_in_currency && (
                  <TableCell align="right">
                    <span
                      style={{
                        color: handleColor(
                          coin.price_change_percentage_1h_in_currency
                        )
                      }}
                    >
                      {round(coin.price_change_percentage_1h_in_currency)}%
                    </span>
                  </TableCell>
                )}
                {dataDisplayKeys.price_change_percentage_24h_in_currency && (
                  <TableCell align="right">
                    <span
                      style={{
                        color: handleColor(
                          coin.price_change_percentage_24h_in_currency
                        )
                      }}
                    >
                      {round(coin.price_change_percentage_24h_in_currency)}%
                    </span>
                  </TableCell>
                )}
                {dataDisplayKeys.price_change_percentage_7d_in_currency && (
                  <TableCell align="right">
                    <span
                      style={{
                        color: handleColor(
                          coin.price_change_percentage_7d_in_currency
                        )
                      }}
                    >
                      {round(coin.price_change_percentage_7d_in_currency)}%
                    </span>
                  </TableCell>
                )}
                {dataDisplayKeys.circulating_supply && (
                  <TableCell align="right">
                    {availableSupply !== "infinity" ? (
                      <Tooltip
                        placement="bottom"
                        title={`Supply: ${commarize(coin.circulating_supply)}`}
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
                          {commarize(coin.circulating_supply)}
                        </small>
                      </div>
                    )}
                  </TableCell>
                )}
                {dataDisplayKeys.market_cap && (
                  <TableCell align="right">
                    ${commarize(coin.market_cap)}
                  </TableCell>
                )}
                {dataDisplayKeys.sparkline_in_7d && (
                  <TableCell align="left">
                    <LineChart
                      width={150}
                      height={50}
                      data={prepGraphData(coin.sparkline_in_7d.price)}
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
                      <Button onClick={() => handleEdit(coin)} color="primary">
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
};

SortingTable.defaultProps = {
  data: [],
  dataDisplayKeys: {
    market_cap_rank: true,
    name: true,
    current_price: true,
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
