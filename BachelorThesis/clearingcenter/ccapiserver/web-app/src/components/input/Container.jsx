import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import withStyles from "@material-ui/core/styles/withStyles";

import containerStyles from "styles/components/input/Container.jss";

function Container({ ...props }) {
  const { classes, children, label, borderOutlineColor, labelColor } = props;

  const containerClasses = classNames({
    [classes[borderOutlineColor + "BorderOutline"]]: borderOutlineColor,
    [classes.containerOutline]: true
  });
  const labelClasses = classNames({
    [classes[labelColor + "Legend"]]: labelColor,
    [classes.legend]: true
  });

  return (
    <div className={classes.containerWrapper}>
      <fieldset className={containerClasses}>
        <legend className={labelClasses}>{label}</legend>
        <div className={classes.containerContent}>{children}</div>
      </fieldset>
    </div>
  );
}
Container.defaultProps = {
  borderOutlineColor: "transparent",
  label: "",
  labelColor: "gray"
};

Container.propTypes = {
  classes: PropTypes.object.isRequired,
  label: PropTypes.string,
  labelColor: PropTypes.oneOf([
    "warning",
    "primary",
    "danger",
    "success",
    "info",
    "rose",
    "gray"
  ]),
  borderOutlineColor: PropTypes.oneOf([
    "warning",
    "primary",
    "transparent",
    "danger",
    "success",
    "info",
    "rose",
    "gray"
  ])
};

export default withStyles(containerStyles)(Container);
