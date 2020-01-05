import React, { Component } from "react";
import { Link as RouterLink, withRouter } from "react-router-dom";

import { connect } from "react-redux";
import { removeNotification } from "actions/notification/Notification";
import cx from "classnames";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import Close from "@material-ui/icons/Close";
import notificationStyles from "styles/components/notification/Notification.jss";
import withStyles from "@material-ui/core/styles/withStyles";

class Notifications extends Component {
  constructor(props) {
    super(props);
  }

  handleExited = () => {
    const { removeNotification } = this.props;
    removeNotification();
  };

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    const { removeNotification } = this.props;
    removeNotification();
  };

  render() {
    const { classes, notification } = this.props;

    const messageClasses = cx({
      [classes.iconMessage]: notification.icon !== undefined
    });
    const action = [
      <IconButton
        className={classes.iconButton}
        key="close"
        aria-label="Close"
        color="inherit"
        onClick={this.handleClose}
      >
        <Close className={classes.close} />
      </IconButton>
    ];
    const iconClasses = cx({
      [classes.icon]: classes.icon,
      [classes.infoIcon]: notification.color === "info",
      [classes.successIcon]: notification.color === "success",
      [classes.warningIcon]: notification.color === "warning",
      [classes.dangerIcon]: notification.color === "danger",
      [classes.primaryIcon]: notification.color === "primary",
      [classes.roseIcon]: notification.color === "rose"
    });
    return (
      <Snackbar
        classes={{
          anchorOriginTopCenter: classes.top20,
          anchorOriginTopRight: classes.top40,
          anchorOriginTopLeft: classes.top40
        }}
        autoHideDuration={6000}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        open={notification.show}
        onClose={this.handleClose}
        onExited={this.handleExited}
        message={
          <div>
            {notification.icon === undefined ? null : (
                <notification.icon className={iconClasses}/>
            )}
            <span className={messageClasses}>{notification.onShow()}</span>
          </div>
        }
        action={action}
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
    notification: store.notification.notification
  };
}

const mapDispatchToProps = dispatch => ({
  removeNotification: () => dispatch(removeNotification())
});

export default withRouter(
  withStyles(notificationStyles)(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(Notifications)
  )
);
