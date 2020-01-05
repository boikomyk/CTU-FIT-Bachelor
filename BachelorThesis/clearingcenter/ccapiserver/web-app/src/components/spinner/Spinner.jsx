import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import classNames from "classnames";
import spinnerStyles from "styles/components/spinner/Spinner.jss";
import { GridContainer, GridItem } from "components/grid/Grid";

class Spinner extends React.Component {
  constructor(props) {
    super(props);
  }
  static renderCardLoading() {
    return (
      <GridContainer
        container
        direction="column"
        justify="center"
        alignItems="center"
      >
        <GridItem>Loading...</GridItem>
      </GridContainer>
    );
  }

  render() {
    const { classes, color, size } = this.props;
    return (
      <div className={classes.progressBar}>
        <CircularProgress
          className={classNames({
            [classes[color + "Spinner"]]: true,
            [classes.spinner]: true
          })}
          variant="indeterminate"
          value={100}
          size={size}
          thickness={5}
        />
      </div>
    );
  }
}

Spinner.defaultProps = {
  color: "white",
  size: 32
};
Spinner.propTypes = {
  classes: PropTypes.object.isRequired,
  size: PropTypes.number,
  color: PropTypes.oneOf([
    "warning",
    "primary",
    "danger",
    "success",
    "info",
    "rose",
    "blue",
    "white",
    "gray"
  ])
};

export default withStyles(spinnerStyles)(Spinner);
