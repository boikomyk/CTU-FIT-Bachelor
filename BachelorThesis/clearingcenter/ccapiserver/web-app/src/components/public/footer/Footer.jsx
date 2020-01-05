import React from "react";
import cx from "classnames";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";

import { GridContainer, GridItem } from "components/grid/Grid.jsx";
import footerStyles from "styles/components/public/footer/Footer.jss";
import { withRouter } from "react-router-dom";

class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  render() {
    const { classes, fluid, white } = this.props;
    const container = cx({
      [classes.container]: !fluid,
      [classes.containerFluid]: fluid,
      [classes.whiteColor]: white
    });
    const anchor =
      classes.a +
      cx({
        [" " + classes.whiteColor]: white
      });
    const block = cx({
      [classes.block]: true,
      [classes.whiteColor]: white
    });
    return (
      <footer className={classes.footer}>
        <div className={container}>
          <GridContainer
            direction="column"
            alignItems="center"
            justify="center"
          >
            <GridItem>
              &copy;
              <a href="/" className={anchor}>
                {" Clearing Center "}
              </a>
              {1900 + new Date().getYear()}
            </GridItem>
            <GridItem>{" Your automated trading toolkit"}</GridItem>
          </GridContainer>
        </div>
      </footer>
    );
  }
}
Footer.propTypes = {
  classes: PropTypes.object.isRequired,
  fluid: PropTypes.bool,
  white: PropTypes.bool
};

export default withRouter(withStyles(footerStyles)(Footer));
