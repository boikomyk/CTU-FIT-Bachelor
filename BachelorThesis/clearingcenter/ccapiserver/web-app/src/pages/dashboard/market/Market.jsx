import React from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import { Link as RouterLink, withRouter } from "react-router-dom";
import Store from "@material-ui/icons/Store";
import { connect } from "react-redux";
import { GridContainer, GridItem } from "components/grid/Grid.jsx";
import { Card, CardBody, CardHeader, CardIcon } from "components/card/Card.jsx";

import Table from "components/table/Table";
import Link from "@material-ui/core/Link";
import { getStrategies } from "actions/strategies/Strategies";

import marketStyles from "styles/pages/dashboard/market/Market.jss";

class Market extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount = () => {
    const { loadStrategies } = this.props;
    loadStrategies();
  };

  strategiesToTable = strategies => {
    const { classes } = this.props;
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
      _strategies.push([
        <Link
          color="primary"
          to={{ pathname: "/dashboard/marketplace/" + strategy.id }}
          component={RouterLink}
        >
          {strategy.name}
        </Link>,
        strategy.author,
        strategy.type,
        strategy.followers,
        strategy.market,
        performanceWrapper
      ]);
    });
    return _strategies;
  };

  render() {
    const { classes, strategies, loaded } = this.props;

    if (!loaded) return <div />;
    return (
      <div>
        <GridContainer>
          <GridItem xs={12}>
            <Card>
              <CardHeader color="primary" icon>
                <CardIcon color="primary">
                  <Store />
                </CardIcon>
                <h4 className={classes.cardIconTitle}>Marketplace</h4>
              </CardHeader>
              <CardBody>
                <Table
                  hover
                  striped
                  tableHeaderColor="primary"
                  tableHead={[
                    "Name",
                    "Author",
                    "Type",
                    "Followers",
                    "Market",
                    "Performance"
                  ]}
                  tableData={this.strategiesToTable(strategies)}
                />
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
    loaded: store.strategies.loaded,
    strategies: store.strategies.strategies
  };
}

const mapDispatchToProps = dispatch => ({
  loadStrategies: () => dispatch(getStrategies())
});

export default withRouter(
  withStyles(marketStyles)(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(Market)
  )
);
