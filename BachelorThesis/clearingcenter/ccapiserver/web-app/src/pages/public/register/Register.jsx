import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import Email from "@material-ui/icons/Email";
import { Link as RouterLink, NavLink, withRouter } from "react-router-dom";
import Link from "@material-ui/core/Link";
import { connect } from "react-redux";
import AccountPlus from "mdi-material-ui/AccountPlus";
import { GridContainer, GridItem } from "components/grid/Grid.jsx";
import Button from "components/button/Button.jsx";
import { Card, CardBody } from "components/card/Card.jsx";
import TextField from "components/input/TextField";
import registerStyles from "styles/pages/public/register/Register.jss";
import { CardHeader, CardIcon } from "components/card/Card";
import { register } from "actions/register/Register";
import { verifyEmail, verifyLength } from "helpers/validation/Validation";
import Spinner from "components/spinner/Spinner";
import Eye from "mdi-material-ui/Eye";
import EyeOff from "mdi-material-ui/EyeOff";
import { pushNotification } from "actions/notification/Notification";
import AlertCircle from "mdi-material-ui/AlertCircle";
import history from "helpers/history/History";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import getTermsAndConditions from "constants/TermsAndConditions";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      email: "",
      confirmPassword: "",
      username: "",
      openTerms: false,
      terms: false,
      masked: false,
      maskedConfirm: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleOpenDialog = () => {
    this.setState({ openTerms: true });
  };

  handleEmail = event => {
    this.setState({ email: event.target.value });
  };
  handlePassword = event => {
    this.setState({ password: event.target.value });
  };
  handleConfirmPassword = event => {
    this.setState({ confirmPassword: event.target.value });
  };
  handleUsername = event => {
    this.setState({ username: event.target.value });
  };
  handleTerms = event => {
    const { terms } = this.state;
    this.setState({ terms: !terms });
  };

  handleSubmit(event) {
    event.preventDefault();
    const { username, email, password, terms, confirmPassword } = this.state;
    const { notify } = this.props;

    if (!terms) {
      notify("Please agree to the terms of use.");
      return;
    }

    if (!verifyEmail(email)) {
      notify("The Email is not valid.");
      return;
    }
    if (!verifyLength(password, 4)) {
      notify("The Password must be at least 4 characters.");
      return;
    }
    if (!verifyLength(username, 4)) {
      notify("The Username must be at least 4 characters.");
      return;
    }

    if (password !== confirmPassword) {
      notify("The Password confirmation does not match.");
      return;
    }
    if (username && password && email) {
      const { register } = this.props;
      register(username, email, password);
    }
  }
  handleClose = () => {
    this.setState({ openTerms: false });
  };
  renderDialog() {
    return (
      <Dialog
        open={this.state.openTerms}
        fullWidth={true}
        maxWidth={"lg"}
        onClose={this.handleClose}
        scroll={"body"}
        aria-labelledby="scroll-dialog-title"
      >
        <DialogContent>{getTermsAndConditions()}</DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="transparent">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  render() {
    const { classes, loaded } = this.props;
    const {
      username,
      email,
      password,
      masked,
      maskedConfirm,
      confirmPassword
    } = this.state;
    return (
      <div className={"bodyGradient"}>
        <div className={classes.container}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={10} md={8}>
              <Card>
                <CardHeader icon>
                  <CardIcon color="rose">
                    {loaded ? <AccountPlus /> : <Spinner color="white" />}
                  </CardIcon>
                  <h4 className={classes.cardIconTitle}>Sign up</h4>
                </CardHeader>
                <CardBody>
                  <GridContainer justify="center">
                    <GridItem xs={12} sm={10} md={8}>
                      <div className={classes.center}>
                        Already have an account?{" "}
                        <Link
                          to={{ pathname: "/login" }}
                          component={RouterLink}
                        >
                          Log in
                        </Link>
                      </div>
                      <GridItem>
                        <TextField
                          fullWidth
                          value={username}
                          label="Username"
                          margin="normal"
                          onChange={this.handleUsername}
                          textFieldOutlineColor="Rose"
                          variant="outlined"
                          id="username"
                        />
                      </GridItem>
                      <GridItem>
                        <TextField
                          fullWidth
                          value={email}
                          label="Email Address"
                          margin="normal"
                          onChange={this.handleEmail}
                          textFieldOutlineColor="Rose"
                          variant="outlined"
                          id="email"
                        />
                      </GridItem>
                      <GridItem>
                        <TextField
                          fullWidth
                          value={password}
                          type={masked ? "text" : "password"}
                          label="Password"
                          onChange={this.handlePassword}
                          margin="normal"
                          textFieldOutlineColor="Rose"
                          variant="outlined"
                          id="password"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                {masked ? (
                                  <EyeOff
                                    className={classes.eye}
                                    onClick={() => {
                                      this.setState({ masked: false });
                                    }}
                                  />
                                ) : (
                                  <Eye
                                    className={classes.eye}
                                    onClick={() => {
                                      this.setState({ masked: true });
                                    }}
                                  />
                                )}
                              </InputAdornment>
                            )
                          }}
                        />
                      </GridItem>
                      <GridItem>
                        <TextField
                          fullWidth
                          value={confirmPassword}
                          type={maskedConfirm ? "text" : "password"}
                          label="Confirm Password"
                          onChange={this.handleConfirmPassword}
                          margin="normal"
                          textFieldOutlineColor="Rose"
                          variant="outlined"
                          id="confirmPassword"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                {maskedConfirm ? (
                                  <EyeOff
                                    className={classes.eye}
                                    onClick={() => {
                                      this.setState({ maskedConfirm: false });
                                    }}
                                  />
                                ) : (
                                  <Eye
                                    className={classes.eye}
                                    onClick={() => {
                                      this.setState({ maskedConfirm: true });
                                    }}
                                  />
                                )}
                              </InputAdornment>
                            )
                          }}
                        />
                      </GridItem>
                      <GridItem>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={this.state.terms}
                              onChange={this.handleTerms}
                              color="primary"
                            />
                          }
                          label={
                            <span>
                              I have read, understand and accept{" "}
                              <Link
                                color="primary"
                                onClick={this.handleOpenDialog}
                              >
                                terms and conditions
                              </Link>
                            </span>
                          }
                        />
                      </GridItem>
                      <GridItem>
                        <div className={classes.center}>
                          <Button
                            round
                            className={classes.submit}
                            onClick={this.handleSubmit}
                            color="rose"
                          >
                            Sign up
                          </Button>
                        </div>
                      </GridItem>
                    </GridItem>
                  </GridContainer>
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
          {this.renderDialog()}
        </div>
      </div>
    );
  }
}

function mapStateToProps(store, props) {
  return {
    loaded: store.register.loaded
  };
}

const mapDispatchToProps = dispatch => ({
  register: (username, email, password) =>
    dispatch(register(username, email, password)),
  notify: message => dispatch(pushNotification(message, "warning", AlertCircle))
});

export default withRouter(
  withStyles(registerStyles)(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(Register)
  )
);
