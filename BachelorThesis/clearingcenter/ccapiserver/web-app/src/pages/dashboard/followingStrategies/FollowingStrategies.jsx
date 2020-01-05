import React from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import { Link as RouterLink, withRouter } from "react-router-dom";

import { GridContainer, GridItem } from "components/grid/Grid.jsx";
import { Card, CardBody, CardHeader, CardIcon } from "components/card/Card.jsx";
import followingStrategiesStyles from "styles/pages/dashboard/followingStrategies/FollowingStrategies.jss";
import Table from "components/table/Table";
import Switch from "@material-ui/core/Switch";

import Link from "@material-ui/core/Link";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import { connect } from "react-redux";
import {
  getFollowingStrategies,
  subscribe
} from "actions/followingStrategies/FollowingStrategies";
import Spinner from "components/spinner/Spinner";
import FormControlLabel from "@material-ui/core/FormControlLabel";

class FollowingStrategies extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount = () => {
    const { loadStrategies } = this.props;
    loadStrategies();
  };

  followingStrategiesToTable() {
    const { subscribe, strategies, classes } = this.props;
    const _strategies = [];
    strategies.forEach(function(strategy) {
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
        strategy.author,
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
            lg={10}
          >
            <Card className={classes.dashboardCard}>
              <CardHeader color="danger" icon>
                <CardIcon color="danger">
                  {loaded ? <FavoriteBorder /> : <Spinner color="white" />}
                </CardIcon>
                <h4 className={classes.cardIconTitle}>
                  My Following Strategies
                </h4>
              </CardHeader>
              <CardBody padding={false} className={classes.dashboardBody}>
                {loaded ? (
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
                      "Author",
                      "Type",
                      "Market",
                      "Followers",
                      "Performance",
                      "Subscription"
                    ]}
                    tableData={this.followingStrategiesToTable()}
                    stripedColor="danger"
                    staticRows={3}
                    alignColls={[-4, -5, -6, 4, 5, 6]}
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
        </GridContainer>
      </div>
    );
  }
}
function mapStateToProps(store, props) {
  return {
    loaded: store.followingStrategies.loaded,
    strategies: store.followingStrategies.strategies
  };
}

const mapDispatchToProps = dispatch => ({
  loadStrategies: async () => await dispatch(getFollowingStrategies()),
  subscribe: (id, _subscribe) => dispatch(subscribe(id, _subscribe))
});

export default withRouter(
  withStyles(followingStrategiesStyles)(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(FollowingStrategies)
  )
);
