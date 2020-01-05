import React from "react";

import { Link as RouterLink, withRouter } from "react-router-dom";
import classNames from "classnames";
import withStyles from "@material-ui/core/styles/withStyles";
import cx from "classnames";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Hidden from "@material-ui/core/Hidden";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Menu from "@material-ui/icons/Menu";

import navigationStyles from "styles/components/public/navigation/Navigation.jss";
import { NavigationLinks, PublicRoutes } from "routes/public/Public";
import logo from "shared/public/logo.png";
import Button from "components/button/Button";

class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }
  handleDrawerToggle = () => {
    this.setState({ open: !this.state.open });
  };

  componentDidUpdate(e) {
    if (e.history.location.pathname !== e.location.pathname) {
      this.setState({ open: false });
    }
  }

  render() {
    const { classes, color } = this.props;
    const appBarClasses = cx({
      [" " + classes[color]]: color
    });
    let list = link => {
      return (
        <List className={classes.list}>
          {link === classes.navLink &&
            NavigationLinks.map((prop, key) => {
              return (
                <ListItem key={key} className={classes.listItem}>
                  <Button
                    color="transparent"
                    round
                    to={{ pathname: prop.path }}
                    component={RouterLink}
                    className={
                      prop.path === "/register"
                        ? classNames(classes.navSignUpLink, link)
                        : link
                    }
                  >
                    {prop.name}
                  </Button>
                </ListItem>
              );
            })}

          {link === classes.sidebarLink &&
            PublicRoutes.map((prop, key) => {
              return (
                <ListItem key={key} className={classes.listItem}>
                  <Button
                    color="transparent"
                    to={{ pathname: prop.path }}
                    component={RouterLink}
                    className={classes.sidebarLink}
                  >
                    {prop.name}
                  </Button>
                </ListItem>
              );
            })}
        </List>
      );
    };
    return (
      <AppBar position="static" className={classes.appBar + appBarClasses}>
        <Toolbar className={classes.container}>
          <div className={classes.flex}>
            <Button
              to={{ pathname: "/" }}
              component={RouterLink}
              className={classes.title}
              color="transparent"
            >
              <img height={64} src={logo} alt={"Clearing Center"} />
            </Button>
          </div>

          <Hidden smDown>{list(classes.navLink)}</Hidden>
          <Hidden mdUp>
            <Button
              className={classes.sidebarButton}
              color="transparent"
              justIcon
              aria-label="open drawer"
              onClick={this.handleDrawerToggle}
            >
              <Menu />
            </Button>
          </Hidden>
          <Hidden mdUp>
            <Hidden mdUp>
              <Drawer
                variant="temporary"
                anchor={"right"}
                open={this.state.open}
                classes={{
                  paper: classes.drawerPaper
                }}
                onClose={this.handleDrawerToggle}
                ModalProps={{
                  keepMounted: true
                }}
              >
                {list(classes.sidebarLink)}
              </Drawer>
            </Hidden>
          </Hidden>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withRouter(withStyles(navigationStyles)(Navigation));
