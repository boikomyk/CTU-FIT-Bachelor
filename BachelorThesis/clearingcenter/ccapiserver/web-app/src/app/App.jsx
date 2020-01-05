import React from "react";
import { Router } from "react-router-dom";

import AppRouter from "routes/AppRouter";
import history from "helpers/history/History";
import Notifications from "components/notification/Notifications";
import Alert from "components/alert/Alert";
import GlobalNotification from "components/notification/GlobalNotification";

class App extends React.Component {
  constructor(props) {
    super(props);
    history.listen(() => {});
  }

  render() {
    return (
      <div className="App">
        <Router history={history}>
          <Notifications />
          <GlobalNotification />
          <Alert />
          <AppRouter {...this.props} />
        </Router>
      </div>
    );
  }
}

export default App;
