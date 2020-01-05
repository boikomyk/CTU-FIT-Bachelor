import React from "react";

import withStyles from "@material-ui/core/styles/withStyles";

import alertStyles from "styles/components/alert/Alert.jss";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import SweetAlert from "react-bootstrap-sweetalert";
import { removeAlert } from "actions/alert/Alert";

class Alert extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showSuccessAlert: false,
      message: "",
      title: "",
      color: "success",
      onConfirm: () => {}
    };
  }
  showDangerAlert() {
    const { removeAlert } = this.props;
    removeAlert();
    this.setState({ showSuccessAlert: true });
  }
  showSuccessAlert() {
    const { removeAlert } = this.props;
    removeAlert();
    this.setState({ showSuccessAlert: true });
  }

  componentDidMount() {}

  render() {
    const { alert } = this.props;
    if (alert.show === true) {
      this.setState({ message: alert.message });
      this.setState({ color: alert.color });
      this.setState({ title: alert.title });
      this.setState({ onConfirm: alert.onConfirm });
      if (alert.color === "success") {
        this.showSuccessAlert();
      }
      if (alert.color === "danger") {
        this.showDangerAlert();
      }
    }

    return (
      <div>
        {this.state.showSuccessAlert && (
          <SweetAlert
            danger
            style={{ display: "block", color: "#000" }}
            title={this.state.title}
            onConfirm={() => {
              const { removeAlert } = this.props;
              this.setState({ showSuccessAlert: false });
              removeAlert();
            }}
            confirmBtnCssClass={
              this.props.classes.button + " " + this.props.classes.success
            }
          >
            {this.state.message}
          </SweetAlert>
        )}
        {this.state.showSuccessAlert && (
          <SweetAlert
            success
            style={{ display: "block", color: "#000" }}
            title={this.state.title}
            onConfirm={() => {
              const { removeAlert } = this.props;
              this.setState({ showSuccessAlert: false });
              removeAlert();
              this.state.onConfirm();
            }}
            confirmBtnCssClass={
              this.props.classes.button + " " + this.props.classes.success
            }
          >
            {this.state.message}
          </SweetAlert>
        )}
      </div>
    );
  }
}
function mapStateToProps(store, props) {
  return {
    alert: store.alert
  };
}

const mapDispatchToProps = dispatch => ({
  removeAlert: () => dispatch(removeAlert())
});

export default withRouter(
  withStyles(alertStyles)(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(Alert)
  )
);
