import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link as RouterLink, withRouter } from "react-router-dom";
import { GridContainer, GridItem } from "components/grid/Grid";
import { Card, CardBody, CardHeader, CardIcon } from "components/card/Card";
import Notes from "@material-ui/icons/Notes";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import Pulse from "mdi-material-ui/Pulse";

import { connect } from "react-redux";
import homeStyles from "styles/pages/dashboard/home/Home.jss";
import Profile from "components/dashboard/profile/Profile";
import Wallet from "pages/dashboard/wallet/Wallet";
import {
  getFollowingStrategies,
  subscribe
} from "actions/followingStrategies/FollowingStrategies";
import Link from "@material-ui/core/Link";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Table from "components/table/Table";
import { getUserStrategies } from "actions/userStrategies/UserStrategies";
import Spinner from "components/spinner/Spinner";
import { getSignals } from "actions/signals/Signals";
import NewBox from "mdi-material-ui/NewBox";
class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    const {
      loadFollowingStrategies,
      loadUserStrategies,
      loadUserSignals
    } = this.props;
    loadFollowingStrategies();
    loadUserStrategies();
    loadUserSignals();
  };
  signalsToTable() {
    const { signals, newSignals, classes } = this.props;
    const _signals = [];
    newSignals.forEach(signal => {
      const _signal = [
        <span>
          {signal.timestamp}
          <sup>
            <small className={classes.dangerText}>
              <NewBox />
            </small>
          </sup>
        </span>,
        <Link
          color="primary"
          to={{ pathname: "/dashboard/marketplace/" + signal.strategyId }}
          component={RouterLink}
        >
          {signal.strategyName}
        </Link>,
        signal.market,
        signal.action
      ];
      _signals.push(_signal);
    });

    signals.forEach(signal => {
      const _signal = [
        signal.timestamp,
        <Link
          color="primary"
          to={{ pathname: "/dashboard/marketplace/" + signal.strategyId }}
          component={RouterLink}
        >
          {signal.strategyName}
        </Link>,

        signal.market,
        signal.action
      ];
      _signals.push(_signal);
    });
    return _signals;
  }

  followingStrategiesToTable = () => {
    const { subscribe, followingStrategies, classes } = this.props;
    const _strategies = [];

    followingStrategies.forEach(function(strategy) {
      let performance = parseFloat(strategy.performance);
      let performanceWrapper = "";
      if (performance === 0) performanceWrapper = <b>{performance + "%"} </b>;
      if (performance > 0)
        performanceWrapper = (
          <b className={classes.successCellColor}>{"+" + performance + "%"} </b>
        );
      if (performance < 0)
        performanceWrapper = (
          <b className={classes.dangerCellColor}>{performance + "%"} </b>
        );

      const followingStrategy = [
        <Link
          color="primary"
          to={{ pathname: "/dashboard/marketplace/" + strategy.id }}
          component={RouterLink}
        >
          {strategy.name}
        </Link>,
        strategy.type,
        strategy.market,
        strategy.followers,
        performanceWrapper,
        <FormControlLabel
          control={
            <Switch
              key={strategy.id}
              checked={strategy.subscribe}
              onChange={() => {
                subscribe(strategy.id, !strategy.subscribe);
              }}
              id={strategy.id}
              value={strategy.subscribe}
            />
          }
        />
      ];

      _strategies.push(followingStrategy);
    });
    return _strategies;
  };
  userStrategiesToTable = strategies => {
    const _strategies = [];
    strategies.forEach(function(strategy) {
      _strategies.push([
        <Link
          color="primary"
          to={{ pathname: "/dashboard/marketplace/" + strategy.id }}
          component={RouterLink}
        >
          {strategy.name}
        </Link>,
        strategy.followers
      ]);
    });
    return _strategies;
  };
  render() {
    const {
      classes,
      profile,
      isProfileLoaded,
      userStrategies,
      followingStrategiesLoaded,
      userStrategiesLoaded,
      signalsLoaded
    } = this.props;

    return (
      <div>
        <GridContainer spacing={32}>
          <GridItem className={classes.dashboardItem} xs={12} sm={12} md={4}>
            <GridContainer direction="column">
              <GridItem>
                <Profile profile={profile} loaded={isProfileLoaded} />
              </GridItem>
              <GridItem className={classes.dashboardItem}>
                <Wallet fullContent={false} />
              </GridItem>
            </GridContainer>
          </GridItem>

          <GridItem className={classes.dashboardItem} xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="rose" icon>
                <CardIcon color="rose">
                  {signalsLoaded ? <Pulse /> : <Spinner color="white" />}
                </CardIcon>
                <h4 className={classes.cardIconTitle}>My Signals</h4>
              </CardHeader>
              <CardBody
                padding={false}
                className={
                  signalsLoaded
                    ? classes.dashboardBody
                    : classes.dashboardCardLoading
                }
              >
                {signalsLoaded ? (
                  <GridItem xs={12}>
                    <Table
                      emptyData={{
                        link: "/dashboard/marketplace",
                        linkText: "Browse strategies",
                        text: "You are not subscribed to any strategies"
                      }}
                      tableShowMoreLink="/dashboard/signals"
                      hover
                      striped
                      tableHeaderColor="rose"
                      staticRows={4}
                      tableHead={["Timestamp", "Strategy", "Market", "Action"]}
                      tableData={this.signalsToTable()}
                      stripedColor="rose"
                    />
                  </GridItem>
                ) : (
                  Spinner.renderCardLoading()
                )}
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>

        <GridContainer spacing={32}>
          <GridItem
            className={classes.dashboardItem}
            xs={12}
            sm={12}
            md={12}
            lg={7}
          >
            <Card className={classes.dashboardCard}>
              <CardHeader color="danger" icon>
                <CardIcon color="danger">
                  {followingStrategiesLoaded ? (
                    <FavoriteBorder />
                  ) : (
                    <Spinner color="white" />
                  )}
                </CardIcon>
                <h4 className={classes.cardIconTitle}>
                  My Following Strategies
                </h4>
              </CardHeader>
              <CardBody
                padding={false}
                className={
                  followingStrategiesLoaded
                    ? classes.dashboardBody
                    : classes.dashboardCardLoading
                }
              >
                {followingStrategiesLoaded ? (
                  <Table
                    emptyData={{
                      link: "/dashboard/marketplace",
                      linkText: "Browse strategies",
                      text: "You are not following any strategies."
                    }}
                    hover
                    striped
                    tableHeaderColor="primary"
                    tableHead={[
                      "Name",
                      "Type",
                      "Market",
                      "Followers",
                      "Performance",
                      "Subscription"
                    ]}
                    tableData={this.followingStrategiesToTable()}
                    stripedColor="danger"
                    staticRows={3}
                    alignColls={[-3, -4, -5, 3, 4, 5]}
                    alignedColls={[
                      "center",
                      "center",
                      "center",
                      "center",
                      "center",
                      "center"
                    ]}
                  />
                ) : (
                  Spinner.renderCardLoading()
                )}
              </CardBody>
            </Card>
          </GridItem>

          <GridItem
            className={classes.dashboardItem}
            xs={12}
            sm={12}
            md={12}
            lg={5}
          >
            <Card className={classes.dashboardCard}>
              <CardHeader color="blue" icon>
                <CardIcon color="blue">
                  {userStrategiesLoaded ? <Notes /> : <Spinner color="white" />}
                </CardIcon>
                <h4 className={classes.cardIconTitle}>My Strategies</h4>
              </CardHeader>
              <CardBody
                padding={false}
                className={
                  userStrategiesLoaded
                    ? classes.dashboardBody
                    : classes.dashboardCardLoading
                }
              >
                {userStrategiesLoaded ? (
                  <Table
                    emptyData={{
                      link: "/dashboard/strategy/create",
                      linkText: "New strategy",
                      text: "You have not created any strategies."
                    }}
                    tableShowMoreLink="/dashboard/mystrategies"
                    hover
                    striped
                    tableHeaderColor="info"
                    tableHead={["Name", "Followers"]}
                    tableData={this.userStrategiesToTable(userStrategies)}
                    stripedColor="blue"
                    alignColls={[-1, 1]}
                    alignedColls={["center", "center"]}
                    staticRows={3}
                  />
                ) : (
                  Spinner.renderCardLoading()
                )}
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

function mapStateToProps(store, props) {
  return {
    userStrategiesLoaded: store.userStrategies.loaded,
    userStrategies: store.userStrategies.strategies,
    followingStrategiesLoaded: store.followingStrategies.loaded,
    followingStrategies: store.followingStrategies.strategies,
    signalsLoaded: store.signals.loaded,
    signals: store.signals.signals,
    newSignals: store.signals.newSignals
  };
}

const mapDispatchToProps = dispatch => ({
  loadUserStrategies: () => dispatch(getUserStrategies()),
  loadUserSignals: () => dispatch(getSignals()),
  loadFollowingStrategies: () => dispatch(getFollowingStrategies()),
  subscribe: (id, _subscribe) => dispatch(subscribe(id, _subscribe))
});

export default withRouter(
  withStyles(homeStyles)(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(Home)
  )
);
