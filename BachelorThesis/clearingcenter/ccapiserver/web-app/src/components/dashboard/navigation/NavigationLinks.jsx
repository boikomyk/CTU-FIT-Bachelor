import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import Hidden from "@material-ui/core/Hidden";
import { Link as RouterLink, NavLink, withRouter } from "react-router-dom";

import ExitToApp from "@material-ui/icons/ExitToApp";
import Dashboard from "@material-ui/icons/Dashboard";

import Button from "components/button/Button.jsx";
import navigationLinksStyles from "styles/components/dashboard/navigation/NavigationLinks.jss";
import { connect } from "react-redux";
import { logout } from "actions/login/Login";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

class NavigationLinks extends React.Component {
  state = {
    open: false
  };
  handleClick = () => {
    this.setState({ open: !this.state.open });
  };
  handleLogoutClick = () => {
    const { logout } = this.props;
    logout();
  };

  handleClose = () => {
    this.setState({ open: false });
  };
  render() {
    const { classes, wallet, loaded } = this.props;
    const { open } = this.state;

    const wrapper = classNames({});
    const managerClasses = classNames({
      [classes.managerClasses]: true
    });
    return (
      <div className={wrapper}>
        {loaded && (
          <Button
            color="transparent"
            aria-label="Home"
            justIcon
            to={{ pathname: "/dashboard/wallet" }}
            component={RouterLink}
            className={classes.button}
            muiClasses={{
              label: ""
            }}
          >
            <List className={classes.navBalance}>
              <ListItem>
                <ListItemText
                  classes={{
                    primary: classes.userWalletPrimary,
                    secondary: classes.userWalletSecondary
                  }}
                  primary="Your balance"
                  secondary={wallet.availableBalance + " FKC"}
                />
              </ListItem>
            </List>
          </Button>
        )}

        <Button
          color="transparent"
          aria-label="Home"
          justIcon
          to={{ pathname: "/dashboard" }}
          component={RouterLink}
          className={classes.button}
          muiClasses={{
            label: ""
          }}
        >
          <Dashboard className={classes.headerLinksSvg + " " + classes.links} />
          <Hidden mdUp implementation="css">
            <span className={classes.linkText}>{"Dashboard"}</span>
          </Hidden>
        </Button>

        <Button
          color="transparent"
          aria-label="Logout"
          justIcon
          onClick={this.handleLogoutClick}
          className={classes.buttonLink}
          muiClasses={{
            label: ""
          }}
        >
          <ExitToApp className={classes.headerLinksSvg + " " + classes.links} />
          <Hidden mdUp implementation="css">
            <span className={classes.linkText}>{"Logout"}</span>
          </Hidden>
        </Button>
      </div>
    );
  }
}

NavigationLinks.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps(store, props) {
  return {
    loaded: store.wallet.loaded,
    wallet: store.wallet.wallet
  };
}

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout())
});

export default withRouter(
  withStyles(navigationLinksStyles)(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(NavigationLinks)
  )
);
