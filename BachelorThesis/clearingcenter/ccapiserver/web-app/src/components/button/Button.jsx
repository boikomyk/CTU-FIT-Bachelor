import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import ButtonMUI from "@material-ui/core/Button";

import buttonStyles from "styles/components/button/Button.jss";
import { withRouter } from "react-router-dom";

class Button extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      classes,
      color,
      round,
      children,
      fullWidth,
      disabled,
      simple,
      staticContext,
      size,
      block,
      link,
      justIcon,
      className,
      margin,
      muiClasses,
      ...rest
    } = this.props;
    const btnClasses = classNames({
      [classes.button]: true,
      [classes[size]]: size,
      [classes[color]]: color,
      [classes.round]: round,
      [classes.margin]: margin,
      [classes.fullWidth]: fullWidth,
      [classes.disabled]: disabled,
      [classes.simple]: simple,
      [classes.block]: block,
      [classes.link]: link,
      [classes.justIcon]: justIcon,
      [className]: className
    });

    return (
      <ButtonMUI {...rest} classes={muiClasses} className={btnClasses}>
        {children}
      </ButtonMUI>
    );
  }
}

Button.propTypes = {
  classes: PropTypes.object.isRequired,
  color: PropTypes.oneOf([
    "primary",
    "info",
    "success",
    "warning",
    "danger",
    "rose",
    "white",
    "twitter",
    "facebook",
    "google",
    "linkedin",
    "pinterest",
    "youtube",
    "tumblr",
    "github",
    "behance",
    "dribbble",
    "reddit",
    "transparent"
  ]),
  size: PropTypes.oneOf(["sm", "xs", "lg"]),
  simple: PropTypes.bool,
  round: PropTypes.bool,
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  block: PropTypes.bool,
  link: PropTypes.bool,
  justIcon: PropTypes.bool,
  className: PropTypes.string,
  margin: PropTypes.bool,
  muiClasses: PropTypes.object
};

export default withRouter(withStyles(buttonStyles)(Button));
