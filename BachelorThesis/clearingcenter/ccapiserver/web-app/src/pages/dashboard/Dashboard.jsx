import React from "react";
import { withRouter } from "react-router-dom";
import cx from "classnames";
import { connect } from "react-redux";
import PerfectScrollbar from "perfect-scrollbar";

import {
  DashboardLinks,
  dashboardSidebarMainItems
} from "routes/dashboard/Dashboard";
import Sidebar from "components/dashboard/sidebar/Sidebar";
import logo from "shared/pages/dashboard/sidebar/logo_mini.png";
import withStyles from "@material-ui/core/styles/withStyles";
import dashboardStyles from "styles/pages/dashboard/Dashoboard.jss";
import { getProfile } from "actions/profile/Profile";
import Navigation from "components/dashboard/navigation/Navigation";

let scrollbar;

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      miniActive: true,
      mobileOpen: false
    };

    this.resizeFunction = this.resizeFunction.bind(this);
  }
  componentDidMount() {
    document.title = this.props.title;
    const { loadProfile, isProfileLoaded } = this.props;
    if (!isProfileLoaded) {
      loadProfile();
    }

    if (navigator.platform.indexOf("Win") > -1) {
      scrollbar = new PerfectScrollbar(this.refs.mainPanel, {
        suppressScrollX: true,
        suppressScrollY: false
      });
      document.body.style.overflow = "hidden";
    }
    window.addEventListener("resize", this.resizeFunction);
  }
  componentWillUnmount() {
    if (navigator.platform.indexOf("Win") > -1) {
      scrollbar.destroy();
    }
    window.removeEventListener("resize", this.resizeFunction);
  }
  componentDidUpdate(e) {
    if (e.history.location.pathname !== e.location.pathname) {
      this.refs.mainPanel.scrollTop = 0;
      if (this.state.mobileOpen) {
        this.setState({ miniActive: true });
        this.setState({ mobileOpen: false });
      }
    }
  }
  handleDrawerToggle = () => {
    this.setState({ miniActive: this.state.mobileOpen });
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };

  sidebarMinimize() {
    this.setState({ miniActive: !this.state.miniActive });
  }
  resizeFunction() {
    if (window.innerWidth >= 960) {
      this.setState({ mobileOpen: false });
    }
  }

  render() {
    const PageComponent = this.props.component;
    const { classes, ...rest } = this.props;
    const mainPanel =
      classes.mainPanel +
      " " +
      cx({
        [classes.mainPanelSidebarMini]: this.state.miniActive,
        [classes.mainPanelWithPerfectScrollbar]:
          navigator.platform.indexOf("Win") > -1
      });
    return (
      <div className={classes.wrapper + " dashboardWrapper"}>
        <Sidebar
          routes={dashboardSidebarMainItems}
          logoText={"Clearing Center"}
          logo={logo}
          handleDrawerToggle={this.handleDrawerToggle}
          open={this.state.mobileOpen}
          color="blue"
          pageColor={this.props.pageColor}
          bgColor="black"
          miniActive={this.state.miniActive}
          {...rest}
        />
        <div className={mainPanel} ref="mainPanel">
          <Navigation
            sidebarMinimize={this.sidebarMinimize.bind(this)}
            miniActive={this.state.miniActive}
            routes={DashboardLinks}
            handleDrawerToggle={this.handleDrawerToggle}
            {...rest}
          />
          <div className={classes.content}>
            <div className={classes.container}>
              <PageComponent {...rest} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
function mapStateToProps(store, props) {
  return {
    isProfileLoaded: store.profile.loaded,
    profile: store.profile.profile
  };
}

const mapDispatchToProps = dispatch => ({
  loadProfile: () => dispatch(getProfile())
});

export default withRouter(
  withStyles(dashboardStyles)(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(Dashboard)
  )
);
