import React from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import ChartComponent from "models/Chart";
import chartStyles from "styles/components/dashboard/chart/Chart.jss";

class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentDidMount() {
    this.setState({ data: this.props.data });
  }

  render() {
    const { classes, width } = this.props;
    if (this.state == null) {
      return <div>Loading...</div>;
    }
    return <ChartComponent type="svg" width={width} data={this.state.data} />;
  }
}

Chart.defaultProps = {
  width: 1000
};

Chart.propTypes = {
  data: PropTypes.Array,
  width: PropTypes.number
};

export default withRouter(withStyles(chartStyles)(Chart));
