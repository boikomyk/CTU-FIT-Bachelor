import React from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import { Link as RouterLink, withRouter } from "react-router-dom";

import { GridContainer, GridItem } from "components/grid/Grid.jsx";
import { Card, CardBody, CardHeader, CardIcon } from "components/card/Card.jsx";
import userStrategiesStyles from "styles/pages/dashboard/userStrategies/UserStrategies.jss";
import Table from "components/table/Table";

import Link from "@material-ui/core/Link";
import Notes from "@material-ui/icons/Notes";
import { connect } from "react-redux";
import { getUserStrategies } from "actions/userStrategies/UserStrategies";
import Spinner from "components/spinner/Spinner";

class UserStrategies extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount = () => {
    const { loadStrategies } = this.props;
    loadStrategies();
  };
  strategiesToTable = strategies => {
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
        strategy.followers,
        strategy.API
      ]);
    });
    return _strategies;
  };

  render() {
    const { classes, strategies, loaded } = this.props;
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
              <CardHeader color="blue" icon>
                <CardIcon color="blue">
                  {loaded ? <Notes /> : <Spinner color="white" />}
                </CardIcon>
                <h4 className={classes.cardIconTitle}>My Strategies</h4>
              </CardHeader>
              <CardBody padding={false} className={classes.dashboardBody}>
                {loaded ? (
                  <GridItem xs={12}>
                    <Table
                      stripedColor="blue"
                      emptyData={{
                        link: "/dashboard/strategy/create",
                        linkText: "New strategy",
                        text: "You have not created any strategies."
                      }}
                      hover
                      striped
                      alignColls={[-1, 1]}
                      alignedColls={["center", "center"]}
                      tableHeaderColor="blue"
                      tableHead={["Name", "Followers", "API Key"]}
                      tableData={this.strategiesToTable(strategies)}
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
    loaded: store.userStrategies.loaded,
    strategies: store.userStrategies.strategies
  };
}

const mapDispatchToProps = dispatch => ({
  loadStrategies: () => dispatch(getUserStrategies())
});

export default withRouter(
  withStyles(userStrategiesStyles)(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(UserStrategies)
  )
);
