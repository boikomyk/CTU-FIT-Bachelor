import React from "react";
import { Link as RouterLink, withRouter } from "react-router-dom";

import withStyles from "@material-ui/core/styles/withStyles";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import Favorite from "@material-ui/icons/Favorite";
import Edit from "@material-ui/icons/Edit";
import Info from "@material-ui/icons/Info";
import InsertChartOutlined from "@material-ui/icons/InsertChartOutlined";
import Pulse from "mdi-material-ui/Pulse";
import ChartLine from "mdi-material-ui/ChartLine";
import IconButton from "@material-ui/core/IconButton";
import Chip from "@material-ui/core/Chip";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import AlertCircle from "mdi-material-ui/AlertCircle";

import { GridContainer, GridItem } from "components/grid/Grid.jsx";
import strategyStyles from "styles/pages/dashboard/strategy/Strategy.jss";
import { Card, CardBody, CardHeader, CardIcon } from "components/card/Card.jsx";

import TextField from "components/input/TextField";
import Table from "components/table/Table";
import Button from "components/button/Button";
import Tabs from "components/tabs/Tabs";
import Container from "components/input/Container";
import Chart from "components/dashboard/chart/Chart";
import { connect } from "react-redux";
import {
  follow,
  subscribe,
  getCandles,
  getSignals,
  getStrategy,
  unsetStrategy
} from "actions/strategy/Strategy";
import { pushNotification } from "actions/notification/Notification";
import Spinner from "components/spinner/Spinner";
import Checkbox from "@material-ui/core/Checkbox";

class Strategy extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    const {
      match: { params },
      loadStrategy,
      loadCandles,
      loadSignals
    } = this.props;
    loadStrategy(params.id);
    loadCandles(params.id);
    loadSignals(params.id);
  };

  handleAddToFollowing = event => {
    const { strategy, follow, unfollowNotificationWarning } = this.props;
    if (strategy.subscribe) {
      unfollowNotificationWarning();
    } else {
      follow(strategy.id, !strategy.follow);
    }
  };
  handleOnSubscribe = event => {
    const { strategy, subscribe } = this.props;
    subscribe(strategy.id, !strategy.subscribe);
  };
  renderControlButtons() {
    const { classes, isSubscribed, isFollowed, isOwned } = this.props;
    if (isOwned === true) {
      const {
        match: { params }
      } = this.props;
      return (
        <Button
          color="info"
          to={{ pathname: "/dashboard/marketplace/" + params.id + "/edit" }}
          component={RouterLink}
        >
          <Edit className={classes.buttonIcons} />
          Edit
        </Button>
      );
    }
    return (
      <div>
        <FormControlLabel
          control={
            <Switch
              checked={isSubscribed}
              classes={{
                switchBase: classes.subscribe
              }}
              className={classes.subscribe}
              value={isSubscribed}
              onChange={this.handleOnSubscribe}
              color="primary"
            />
          }
          label={
            isSubscribed ? (
              <span className={classes.whiteLabel}>Unsubscribe</span>
            ) : (
              <span className={classes.whiteLabel}>Subscribe</span>
            )
          }
        />
        <FormControlLabel
          control={
            <Checkbox
              icon={<FavoriteBorder />}
              classes={{
                root: classes.follow,
                checked: classes.followChecked
              }}
              onClick={this.handleAddToFollowing}
              checkedIcon={<Favorite />}
              value="favorite"
              checked={isFollowed}
            />
          }
          label={
            isFollowed ? (
              <span className={classes.whiteLabel}>Unfollow</span>
            ) : (
              <span className={classes.whiteLabel}>Follow</span>
            )
          }
        />
      </div>
    );
  }
  timeStatisticsToTable = strategy => {
    return Object.keys(strategy.statistics.Time).map(key => [
      key,
      strategy.statistics.Time[key]
    ]);
  };

  performanceStatisticsToTable = strategy => {
    const { classes } = this.props;
    const statistics = strategy.statistics.Performance;
    const totalPerformance = statistics["Total performance"];
    let performanceWrapper = "";
    if (totalPerformance === 0)
      performanceWrapper = <b>{totalPerformance + "%"} </b>;
    if (totalPerformance > 0)
      performanceWrapper = (
        <b className={classes.successCellColor}>
          {"+" + totalPerformance + "%"}{" "}
        </b>
      );
    if (totalPerformance < 0)
      performanceWrapper = (
        <b className={classes.dangerCellColor}>{totalPerformance + "%"} </b>
      );

    statistics["Total performance"] = performanceWrapper;
    return Object.keys(statistics).map(key => [key, statistics[key]]);
  };

  signalsToTable = signals => {
    const _signals = [];
    signals.forEach(signal => {
      _signals.push(signal.toArray());
    });
    return _signals;
  };

  renderChart() {
    const { classes, candles, candlesLoaded } = this.props;

    if (candlesLoaded && !candles.length) return;

    return (
      <GridContainer className={classes.graphContainer} justify="center">
        <GridItem xs={12}>
          <Card>
            <CardHeader icon>
              <CardIcon color="primary">
                {candlesLoaded ? <ChartLine /> : <Spinner color="white" />}
              </CardIcon>
              <h4 className={classes.cardIconTitle}>Trade Graph</h4>
            </CardHeader>
            <CardBody>
              {candlesLoaded ? (
                <GridContainer spacing={8}>
                  <div className={classes.graph}>
                    <Chart width={1000} data={candles} />
                  </div>
                </GridContainer>
              ) : (
                Spinner.renderCardLoading()
              )}
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
  render() {
    const { strategyLoaded, signalsLoaded } = this.props;

    const { classes, strategy, signals } = this.props;

    return (
      <div>
        <GridContainer className={classes.buttonControls} justify="flex-end">
          {this.renderControlButtons()}
        </GridContainer>
        {this.renderChart()}

        {strategyLoaded && signalsLoaded && (
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={10}>
              <Tabs
                alignCenter
                tabs={[
                  {
                    tabButton: "Description",
                    tabIcon: Info,
                    tabColor: "info",
                    tabContent: (
                      <Card>
                        <CardHeader icon>
                          <h4 className={classes.cardIconTitle}>Description</h4>
                        </CardHeader>
                        <CardBody>
                          <GridContainer spacing={8}>
                            <GridItem xs={12} sm={6}>
                              <GridContainer direction="column">
                                {strategy.owns !== undefined && (
                                  <GridItem>
                                    <TextField
                                      readOnly
                                      fullWidth
                                      multiline
                                      label="API Key"
                                      defaultValue={strategy.API}
                                      margin="normal"
                                      textFieldOutlineColor="Primary"
                                      variant="outlined"
                                    />
                                  </GridItem>
                                )}

                                <GridItem>
                                  <TextField
                                    readOnly
                                    fullWidth
                                    multiline
                                    label="Name"
                                    defaultValue={strategy.name}
                                    margin="normal"
                                    textFieldOutlineColor="Info"
                                    variant="outlined"
                                  />
                                </GridItem>
                                <GridItem>
                                  <TextField
                                    readOnly
                                    fullWidth
                                    multiline
                                    label="Author"
                                    defaultValue={strategy.author}
                                    margin="normal"
                                    textFieldOutlineColor="Info"
                                    variant="outlined"
                                  />
                                </GridItem>
                                <GridItem>
                                  <TextField
                                    readOnly
                                    fullWidth
                                    multiline
                                    label="Type"
                                    defaultValue={strategy.type}
                                    margin="normal"
                                    textFieldOutlineColor="Info"
                                    variant="outlined"
                                  />
                                </GridItem>
                                <GridItem>
                                  <TextField
                                    fullWidth
                                    multiline
                                    label="Fee"
                                    defaultValue={strategy.fee + " FKC"}
                                    margin="normal"
                                    textFieldOutlineColor="Info"
                                    variant="outlined"
                                    readOnly
                                  />
                                </GridItem>
                              </GridContainer>
                            </GridItem>
                            <GridItem xs={12} sm={6}>
                              <GridContainer direction="column">
                                <GridItem>
                                  <TextField
                                    readOnly
                                    fullWidth
                                    multiline
                                    label="Market"
                                    defaultValue={strategy.market}
                                    margin="normal"
                                    textFieldOutlineColor="Info"
                                    variant="outlined"
                                  />
                                </GridItem>
                                <GridItem>
                                  <Container
                                    labelColor="info"
                                    label="Indicators"
                                  >
                                    {strategy.indicators.map((prop, key) => {
                                      return (
                                        <Chip
                                          onClick={() => {}}
                                          variant="outlined"
                                          className={classes.chipIndicator}
                                          key={key}
                                          label={prop.name}
                                        />
                                      );
                                    })}
                                  </Container>
                                </GridItem>
                              </GridContainer>
                            </GridItem>
                            <GridItem xs={12}>
                              <GridContainer direction="column">
                                <GridItem>
                                  <TextField
                                    readOnly
                                    label="About"
                                    multiline
                                    rows="6"
                                    fullWidth
                                    defaultValue={strategy.about}
                                    margin="normal"
                                    textFieldOutlineColor="Info"
                                    variant="outlined"
                                  />
                                </GridItem>
                              </GridContainer>
                            </GridItem>
                          </GridContainer>
                        </CardBody>
                      </Card>
                    )
                  },
                  {
                    tabButton: "Statistics",
                    tabIcon: InsertChartOutlined,
                    tabColor: "blue",
                    tabContent: (
                      <Card>
                        <CardHeader icon>
                          <h4 className={classes.cardIconTitle}>Statistics</h4>
                        </CardHeader>
                        <CardBody>
                          <GridContainer className={classes.statisticsCard}>
                            <GridItem xs={12}>
                              <Table
                                footer={false}
                                hover
                                striped
                                stripedColor="blue"
                                tableHeaderColor="primary"
                                tableHead={["Performance", ""]}
                                tableData={this.performanceStatisticsToTable(
                                  strategy
                                )}
                                alignColls={[1]}
                                alignedColls={["right"]}
                              />
                            </GridItem>
                          </GridContainer>
                          <GridContainer className={classes.statisticsCard}>
                            <GridItem xs={12}>
                              <Table
                                footer={false}
                                hover
                                striped
                                stripedColor="blue"
                                tableHeaderColor="primary"
                                tableHead={["Time", ""]}
                                tableData={this.timeStatisticsToTable(strategy)}
                                alignColls={[1]}
                                alignedColls={["right"]}
                              />
                            </GridItem>
                          </GridContainer>
                        </CardBody>
                      </Card>
                    )
                  },
                  {
                    tabButton: "Signals",
                    tabIcon: Pulse,
                    tabColor: "rose",
                    tabContent: (
                      <Card>
                        <CardHeader icon>
                          <h4 className={classes.cardIconTitle}>Signals</h4>
                        </CardHeader>
                        <CardBody>
                          <GridContainer className={classes.signalCard}>
                            <GridItem xs={12}>
                              <Table
                                footer={false}
                                hover
                                striped
                                stripedColor="rose"
                                tableHeaderColor="rose"
                                tableHead={["Timestamp", "Market", "Action"]}
                                tableData={this.signalsToTable(signals)}
                              />
                            </GridItem>
                          </GridContainer>
                        </CardBody>
                      </Card>
                    )
                  }
                ]}
              />
            </GridItem>
          </GridContainer>
        )}
      </div>
    );
  }
}

function mapStateToProps(store, props) {
  return {
    candlesLoaded: store.strategy.candlesLoaded,
    signalsLoaded: store.strategy.signalsLoaded,
    strategyLoaded: store.strategy.strategyLoaded,
    strategy: store.strategy.strategy,
    candles: store.strategy.candles,
    signals: store.strategy.signals,
    isSubscribed: store.strategy.subscribe,
    isFollowed: store.strategy.follow,
    isOwned: store.strategy.owns
  };
}

const mapDispatchToProps = dispatch => ({
  loadStrategy: id => dispatch(getStrategy(id)),
  loadCandles: id => dispatch(getCandles(id)),
  loadSignals: id => dispatch(getSignals(id)),
  follow: (id, _follow) => dispatch(follow(id, _follow)),
  subscribe: (id, _subscribe) => dispatch(subscribe(id, _subscribe)),
  unfollowNotificationWarning: () =>
    dispatch(
      pushNotification(
        "You can not unfollow this strategy! First you need to unsubscribe this strategy.",
        "warning",
        AlertCircle
      )
    )
});

export default withRouter(
  withStyles(strategyStyles)(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(Strategy)
  )
);
