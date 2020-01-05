import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from 'app/App';
import Store from 'store/Store';
import 'styles/scss/styles.scss';
import 'shared/favicon.ico';

ReactDOM.render(
  <Provider store={Store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
