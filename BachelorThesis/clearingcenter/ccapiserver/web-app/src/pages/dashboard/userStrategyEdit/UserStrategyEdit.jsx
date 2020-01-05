import React from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import MenuItem from "@material-ui/core/MenuItem";
import history from "helpers/history/History";

import { Link as RouterLink, withRouter } from "react-router-dom";
import { GridContainer, GridItem } from "components/grid/Grid.jsx";
import { Card, CardBody, CardHeader, CardIcon } from "components/card/Card";
import TextField from "components/input/TextField";
import FiberNew from "@material-ui/icons/FiberNew";
import NumberFormat from "react-number-format";
import Button from "components/button/Button";
import Chip from "@material-ui/core/Chip";
import Container from "components/input/Container";

import userStrategyEditStyles from "styles/pages/dashboard/userStrategyEdit/UserStrategyEdit.jss";
import Strategy from "models/Strategy";
import { connect } from "react-redux";
import {
  saveStrategy,
  getEditedStrategy
} from "actions/strategyEdit/StrategyEdit";
import { pushNotification } from "actions/notification/Notification";
import AlertCircle from "mdi-material-ui/AlertCircle";

class UserStrategyEdit extends React.Component {
  constructor(props) {
    super(props);
    let strategy = new Strategy();
    this.state = {
      strategy: strategy
    };
  }
  componentDidMount = () => {
    const {
      match: { params },
      loadStrategy
    } = this.props;
    loadStrategy(params.id).then(() => {
      const { strategy } = this.props;
      this.setState({ strategy: strategy });
    });
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
  handleChange = (event, type) => {
    const { strategy } = this.state;

    switch (type) {
      case "name":
        strategy.name = event.target.value;
        break;
      case "fee":
        strategy.fee = event.target.value;
        break;
      case "about":
        strategy.about = event.target.value;
        break;
      case "market":
        strategy.market = event.target.value;
        break;
      case "indicators":
        strategy.indicators = event.target.value;
        break;
      default:
        break;
    }
    this.setState({ strategy: strategy });
  };

  handleSubmit = () => {
    const { strategy } = this.state;
    const { saveStrategy } = this.props;
    const { notify } = this.props;
    if (strategy.name === "" || strategy.fee === "" || strategy.market === "") {
      notify("Please fill in all required fields.");
    } else {
      saveStrategy(strategy);
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
          onChange: e => this.handleChange(e, "indicators"),
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
        id="outlined-select-currency"
        select
        fullwidth
        textFieldOutlineColor="Info"
        label="Markets"
        className={classes.selectInput}
        SelectProps={{
          value: this.state.strategy.market,
          onChange: e => this.handleChange(e, "market"),
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
    const { classes, loaded } = this.props;

    if (!loaded) return <div />;
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
                <h4 className={classes.cardIconTitle}>Edit Strategy</h4>
              </CardHeader>
              <CardBody>
                <GridContainer spacing={8} className={classes.descriptionCard}>
                  <GridItem xs={12} sm={6}>
                    <GridContainer direction="column">
                      {strategy.owns && (
                        <GridItem>
                          <TextField
                            readOnly
                            fullWidth
                            multiline
                            label="API Key"
                            value={strategy.API}
                            margin="normal"
                            textFieldOutlineColor="Primary"
                            variant="outlined"
                          />
                        </GridItem>
                      )}
                      <GridItem>
                        <TextField
                          required
                          fullWidth
                          value={strategy.name}
                          onChange={e => this.handleChange(e, "name")}
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
                          onChange={e => this.handleChange(e, "fee")}
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
                          onChange={e => this.handleChange(e, "about")}
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
    loaded: store.strategyEdit.loaded,
    strategy: store.strategyEdit.strategy,
    indicators: store.strategyEdit.indicators,
    markets: store.strategyEdit.markets
  };
}

const mapDispatchToProps = dispatch => ({
  loadStrategy: async id => await dispatch(getEditedStrategy(id)),
  saveStrategy: strategy => dispatch(saveStrategy(strategy)),
  notify: message => dispatch(pushNotification(message, "warning", AlertCircle))
});

export default withRouter(
  withStyles(userStrategyEditStyles)(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(UserStrategyEdit)
  )
);
