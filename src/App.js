import React, { Component } from "react";
import _ from "lodash";
import { connect } from "react-redux";
import { addMessage, getMessages } from "./Redux/Actions/messages";
import fire from "./fire";
import firebase from "firebase";
import "./App.scss";
import { logout } from "./Redux/Actions/auth";
import Login from "./Routes/NoAuth/Login/login.js";
import Button from "@material-ui/core/Button";
import MarketCard from "./Components/MarketCard";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import Input from "@material-ui/core/Input";
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
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Tooltip from '@material-ui/core/Tooltip';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import DeleteIcon from '@material-ui/icons/Delete';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ExitToApp from '@material-ui/icons/ExitToApp';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import Person from '@material-ui/icons/Person';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Radio from '@material-ui/core/Radio';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from "recharts";

import logo from "./logo.svg";


class App extends Component {
  componentWillMount() {
    this.getCoins();
    this.authListener();
  }

  state = {
    isLogin: false,
    user: null,
    email: null,
    password: null,
    coins: [],
    sortedCoins: null,
    isAvatarMenuOpen: false,
    anchorEl: null,
    rankingSort: 'asc',
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
  };

  authListener() {
    fire.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ user: user });
      } else {
        this.setState({ user: null });
      }
    });
  }

 toggleAvatarMenu = () => this.setState({isAvatarMenuOpen: !this.state.isAvatarMenuOpen});

 handleClose = () => {
    this.setState({anchorEl: null})
  }

  handleClick = (e) => {
     this.setState({anchorEl: e.currentTarget})
   }

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
    if (number === null) return number
    if (number > 1) {
      return (Math.round(number * 100) / 100).toFixed(2);
    } else {
      return number.toFixed(2);
    }
  }

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
    const { rankingSort, coins, emptyFilters } = this.state
    if (rankingSort === null) {
      let sortedCoins = _.orderBy(coins, ['market_cap_rank'],['desc']);
      this.setState({ ...emptyFilters, rankingSort: 'desc', sortedCoins: sortedCoins })
    } else {
      if  (rankingSort === 'asc') {
        let sortedCoins = _.orderBy(coins, ['market_cap_rank'],['desc']);
        this.setState({ ...emptyFilters, rankingSort: 'desc', sortedCoins: sortedCoins })
      } else {
        let sortedCoins = _.orderBy(coins, ['market_cap_rank'],['asc']);
        this.setState({ ...emptyFilters, rankingSort: 'asc', sortedCoins: sortedCoins })
      }
    }
  };

  handleNameSort = () => {
    const { nameSort, coins, emptyFilters } = this.state
    if (nameSort === null) {
      let sortedCoins = _.orderBy(coins, ['name'],['desc']);
      this.setState({ ...emptyFilters, nameSort: 'desc', sortedCoins: sortedCoins })
    } else {
      if  (nameSort === 'asc') {
        let sortedCoins = _.orderBy(coins, ['name'],['desc']);
        this.setState({ ...emptyFilters, nameSort: 'desc', sortedCoins: sortedCoins })
      } else {
        let sortedCoins = _.orderBy(coins, ['name'],['asc']);
        this.setState({ ...emptyFilters, nameSort: 'asc', sortedCoins: sortedCoins })
      }
    }
  };

  handlePriceSort = () => {
    const { priceSort, coins, emptyFilters } = this.state
    if (priceSort === null) {
      let sortedCoins = _.orderBy(coins, ['current_price'],['desc']);
      this.setState({ ...emptyFilters, priceSort: 'desc', sortedCoins: sortedCoins })
    } else {
      if  (priceSort === 'asc') {
        let sortedCoins = _.orderBy(coins, ['current_price'],['desc']);
        this.setState({ ...emptyFilters, priceSort: 'desc', sortedCoins: sortedCoins })
      } else {
        let sortedCoins = _.orderBy(coins, ['current_price'],['asc']);
        this.setState({ ...emptyFilters, priceSort: 'asc', sortedCoins: sortedCoins })
      }
    }
  };

  handleOneHourSort = () => {
    const { oneHourSort, coins, emptyFilters } = this.state
    if (oneHourSort === null) {
      let sortedCoins = _.orderBy(coins, ['price_change_percentage_1h_in_currency'],['desc']);
      this.setState({ ...emptyFilters, oneHourSort: 'desc', sortedCoins: sortedCoins })
    } else {
      if  (oneHourSort === 'asc') {
        let sortedCoins = _.orderBy(coins, ['price_change_percentage_1h_in_currency'],['desc']);
        this.setState({ ...emptyFilters, oneHourSort: 'desc', sortedCoins: sortedCoins })
      } else {
        let sortedCoins = _.orderBy(coins, ['price_change_percentage_1h_in_currency'],['asc']);
        this.setState({ ...emptyFilters, oneHourSort: 'asc', sortedCoins: sortedCoins })
      }
    }
  };

  handleOneDaySort = () => {
    const { oneDaySort, coins, emptyFilters } = this.state
    if (oneDaySort === null) {
      let sortedCoins = _.orderBy(coins, ['price_change_percentage_24h_in_currency'],['desc']);
      this.setState({ ...emptyFilters, oneDaySort: 'desc', sortedCoins: sortedCoins })
    } else {
      if  (oneDaySort === 'asc') {
        let sortedCoins = _.orderBy(coins, ['price_change_percentage_24h_in_currency'],['desc']);
        this.setState({ ...emptyFilters, oneDaySort: 'desc', sortedCoins: sortedCoins })
      } else {
        let sortedCoins = _.orderBy(coins, ['price_change_percentage_24h_in_currency'],['asc']);
        this.setState({ ...emptyFilters, oneDaySort: 'asc', sortedCoins: sortedCoins })
      }
    }
  };

  handleSevenDaySort = () => {
    const { sevenDaySort, coins, emptyFilters } = this.state
    if (sevenDaySort === null) {
      let sortedCoins = _.orderBy(coins, ['price_change_percentage_7d_in_currency'],['desc']);
      this.setState({ ...emptyFilters, sevenDaySort: 'desc', sortedCoins: sortedCoins })
    } else {
      if  (sevenDaySort === 'asc') {
        let sortedCoins = _.orderBy(coins, ['price_change_percentage_7d_in_currency'],['desc']);
        this.setState({ ...emptyFilters, sevenDaySort: 'desc', sortedCoins: sortedCoins })
      } else {
        let sortedCoins = _.orderBy(coins, ['price_change_percentage_7d_in_currency'],['asc']);
        this.setState({ ...emptyFilters, sevenDaySort: 'asc', sortedCoins: sortedCoins })
      }
    }
  };

  render() {
    const { addMessage, logout } = this.props;
    const { user, isLogin, coins, sortedCoins, isAvatarMenuOpen, anchorEl, rankingSort, nameSort, priceSort, oneHourSort, oneDaySort, sevenDaySort } = this.state;
    console.log('coins', coins);

    const whichCoins = sortedCoins !== null ? sortedCoins : coins;

    const selectedValue = 'a'
    return (
      <div className="App">
        {!user || coins.length === 0 ? (
          <Login />
        ) : (
          <div className="dashboardWrapper">
            <nav className="dashboardNavbar">
              <div className="navbarInnerWrapper">
                <div className="lhs">
                  <img src={logo} alt="navbar logo" style={{height: '32px', width: '32px'}} />
                </div>
                <div className="middle">
                  <Autocomplete coins={coins} />
                </div>
                <div className="rhs flexRight">
                  <IconButton aria-label="Delete" aria-controls="simple-menu" aria-haspopup="true" onClick={(e)=>this.handleClick(e)} onMouseOver={(e)=>this.handleClick(e)}>
                    <Avatar
                      style={{height: '32px', width: '32px'}}
                      alt="Remy Sharp"
                      src="https://scontent.fyyc4-1.fna.fbcdn.net/v/t1.15752-9/53270755_401825197043838_4318937078982246400_n.png?_nc_cat=105&_nc_ht=scontent.fyyc4-1.fna&oh=9e34adadc4dcb7d326ef65afb4b902d7&oe=5D893ECD"
                     />
                    <ExpandMore style={{marginLeft: '3px'}} />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    id="simple-menu"
                    open={Boolean(anchorEl)}
                    onClose={()=>this.handleClose()}
                    style={{marginTop: '44px'}}
                    onMouseLeave={()=>this.handleClose()}
                  >
                    <MenuItem onClick={()=>this.handleClose()}><Person style={{marginRight: '5px'}} />Profile</MenuItem>
                    <MenuItem onClick={()=>[this.handleClose(), logout()]}><ExitToApp style={{marginRight: '5px'}} />Logout</MenuItem>
                  </Menu>
                </div>
              </div>
            </nav>
            <div className="dashboardInnerWrapper">

              <Paper className='portfolioPaper'>
                <div style={{marginBottom: '15px'}} className='flexSpaceBetweenStart'>
                  <div className='flexColLeft'>
                    <div className='flexLeft'>
                      <h2>To Da Moon</h2>
                      <div className='flex marginTS'>
                        <ArrowDropUp style={{color: '#81C784'}} />
                        <span style={{color: '#81C784', fontSize: '22px'}}>5%</span>
                      </div>
                    </div>
                    <div className='customRadioWrapper flex marginTS'>
                      <div className='radioButton flex'><span>1H</span></div>
                      <div className='radioButton radioButtonActive flex'><span>24H</span></div>
                      <div className='radioButton flex'><span>7D</span></div>
                    </div>
                  </div>


                  <h1 style={{fontSize: '36px'}} className="primaryGradientText">$130,449</h1>
                </div>
                {coins.length > 0 &&
                  <LineChart
                    width={420}
                    height={120}
                    data={this.prepGraphData(
                      coins[0].sparkline_in_7d.price
                    )}
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
                }
                <div className='fullWidth flexRight marginTM marginBM'>


                  <div style={{ marginLeft: '30px' }} className='statWrapper'>
                    <div style={{flex: '0 0 auto'}} className='fullWidth flex'>
                      <img className='marginRM' src={coins[0].image} style={{height: '24px', width: '24px'}} />
                      <span style={{color: '#81C784'}}>18%</span>
                    </div>
                    <span style={{ marginTop: '10px', fontSize: '12px', opacity: '0.4' }}>Top Performer</span>
                  </div>
                  <div style={{ marginLeft: '30px' }} className='statWrapper'>
                    <div className='fullWidth flex'>
                      <img className='marginRM' src={coins[5].image} style={{height: '24px', width: '24px'}} />
                      <span style={{color: '#e57373'}}>2%</span>
                    </div>
                    <span style={{ marginTop: '10px', fontSize: '12px', opacity: '0.4' }}>Worst Performer</span>
                  </div>



                </div>
                <div className='botActionMenu flexRight'>
                  <Button color="primary">
                    See All
                  </Button>
                </div>
              </Paper>




              <Paper className='paperTableWrapper' style={{ backgroundColor: 'white', zIndex: 2, overflow: 'hidden', marginTop: '20px'}}>
                <Table
                  handleSort={this.handleSort}
                  style={{ width: "100%" }}
                  size="small"
                >
                  <TableHead className='customTableHead'>
                    <TableRow>
                      <TableCell
                        key='rankingTableCell'
                        sortDirection={rankingSort !== null ? rankingSort === 'asc' ? 'asc' : 'desc' : false}
                        style={{ color: 'white', fontWeight: 'bold' }}
                      >
                        <TableSortLabel
                          active={rankingSort !== null}
                          direction={rankingSort === 'asc' ? 'asc' : 'desc'}
                          onClick={()=>this.handleRankingSort()}
                          style={{ color: 'white', fontWeight: 'bold', fontSize: '13px' }}
                        >
                        #
                        </TableSortLabel>
                      </TableCell>
                      <TableCell
                        key='nameTableCell'
                        sortDirection={nameSort !== null ? nameSort === 'asc' ? 'asc' : 'desc' : false}
                        style={{ color: 'white', fontWeight: 'bold' }}
                        align="left"
                        className='flexLeft'
                      >
                        <TableSortLabel
                          active={nameSort !== null}
                          direction={nameSort === 'asc' ? 'asc' : 'desc'}
                          onClick={()=>this.handleNameSort()}
                          style={{ color: 'white', fontWeight: 'bold', fontSize: '14px', textAlign: 'left'}}
                        >
                            <span style={{width: '100%', textAlign: 'left'}}>Name</span>
                        </TableSortLabel>
                      </TableCell>
                      <TableCell
                        key='priceTableCell'
                        sortDirection={priceSort !== null ? priceSort === 'asc' ? 'asc' : 'desc' : false}
                        style={{ color: 'white', fontWeight: 'bold' }}
                        align="left"
                        className='flexLeft'
                      >
                        <TableSortLabel
                          active={priceSort !== null}
                          direction={priceSort === 'asc' ? 'asc' : 'desc'}
                          onClick={()=>this.handlePriceSort()}
                          style={{ color: 'white', fontWeight: 'bold', fontSize: '14px', textAlign: 'left'}}
                        >
                            <span style={{width: '100%', textAlign: 'right'}}>Price</span>
                        </TableSortLabel>
                      </TableCell>
                      <TableCell
                        key='oneHourTableCell'
                        sortDirection={oneHourSort !== null ? oneHourSort === 'asc' ? 'asc' : 'desc' : false}
                        style={{ color: 'white', fontWeight: 'bold' }}
                        align="left"
                        className='flexLeft'
                      >
                        <TableSortLabel
                          active={oneHourSort !== null}
                          direction={oneHourSort === 'asc' ? 'asc' : 'desc'}
                          onClick={()=>this.handleOneHourSort()}
                          style={{ color: 'white', fontWeight: 'bold', fontSize: '14px', textAlign: 'left'}}
                        >
                            <span style={{width: '100%', textAlign: 'right'}}>1H</span>
                        </TableSortLabel>
                      </TableCell>
                      <TableCell
                        key='oneDayTableCell'
                        sortDirection={oneDaySort !== null ? oneDaySort === 'asc' ? 'asc' : 'desc' : false}
                        style={{ color: 'white', fontWeight: 'bold' }}
                        align="left"
                        className='flexLeft'
                      >
                        <TableSortLabel
                          active={oneDaySort !== null}
                          direction={oneDaySort === 'asc' ? 'asc' : 'desc'}
                          onClick={()=>this.handleOneDaySort()}
                          style={{ color: 'white', fontWeight: 'bold', fontSize: '14px', textAlign: 'left'}}
                        >
                            <span style={{width: '100%', textAlign: 'right'}}>24H</span>
                        </TableSortLabel>
                      </TableCell>
                      <TableCell
                        key='sevenDayTableCell'
                        sortDirection={sevenDaySort !== null ? sevenDaySort === 'asc' ? 'asc' : 'desc' : false}
                        style={{ color: 'white', fontWeight: 'bold' }}
                        align="left"
                        className='flexLeft'
                      >
                        <TableSortLabel
                          active={sevenDaySort !== null}
                          direction={sevenDaySort === 'asc' ? 'asc' : 'desc'}
                          onClick={()=>this.handleSevenDaySort()}
                          style={{ color: 'white', fontWeight: 'bold', fontSize: '14px', textAlign: 'left'}}
                        >
                            <span style={{width: '100%', textAlign: 'right'}}>7D</span>
                        </TableSortLabel>
                      </TableCell>
                      <TableCell style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }} align="right">Available Supply</TableCell>
                      <TableCell style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }} align="right">Market Cap</TableCell>
                      <TableCell style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }} align="left">Past 7 Days</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {whichCoins.map(coin => {
                      const lineColor =
                        coin.price_change_percentage_7d_in_currency >= 0
                          ? "#4CAF50"
                          : "#E91E63";
                      const availableSupply = coin.total_supply !== null ? (coin.circulating_supply / coin.total_supply) * 100 : 'infinity';
                      return (
                        <TableRow key={coin.name}>
                          <TableCell component="th" scope="row">
                            {coin.market_cap_rank}
                          </TableCell>
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
                          <TableCell align="right">
                            ${this.numberWithCommas(this.round(coin.current_price))}
                          </TableCell>
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
                          <TableCell align="right">
                          {
                            availableSupply !== 'infinity' ? (
                              <Tooltip placement="bottom" title={`Supply: ${this.commarize(coin.circulating_supply)}`}>
                                <div className='flex' style={{width: '100%', position: 'relative'}}>
                                    <div className='progressBar'>
                                      <div style={{width: `${availableSupply}%`}} className={availableSupply >= 100 ? 'filledBar filledBarFull' : 'filledBar'}>
                                        <div className='movingActiveBar' />
                                      </div>
                                    </div>
                                    <small style={{marginLeft: '5px'}}>{availableSupply >= 100 ? `100` : Math.round(availableSupply)}%</small>
                                  </div>
                                </Tooltip>
                            ) : (
                              <div className='flexRight' style={{width: '100%'}}>
                                <img src='/infinity.svg' alt='infinateSupply' style={{height: '24px'}}/>
                                <small style={{marginLeft: '5px'}}>{this.commarize(coin.circulating_supply)}</small>
                              </div>
                            )
                          }

                          </TableCell>
                          <TableCell align="right">
                            ${this.commarize(coin.market_cap)}
                          </TableCell>
                          <TableCell align="left">
                            <LineChart
                              width={150}
                              height={50}
                              data={this.prepGraphData(
                                coin.sparkline_in_7d.price
                              )}
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
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Paper>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
  addMessage: payload => dispatch(addMessage(payload)),
  logout: () => dispatch(logout())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
