import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import Email from "@material-ui/icons/Email";
import { Link as RouterLink, withRouter } from "react-router-dom";
import Link from "@material-ui/core/Link";
import { connect } from "react-redux";
import Account from "mdi-material-ui/Account";
import Eye from "mdi-material-ui/Eye";
import { GridContainer, GridItem } from "components/grid/Grid.jsx";
import Button from "components/button/Button.jsx";
import { Card, CardBody } from "components/card/Card.jsx";
import TextField from "components/input/TextField";
import history from "helpers/history/History";
import loginStyles from "styles/pages/public/login/Login.jss";
import { login } from "actions/login/Login";
import { CardHeader, CardIcon } from "components/card/Card";
import FormGroup from "@material-ui/core/FormGroup";
import Pulse from "pages/dashboard/home/Home";
import Spinner from "components/spinner/Spinner";
import EyeOff from "mdi-material-ui/EyeOff";
import { verifyEmail } from "helpers/validation/Validation";
import { pushNotification } from "actions/notification/Notification";
import AlertCircle from "mdi-material-ui/AlertCircle";
import { confirmEmail } from "actions/register/Register";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      email: "",
      masked: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleEmail = event => {
    this.setState({ email: event.target.value });
  };
  handlePassword = event => {
    this.setState({ password: event.target.value });
  };
  componentDidMount = () => {
    const params = new URLSearchParams(this.props.location.search);
    const token = params.get("token");
    const username = params.get("username");

    if (username && token) {
      const { confirmEmail } = this.props;
      confirmEmail(username, token);
    }
  };

  handleSubmit(event) {
    event.preventDefault();
    const { email, password } = this.state;
    const { notify } = this.props;
    if (!verifyEmail(email)) {
      notify("The Email is not valid.");
      return;
    }
    if (password && email) {
      const { login } = this.props;
      login(email, password);
    }
  }
  render() {
    const { classes, loaded } = this.props;
    const { email, masked, password } = this.state;
    return (
      <div className={"bodyGradient"}>
        <div className={classes.container}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={10} md={8}>
              <Card>
                <CardHeader icon>
                  <CardIcon color="primary">
                    {loaded === undefined || loaded ? (
                      <Account />
                    ) : (
                      <Spinner color="white" />
                    )}
                  </CardIcon>
                  <h4 className={classes.cardIconTitle}>Login</h4>
                </CardHeader>
                <CardBody>
                  <GridContainer justify="center">
                    <GridItem xs={12} sm={10} md={8}>
                      <div className={classes.center}>
                        Don't have an account yet?{" "}
                        <Link
                          color="primary"
                          to={{ pathname: "/register" }}
                          component={RouterLink}
                        >
                          Create an account
                        </Link>
                      </div>

                      <form onSubmit={this.handleSubmit}>
                        <FormGroup>
                          <TextField
                            fullWidth
                            autoFocus
                            value={email}
                            label="Email Address"
                            margin="normal"
                            type="email"
                            onChange={this.handleEmail}
                            textFieldOutlineColor="Primary"
                            variant="outlined"
                            id="email"
                          />
                        </FormGroup>
                        <FormGroup>
                          <TextField
                            fullWidth
                            value={password}
                            type={masked ? "text" : "password"}
                            label="Password"
                            onChange={this.handlePassword}
                            margin="normal"
                            textFieldOutlineColor="Primary"
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
                        </FormGroup>
                        <div className={classes.center}>
                          <Button
                            round
                            className={classes.submit}
                            type="submit"
                            color="primary"
                          >
                            Login
                          </Button>
                        </div>
                      </form>
                    </GridItem>
                  </GridContainer>
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
      </div>
    );
  }
}

function mapStateToProps(store, props) {
  return {
    loaded: store.login.loaded
  };
}

const mapDispatchToProps = dispatch => ({
  login: (mail, password) => dispatch(login(mail, password)),
  confirmEmail: (username, token) => dispatch(confirmEmail(username, token)),
  notify: message => dispatch(pushNotification(message, "warning", AlertCircle))
});

export default withRouter(
  withStyles(loginStyles)(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(Login)
  )
);
