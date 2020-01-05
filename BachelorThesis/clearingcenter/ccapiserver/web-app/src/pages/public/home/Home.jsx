import React from "react";
import { Link as RouterLink, withRouter } from "react-router-dom";
import withStyles from "@material-ui/core/styles/withStyles";

import homeStyles from "styles/pages/public/home/Home.jss";
import background from "shared/public/background.svg";
import Button from "components/button/Button";
import Trend from "react-trend";

class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <div className={classes.promo}>
          <div className={classes.headerPromo + " homeHeader"}>
            <h1>Welcome to the clearing center.</h1>
            <p className={classes.lead}>
              From day trader to data scientist lets you create, test and
              monetize any kind of trading algorithm. Access trusted strategies
              with no technical knowledge, or provide algorithms for other
              users.
            </p>
            <Button
              color="transparent"
              to={{ pathname: "/register" }}
              component={RouterLink}
              className={classes.getAccessBtn}
            >
              Get access for free
            </Button>
          </div>
          <div className={classes.pageBg + " homePageBg"}>
            <img src={background} className={classes.imgFluid} alt={""} />
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(withStyles(homeStyles)(Home));
