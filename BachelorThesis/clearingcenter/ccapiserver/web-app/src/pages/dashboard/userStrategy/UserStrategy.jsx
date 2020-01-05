import React from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import MenuItem from "@material-ui/core/MenuItem";

import { Link as RouterLink, withRouter } from "react-router-dom";
import { GridContainer, GridItem } from "components/grid/Grid.jsx";
import { Card, CardBody, CardHeader, CardIcon } from "components/card/Card";
import TextField from "components/input/TextField";
import FiberNew from "@material-ui/icons/FiberNew";
import NumberFormat from "react-number-format";
import Button from "components/button/Button";
import Chip from "@material-ui/core/Chip";
import Container from "components/input/Container";
import AlertCircle from "mdi-material-ui/AlertCircle";

import userStrategyStyles from "styles/pages/dashboard/userStrategy/UserStrategy.jss";
import Strategy from "models/Strategy";
import { connect } from "react-redux";
import {
  createStrategy,
  getIndicators,
  getMarkets
} from "actions/strategyEdit/StrategyEdit";
import { pushNotification } from "actions/notification/Notification";

class UserStrategy extends React.Component {
  constructor(props) {
    super(props);
    let strategy = new Strategy();
    this.state = {
      strategy: strategy
    };
  }
  componentDidMount = () => {
    const { loadIndicators, loadMarkets } = this.props;
    loadIndicators();
    loadMarkets();
  };

  numberFormatFee(props) {
    const { inputRef, onChange, ...other } = props;

    return (
      <NumberFormat
        {...other}
        getInputRef={inputRef}
        onValueChange={values => {
          onChange({
            target: {
              value: values.value
            }
          });
        }}
        thousandSeparator
        suffix="  FKC"
      />
    );
  }

  handleFee = event => {
    const { strategy } = this.state;
    strategy.fee = event.target.value;
    this.setState({ strategy: strategy });
  };
  handleName = event => {
    const { strategy } = this.state;
    strategy.name = event.target.value;
    this.setState({ strategy: strategy });
  };

  handleMarket = event => {
    const { strategy } = this.state;
    strategy.market = event.target.value;
    this.setState({ strategy: strategy });
  };

  handleIndicators = event => {
    const { strategy } = this.state;
    strategy.indicators = event.target.value;
    this.setState({ strategy: strategy });
  };

  handleAbout = event => {
    const { strategy } = this.state;
    strategy.about = event.target.value;
    this.setState({ strategy: strategy });
  };
  handleSubmit = () => {
    const { strategy } = this.state;
    const { createStrategy, notify } = this.props;
    if (strategy.name === "" || strategy.fee === "" || strategy.market === "") {
      notify("Please fill in all required fields.");
    } else {
      createStrategy(strategy);
    }
  };
  createIndicatorsChipList() {
    const { classes, indicators } = this.props;
    const { strategy } = this.state;
    if (!strategy.indicators.length) return null;
    return (
      <Container labelColor="info" label="Indicators">
        <div className={classes.chips}>
          {strategy.indicators.map(selectedIndicatorId =>
            indicators.map((prop, key) => {
              if (prop.id === selectedIndicatorId) {
                return (
                  <Chip
                    onClick={() => {}}
                    variant="outlined"
                    className={classes.chipIndicator}
                    key={prop.id}
                    label={prop.name}
                  />
                );
              }
            })
          )}
        </div>
      </Container>
    );
  }
  createIndicatorList() {
    const { classes, indicators } = this.props;
    let menuItems = [];
    menuItems.push(
      <MenuItem key={"0"} disabled>
        Select Indicators
      </MenuItem>
    );
    indicators.map((prop, key) => {
      menuItems.push(
        <MenuItem value={prop.id} key={prop.id}>
          {prop.name}
        </MenuItem>
      );
    });

    return (
      <TextField
        id="outlined-select-currency"
        select
        fullwidth
        textFieldOutlineColor="Info"
        label="Indicators"
        className={classes.selectInput}
        SelectProps={{
          renderValue: () => {
            return "Select more...";
          },
          value: this.state.strategy.indicators,
          onChange: this.handleIndicators,
          multiple: true,
          autoWidth: true
        }}
        margin="normal"
        variant="outlined"
      >
        {menuItems}
      </TextField>
    );
  }
  createMarketList() {
    const { classes, markets } = this.props;
    let menuItems = [];
    markets.map((prop, key) => {
      menuItems.push(
        <MenuItem value={prop.id} key={prop.id}>
          {prop.name}
        </MenuItem>
      );
    });

    return (
      <TextField
        required
        id="outlined-select-currency"
        select
        fullwidth
        textFieldOutlineColor="Info"
        label="Markets"
        className={classes.selectInput}
        SelectProps={{
          value: this.state.strategy.market,
          onChange: this.handleMarket,
          MenuProps: {
            className: classes.selectMenu
          }
        }}
        margin="normal"
        variant="outlined"
      >
        {menuItems}
      </TextField>
    );
  }

  render() {
    const { classes } = this.props;
    const { strategy } = this.state;
    return (
      <div>
        <GridContainer justify="center">
          <GridItem xs={12} sm={10} md={8}>
            <Card>
              <CardHeader icon>
                <CardIcon color="info">
                  <FiberNew />
                </CardIcon>
                <h4 className={classes.cardIconTitle}>Create Strategy</h4>
              </CardHeader>
              <CardBody>
                <GridContainer spacing={8} className={classes.descriptionCard}>
                  <GridItem xs={12} sm={6}>
                    <GridContainer direction="column">
                      <GridItem>
                        <TextField
                          required
                          fullWidth
                          value={strategy.name}
                          onChange={this.handleName}
                          label="Strategy Name"
                          margin="normal"
                          textFieldOutlineColor="Info"
                          variant="outlined"
                          id="float"
                        />
                      </GridItem>
                      <GridItem>
                        <TextField
                          required
                          fullWidth
                          label="Fee"
                          value={strategy.fee}
                          onChange={this.handleFee}
                          id="formatted-numberformat-input"
                          margin="normal"
                          textFieldOutlineColor="Info"
                          variant="outlined"
                          InputProps={{
                            inputComponent: this.numberFormatFee,
                            fullWidth: true
                          }}
                        />
                      </GridItem>
                    </GridContainer>
                  </GridItem>
                  <GridItem xs={12} sm={6}>
                    <GridContainer direction="column">
                      <GridItem xs={12}>{this.createMarketList()}</GridItem>
                      <GridItem xs={12}>{this.createIndicatorList()}</GridItem>
                    </GridContainer>
                  </GridItem>

                  <GridItem xs={12}>
                    <GridContainer direction="column">
                      <GridItem xs={12}>
                        {this.createIndicatorsChipList()}
                      </GridItem>
                      <GridItem>
                        <TextField
                          label="About"
                          multiline
                          rows="6"
                          fullWidth
                          value={strategy.about}
                          onChange={this.handleAbout}
                          rowsMax="12"
                          margin="normal"
                          textFieldOutlineColor="Info"
                          variant="outlined"
                        />
                      </GridItem>
                    </GridContainer>
                    <GridContainer
                      direction="row"
                      justify="flex-end"
                      alignItems="flex-end"
                    >
                      <GridItem>
                        <Button color="info" onClick={this.handleSubmit}>
                          Save
                        </Button>
                      </GridItem>
                    </GridContainer>
                  </GridItem>
                </GridContainer>
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
    indicators: store.strategyEdit.indicators,
    markets: store.strategyEdit.markets
  };
}

const mapDispatchToProps = dispatch => ({
  loadIndicators: () => dispatch(getIndicators()),
  loadMarkets: () => dispatch(getMarkets()),
  createStrategy: strategy => dispatch(createStrategy(strategy)),
  notify: message => dispatch(pushNotification(message, "warning", AlertCircle))
});

export default withRouter(
  withStyles(userStrategyStyles)(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(UserStrategy)
  )
);
