import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

import withStyles from "@material-ui/core/styles/withStyles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Hidden from "@material-ui/core/Hidden";
import Menu from "@material-ui/icons/Menu";

import Button from "components/button/Button.jsx";
import NavigationLinks from "components/dashboard/navigation/NavigationLinks";
import navigationStyles from "styles/components/dashboard/navigation/Navigation.jss";

function Navigation({ ...props }) {
  function makeBrand() {
     
    let name;
    props.routes.map((prop, key) => {
      if (prop.path === props.location.pathname) {
        name = prop.name;
      }
    });
    if (name) {
      return name;
    } else {
      return "Clearing Center";
    }
  }
  const { classes, color } = props;
  const appBarClasses = cx({
    [" " + classes[color]]: color
  });

  return (
    <AppBar className={classes.appBar + appBarClasses}>
      <Toolbar className={classes.container}>
        <Hidden smDown implementation="css" />
        <div className={classes.flex}>
          <Button className={classes.title} color="transparent">
            {makeBrand()}
          </Button>
        </div>
        <Hidden smDown implementation="css">
          <NavigationLinks />
        </Hidden>
        <Hidden mdUp implementation="css">
          <Button
            className={classes.appResponsive}
            color="transparent"
            justIcon
            aria-label="open drawer"
            onClick={props.handleDrawerToggle}
          >
            <Menu />
          </Button>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
}

Navigation.propTypes = {
  classes: PropTypes.object.isRequired,
  color: PropTypes.oneOf(["primary", "info", "success", "warning", "danger"])
};

export default withStyles(navigationStyles)(Navigation);
