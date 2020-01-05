import React from "react";
import { withRouter } from "react-router-dom";

import publicStyles from "styles/pages/public/Public.jss";
import withStyles from "@material-ui/core/styles/withStyles";
import Navigation from "components/public/navigation/Navigation";
import Footer from "components/public/footer/Footer";

class Public extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    document.title = this.props.title;
    document.body.style.overflow = "unset";
  }
  render() {
    const { classes, ...rest } = this.props;
    const PageComponent = this.props.component;
    return (
      <div>
        <Navigation {...rest} />
        <div className={classes.wrapper + " pageWrapper"} ref="wrapper">
          <div className={classes.fullPage}>
            <PageComponent />
            <Footer white />
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(withStyles(publicStyles)(Public));
