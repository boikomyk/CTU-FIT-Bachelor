import React from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import { Link as RouterLink, withRouter } from "react-router-dom";
import AccountBalanceWallet from "@material-ui/icons/AccountBalanceWallet";
import Receipt from "@material-ui/icons/Receipt";
import AttachMoney from "@material-ui/icons/AttachMoney";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Link from "@material-ui/core/Link";
import PropTypes from "prop-types";

import NumberFormat from "react-number-format";
import { GridContainer, GridItem } from "components/grid/Grid.jsx";
import { Card, CardBody, CardHeader, CardIcon } from "components/card/Card.jsx";
import Button from "components/button/Button";
import Table from "components/table/Table";

import walletStyles from "styles/pages/dashboard/wallet/Wallet.jss";

import TextField from "components/input/TextField";
import { connect } from "react-redux";
import { getWallet, updateAmount } from "actions/wallet/Wallet";
import Spinner from "components/spinner/Spinner";
import { pushNotification } from "actions/notification/Notification";
import AlertCircle from "mdi-material-ui/AlertCircle";

class Wallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      numberFormat: ""
    };
  }
  numberFormatMoney(props) {
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
  handleAmount = event => {
    this.setState({ numberFormat: event.target.value });
  };
  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };
  handleAdd = () => {
    this.setState({ open: false });
    const { numberFormat } = this.state;
    const { addMoney, notify } = this.props;
    if (numberFormat > 0.01) {
      addMoney(numberFormat);
    } else {
      notify("Amount is below the minimum (0.01 FKC). Please try again.");
    }
  };

  componentDidMount = () => {
    const { loadWallet } = this.props;
    loadWallet();
  };

  transactionsToTable = wallet => {
    const { classes } = this.props;
    const transactions = [];
    wallet.transactions.forEach(function(transaction) {
      let amount = transaction.amount;
      let amountWrapper = "";
      if (transaction.action === "refund" || transaction.action === "income") {
        amountWrapper = (
          <b className={classes.successCellColor}>{"+ " + amount + " FKC"} </b>
        );
      }
      if (transaction.action === "payment") {
        amountWrapper = (
          <b className={classes.dangerCellColor}>
            {"- " + Math.abs(amount) + " FKC"}{" "}
          </b>
        );
      }
      if (transaction.action === "abort") {
        amountWrapper = <b>{amount + " FKC"} </b>;
      }

      transactions.push([
        transaction.id,
        <Link
          color="primary"
          to={{ pathname: "/dashboard/marketplace/" + transaction.strategyId }}
          component={RouterLink}
        >
          {transaction.strategyName}
        </Link>,
        transaction.action,
        amountWrapper
      ]);
    });
    return transactions;
  };

  render() {
    const { classes, fullContent, wallet, loaded } = this.props;
    const { numberFormat } = this.state;

    if (!fullContent) {
      return (
        <Card>
          <CardHeader color="success" icon>
            <CardIcon color="success">
              {loaded ? <AttachMoney /> : <Spinner color="white" />}
            </CardIcon>
            <h4 className={classes.cardIconTitle}>My balance</h4>
          </CardHeader>
          <CardBody>
            {loaded ? (
              <GridContainer direction="column">
                <GridItem>
                  <b>Available Amount: </b>
                  {wallet.availableBalance + " FKC"}
                </GridItem>
                <GridItem>
                  <b>Frozen Amount: </b>
                  {wallet.frozenBalance + " FKC"}
                </GridItem>
              </GridContainer>
            ) : (
              Spinner.renderCardLoading()
            )}
          </CardBody>
        </Card>
      );
    }
    return (
      <div>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            {" "}
            Add Fake Coins to my Wallet
          </DialogTitle>
          <DialogContent>
            <TextField
              readOnly={false}
              label="Amount"
              value={numberFormat}
              onChange={this.handleAmount}
              id="formatted-numberFormat-input"
              margin="normal"
              textFieldOutlineColor="Info"
              variant="outlined"
              InputProps={{
                inputComponent: this.numberFormatMoney,
                fullWidth: true
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="transparent">
              Cancel
            </Button>
            <Button onClick={this.handleAdd} color="success">
              Add
            </Button>
          </DialogActions>
        </Dialog>

        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="success" icon>
                <CardIcon color="success">
                  <AccountBalanceWallet />
                </CardIcon>
                <h4 className={classes.cardIconTitle}>My balance</h4>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem>
                    <b>Available Amount: </b>
                    {wallet.availableBalance + " FKC"}
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem>
                    <b>Frozen Amount: </b>
                    {wallet.frozenBalance + " FKC"}
                  </GridItem>
                </GridContainer>
                <GridContainer
                  direction="row"
                  justify="flex-end"
                  alignItems="flex-end"
                >
                  <GridItem>
                    <Button color="primary" onClick={this.handleClickOpen}>
                      Add FKC to Wallet
                    </Button>
                  </GridItem>
                </GridContainer>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
        <GridContainer className={classes.transactionsTable} justify="center">
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="success" icon>
                <CardIcon color="success">
                  <Receipt />
                </CardIcon>
                <h4 className={classes.cardIconTitle}>History</h4>
              </CardHeader>
              <CardBody>
                <Table
                  emptyData={{
                    text: "You have not any payment transaction."
                  }}
                  hover
                  stripedColor="success"
                  striped
                  tableHeaderColor="success"
                  tableHead={["ID", "Strategy Name", "Type", "Amount (FKC)"]}
                  tableData={this.transactionsToTable(wallet)}
                  alignColls={[-3, 3]}
                  alignedColls={["center", "center"]}
                />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
Wallet.defaultProps = {
  fullContent: true
};

Wallet.propTypes = {
  fullContent: PropTypes.bool
};

function mapStateToProps(store, props) {
  return {
    loaded: store.wallet.loaded,
    wallet: store.wallet.wallet
  };
}

const mapDispatchToProps = dispatch => ({
  loadWallet: () => dispatch(getWallet()),
  addMoney: amount => dispatch(updateAmount(amount)),
  notify: message => dispatch(pushNotification(message, "danger", AlertCircle))
});

export default withRouter(
  withStyles(walletStyles)(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(Wallet)
  )
);
