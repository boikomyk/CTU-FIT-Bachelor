import React from "react";
import PropTypes from "prop-types";
import PerfectScrollbar from "perfect-scrollbar";
import { NavLink } from "react-router-dom";
import cx from "classnames";
import withStyles from "@material-ui/core/styles/withStyles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Hidden from "@material-ui/core/Hidden";
import Collapse from "@material-ui/core/Collapse";
import Icon from "@material-ui/core/Icon";
import Notes from "@material-ui/icons/Notes";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import Pulse from "mdi-material-ui/Pulse";
import Avatar from "react-avatar";
import sidebarStyles from "styles/components/dashboard/sidebar/Sidebar.jss";

import ExitToApp from "@material-ui/icons/ExitToApp";
import AccountBalanceWallet from "@material-ui/icons/AccountBalanceWallet";
import { logout } from "actions/login/Login";
import { connect } from "react-redux";
import history from "helpers/history/History";

let ps;

class SidebarWrapper extends React.Component {
  componentDidMount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(this.refs.sidebarWrapper, {
        suppressScrollX: true,
        suppressScrollY: false
      });
    }
  }
  componentWillUnmount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps.destroy();
    }
  }
  render() {
    const { className, user, headerLinks, links } = this.props;
    return (
      <div className={className} ref="sidebarWrapper">
        {user}
        {headerLinks}
        {links}
      </div>
    );
  }
}

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openAvatar: false,
      miniActive: true
    };
    this.activeRoute.bind(this);
  }

  handleLogoutClick = () => {
    const { logout } = this.props;
    logout();
  };

  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1;
  }
  openCollapse(collapse) {
    const st = {};
    st[collapse] = !this.state[collapse];
    this.setState(st);
  }
  render() {
    const {
      classes,
      color,
      logo,
      image,
      logoText,
      routes,
      bgColor,
      profile
    } = this.props;
    const itemText =
      classes.itemText +
      " " +
      cx({
        [classes.itemTextMini]: this.props.miniActive && this.state.miniActive
      });
    const collapseItemText =
      classes.collapseItemText +
      " " +
      cx({
        [classes.collapseItemTextMini]:
          this.props.miniActive && this.state.miniActive
      });
    const userWrapperClass =
      classes.user +
      " " +
      cx({
        [classes.whiteAfter]: bgColor === "white"
      });
    const caret = classes.caret + " " + cx({});
    const collapseItemMini = classes.collapseItemMini + " " + cx({});
    const photo = classes.photo + " " + cx({});
    const user = (
      <div className={userWrapperClass}>
        <div className={photo}>
          <Avatar
            round
            size={"34px"}
            className={classes.avatarImg}
            color={this.props.pageColor}
            name={profile.username}
          />
        </div>
        <List className={classes.list}>
          <ListItem className={classes.item + " " + classes.userItem}>
            <NavLink
              to={"#"}
              className={classes.itemLink + " " + classes.userCollapseButton}
              onClick={() => this.openCollapse("openAvatar")}
            >
              <ListItemText
                primary={<b>{profile.username}</b>}
                secondary={
                  <b
                    className={
                      caret +
                      " " +
                      classes.userCaret +
                      " " +
                      (this.state.openAvatar ? classes.caretActive : "")
                    }
                  />
                }
                disableTypography={true}
                className={itemText + " " + classes.userItemText}
              />
            </NavLink>
            <Collapse in={this.state.openAvatar} unmountOnExit>
              <List className={classes.list + " " + classes.collapseList}>
                <ListItem className={classes.collapseItem}>
                  <NavLink
                    to={{ pathname: "/dashboard/wallet" }}
                    className={
                      classes.itemLink + " " + classes.userCollapseLinks
                    }
                  >
                    <span className={collapseItemMini}>
                      <AccountBalanceWallet
                        className={classes.headerLinksSvg + " " + classes.links}
                      />
                    </span>
                    <ListItemText
                      primary={"My Wallet"}
                      disableTypography={true}
                      className={collapseItemText}
                    />
                  </NavLink>
                </ListItem>
                <ListItem className={classes.collapseItem}>
                  <NavLink
                    to={{ pathname: "/dashboard/signals" }}
                    className={
                      classes.itemLink + " " + classes.userCollapseLinks
                    }
                  >
                    <span className={collapseItemMini}>
                      <Pulse
                        className={classes.headerLinksSvg + " " + classes.links}
                      />
                    </span>
                    <ListItemText
                      primary={"My Signals"}
                      disableTypography={true}
                      className={collapseItemText}
                    />
                  </NavLink>
                </ListItem>
                <ListItem className={classes.collapseItem}>
                  <NavLink
                    to={{ pathname: "/dashboard/mystrategies" }}
                    className={
                      classes.itemLink + " " + classes.userCollapseLinks
                    }
                  >
                    <span className={collapseItemMini}>
                      <Notes
                        className={classes.headerLinksSvg + " " + classes.links}
                      />
                    </span>
                    <ListItemText
                      primary={"My Strategies"}
                      disableTypography={true}
                      className={collapseItemText}
                    />
                  </NavLink>
                </ListItem>
                <ListItem className={classes.collapseItem}>
                  <NavLink
                    to={{ pathname: "/dashboard/following" }}
                    className={
                      classes.itemLink + " " + classes.userCollapseLinks
                    }
                  >
                    <span className={collapseItemMini}>
                      <FavoriteBorder
                        className={classes.headerLinksSvg + " " + classes.links}
                      />
                    </span>
                    <ListItemText
                      primary={"My Following Strategies"}
                      disableTypography={true}
                      className={collapseItemText}
                    />
                  </NavLink>
                </ListItem>
                <ListItem className={classes.collapseItem}>
                  <NavLink
                    to={{ pathname: "/login" }}
                    className={
                      classes.itemLink + " " + classes.userCollapseLinks
                    }
                    onClick={this.handleLogoutClick}
                  >
                    <span className={collapseItemMini}>
                      <ExitToApp
                        className={classes.headerLinksSvg + " " + classes.links}
                      />
                    </span>
                    <ListItemText
                      primary={"Logout"}
                      disableTypography={true}
                      className={collapseItemText}
                    />
                  </NavLink>
                </ListItem>
              </List>
            </Collapse>
          </ListItem>
        </List>
      </div>
    );
    const links = (
      <List className={classes.list}>
        {routes.map((prop, key) => {
          if (prop.redirect) {
            return null;
          }
          if (prop.collapse) {
            const navLinkClasses =
              classes.itemLink +
              " " +
              cx({
                [" " + classes.collapseActive]: this.activeRoute(prop.path)
              });
            const itemText =
              classes.itemText +
              " " +
              cx({
                [classes.itemTextMini]:
                  this.props.miniActive && this.state.miniActive
              });
            const collapseItemText =
              classes.collapseItemText +
              " " +
              cx({
                [classes.collapseItemTextMini]:
                  this.props.miniActive && this.state.miniActive
              });
            const itemIcon = classes.itemIcon + " " + cx({});
            const caret = classes.caret + " " + cx({});
            return (
              <ListItem key={key} className={classes.item}>
                <NavLink
                  to={"#"}
                  className={navLinkClasses}
                  onClick={() => this.openCollapse(prop.state)}
                >
                  <ListItemIcon className={itemIcon}>
                    {typeof prop.icon === "string" ? (
                      <Icon>{prop.icon}</Icon>
                    ) : (
                      <prop.icon />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={prop.name}
                    secondary={
                      <b
                        className={
                          caret +
                          " " +
                          (this.state[prop.state] ? classes.caretActive : "")
                        }
                      />
                    }
                    disableTypography={true}
                    className={itemText}
                  />
                </NavLink>
                <Collapse in={this.state[prop.state]} unmountOnExit>
                  <List className={classes.list + " " + classes.collapseList}>
                    {prop.views.map((prop, key) => {
                      if (prop.redirect) {
                        return null;
                      }
                      const navLinkClasses =
                        classes.collapseItemLink +
                        " " +
                        cx({
                          [" " + classes[color]]: this.activeRoute(prop.path)
                        });
                      const collapseItemMini =
                        classes.collapseItemMini + " " + cx({});
                      return (
                        <ListItem key={key} className={classes.collapseItem}>
                          <NavLink to={prop.path} className={navLinkClasses}>
                            <span className={collapseItemMini}>
                              {prop.mini}
                            </span>
                            <ListItemText
                              primary={prop.name}
                              disableTypography={true}
                              className={collapseItemText}
                            />
                          </NavLink>
                        </ListItem>
                      );
                    })}
                  </List>
                </Collapse>
              </ListItem>
            );
          }
          const navLinkClasses =
            classes.itemLink +
            " " +
            cx({
              [" " + classes[color]]: this.activeRoute(prop.path)
            });
          const itemText =
            classes.itemText +
            " " +
            cx({
              [classes.itemTextMini]:
                this.props.miniActive && this.state.miniActive
            });
          const itemIcon = classes.itemIcon + " " + cx({});
          return (
            <ListItem key={key} className={classes.item}>
              <NavLink to={prop.path} className={navLinkClasses}>
                <ListItemIcon className={itemIcon}>
                  {typeof prop.icon === "string" ? (
                    <Icon>{prop.icon}</Icon>
                  ) : (
                    <prop.icon />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={prop.name}
                  disableTypography={true}
                  className={itemText}
                />
              </NavLink>
            </ListItem>
          );
        })}
      </List>
    );

    const logoNormal =
      classes.logoNormal +
      " " +
      cx({
        [classes.logoNormalSidebarMini]:
          this.props.miniActive && this.state.miniActive
      });
    const logoMini = classes.logoMini + " " + cx({});
    const logoClasses =
      classes.logo +
      " " +
      cx({
        [classes.whiteAfter]: bgColor === "white"
      });
    const brand = (
      <div className={logoClasses}>
        <a href="/dashboard" className={logoMini}>
          <img src={logo} alt="logo" className={classes.img} />
        </a>
        <a href="/dashboard" className={logoNormal}>
          {logoText}
        </a>
      </div>
    );
    const drawerPaper =
      classes.drawerPaper +
      " " +
      cx({
        [classes.drawerPaperMini]:
          this.props.miniActive && this.state.miniActive
      });
    const sidebarWrapper =
      classes.sidebarWrapper +
      " " +
      cx({
        [classes.drawerPaperMini]:
          this.props.miniActive && this.state.miniActive,
        [classes.sidebarWrapperWithPerfectScrollbar]:
          navigator.platform.indexOf("Win") > -1
      });
    return (
      <div ref="mainPanel">
        <Hidden mdUp implementation="css">
          <Drawer
            variant="temporary"
            anchor={"right"}
            open={this.props.open}
            classes={{
              paper: drawerPaper + " " + classes[bgColor + "Background"]
            }}
            onClose={this.props.handleDrawerToggle}
            ModalProps={{
              keepMounted: true
            }}
          >
            {brand}
            <SidebarWrapper
              className={sidebarWrapper}
              user={user}
              links={links}
            />
            {image === undefined ? null : (
                <div
                    className={classes.background}
                    style={{backgroundImage: "url(" + image + ")"}}
                />
            )}
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            onMouseOver={() => this.setState({ miniActive: false })}
            onMouseOut={() => this.setState({ miniActive: true })}
            anchor={"left"}
            variant="permanent"
            open
            classes={{
              paper: drawerPaper + " " + classes[bgColor + "Background"]
            }}
          >
            {brand}
            <SidebarWrapper
              className={sidebarWrapper}
              user={user}
              links={links}
            />
            {image === undefined ? null : (
                <div
                    className={classes.background}
                    style={{backgroundImage: "url(" + image + ")"}}
                />
            )}
          </Drawer>
        </Hidden>
      </div>
    );
  }
}

Sidebar.defaultProps = {
  bgColor: "blue",
  pageColor: "blue"
};

Sidebar.propTypes = {
  classes: PropTypes.object.isRequired,
  bgColor: PropTypes.oneOf(["white", "black", "blue"]),
  pageColor: PropTypes.string,
  color: PropTypes.oneOf([
    "white",
    "red",
    "orange",
    "green",
    "blue",
    "purple",
    "rose"
  ]),
  logo: PropTypes.string,
  logoText: PropTypes.string,
  image: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object)
};

function mapStateToProps(store, props) {
  return {};
}

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout())
});

export default withStyles(sidebarStyles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Sidebar)
);
