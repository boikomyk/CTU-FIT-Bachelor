import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import { connect } from "react-redux";
import cx from "classnames";
import Snackbar from "@material-ui/core/Snackbar";
import globalNotificationStyles from "styles/components/notification/GlobalNotification.jss";
import withStyles from "@material-ui/core/styles/withStyles";

class GlobalNotification extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes, notification } = this.props;

    return (
      <Snackbar
        classes={{
          anchorOriginTopCenter: classes.top20,
          anchorOriginTopRight: classes.top40,
          anchorOriginTopLeft: classes.top40
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
        open={notification.show}
        message={<div>{notification.onShow()}</div>}
        ContentProps={{
          classes: {
            root: classes.root + " " + classes[notification.color],
            message: classes.message
          }
        }}
      />
    );
  }
}

function mapStateToProps(store, props) {
  return {
    notification: store.notification.globalNotification
  };
}

export default withRouter(
  withStyles(globalNotificationStyles)(
    connect(mapStateToProps)(GlobalNotification)
  )
);
