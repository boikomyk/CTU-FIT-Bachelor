import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";

import { gridStyles, gridItemStyles } from "styles/components/grid/Grid.jss";

function gridContainer({ ...props }) {
  const { classes, children, className, ...rest } = props;
  return (
    <Grid container {...rest} className={classes.grid + " " + className}>
      {children}
    </Grid>
  );
}

function gridItem({ ...props }) {
  const { classes, children, className, ...rest } = props;
  return (
    <Grid item {...rest} className={classes.grid + " " + className}>
      {children}
    </Grid>
  );
}

const GridContainer = withStyles(gridStyles)(gridContainer);
const GridItem = withStyles(gridItemStyles)(gridItem);

export { GridContainer, GridItem };
