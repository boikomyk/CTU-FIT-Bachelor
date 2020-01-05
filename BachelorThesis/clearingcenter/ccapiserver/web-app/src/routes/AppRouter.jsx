import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import { NotFoundPageRoute, PublicRoutes } from "routes/public/Public";
import {
  DashboardRoutes,
  NotFoundDashboardRoute
} from "routes/dashboard/Dashboard";
import Public from "pages/public/Public";
import Dashboard from "pages/dashboard/Dashboard";
import { connect } from "react-redux";
import { websocketConnect } from "actions/websocket/Websocket";

class AppRouter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      runWebsocket: true
    };
  }

  componentDidMount() {
     

    const { disconnected, login, connected, websocketConnect } = this.props;

    if (login.authenticated && !connected && !disconnected) {
      this.setState({
        runWebsocket: login.authenticated && !connected && !disconnected
      });
      setTimeout(
        function() {
          websocketConnect();
        }.bind(this),
        2000
      );
    }
  }

  componentDidUpdate(prevProps, prevState) {
     

    const { runWebsocket } = this.state;
  
    if (prevState.runWebsocket === runWebsocket) return;
    const { websocketConnect } = this.props;
    if (runWebsocket === true) {
      setTimeout(
        function() {
          websocketConnect();
        }.bind(this),
        2000
      );
    }
  }
  componentWillReceiveProps(nextProps, nextContext) {
     

    const { disconnected, login, connected } = nextProps;
     
    this.setState({
      runWebsocket: login.authenticated && !connected && !disconnected
    });
  }

  render() {
    const { login } = this.props;
    return (
      <Switch>
        {PublicRoutes.map((prop, key) => {
          return (
            <Route
              exact
              path={prop.path}
              key={key}
              render={() =>
                login.authenticated === false ? (
                  <Public component={prop.component} title={prop.title} />
                ) : (
                  <Redirect to="/dashboard" />
                )
              }
            />
          );
        })}
        {DashboardRoutes.map((prop, key) => {
          return (
            <Route
              exact
              path={prop.path}
              key={key}
              render={() =>
                login.authenticated === true ? (
                  <Dashboard
                    component={prop.component}
                    pageColor={prop.pageColor}
                    title={prop.title}
                  />
                ) : (
                  <Redirect to="/login" />
                )
              }
            />
          );
        })}
        <Route
          path="*"
          render={() =>
            login.authenticated === true ? (
              <Redirect to="/dashboard" />
            ) : (
              <Redirect to="/login" />
            )
          }
        />
      </Switch>
    );
  }
}

function mapStateToProps(store, props) {
  return {
    connected: store.websocket.connected,
    disconnected: store.websocket.disconnected,
    login: store.login
  };
}
const mapDispatchToProps = dispatch => ({
  websocketConnect: () => dispatch(websocketConnect())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppRouter);
