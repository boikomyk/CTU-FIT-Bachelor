import React from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import { Link as RouterLink, withRouter } from "react-router-dom";

import { GridContainer, GridItem } from "components/grid/Grid.jsx";
import { Card, CardBody, CardHeader, CardIcon } from "components/card/Card.jsx";
import userSignalsStyles from "styles/pages/dashboard/userSignals/UserSignals.jss";
import Table from "components/table/Table";

import Link from "@material-ui/core/Link";
import Pulse from "mdi-material-ui/Pulse";
import { connect } from "react-redux";
import { getSignals } from "actions/signals/Signals";
import Spinner from "components/spinner/Spinner";
import Signal from "models/Signal";
import FormControlLabel from "pages/dashboard/followingStrategies/FollowingStrategies";
import NewBox from "mdi-material-ui/NewBox";
class UserSignals extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount = () => {
    const { loadSignals } = this.props;
    loadSignals();
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

  render() {
    const { classes, loaded } = this.props;

    return (
      <div>
        <GridContainer justify="center">
          <GridItem
            className={classes.dashboardItem}
            xs={12}
            sm={12}
            md={10}
            lg={8}
          >
            <Card>
              <CardHeader color="rose" icon>
                <CardIcon color="rose">
                  {loaded ? <Pulse /> : <Spinner color="white" />}
                </CardIcon>
                <h4 className={classes.cardIconTitle}>My Signals</h4>
              </CardHeader>
              <CardBody padding={false} className={classes.dashboardBody}>
                {loaded ? (
                  <GridItem xs={12}>
                    <Table
                      emptyData={{
                        link: "/dashboard/marketplace",
                        linkText: "Browse strategies",
                        text: "No recent signals from any strategies"
                      }}
                      hover
                      striped
                      tableHeaderColor="rose"
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
      </div>
    );
  }
}
function mapStateToProps(store, props) {
  return {
    loaded: store.signals.loaded,
    signals: store.signals.signals,
    newSignals: store.signals.newSignals
  };
}

const mapDispatchToProps = dispatch => ({
  loadSignals: () => dispatch(getSignals())
});

export default withRouter(
  withStyles(userSignalsStyles)(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(UserSignals)
  )
);
