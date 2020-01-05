import React from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import { withRouter } from "react-router-dom";
import PermIdentity from "@material-ui/icons/PermIdentity";
import { Card, CardBody, CardHeader, CardIcon } from "components/card/Card.jsx";
import Moment from "react-moment";

import { GridContainer, GridItem } from "components/grid/Grid.jsx";
import profileStyles from "styles/components/dashboard/profile/Profile.jss";
import PropTypes from "prop-types";
import Spinner from "components/spinner/Spinner";

class Profile extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { profile, classes, loaded } = this.props;

    return (
      <Card>
        <CardHeader color="rose" icon>
          <CardIcon color="primary">
            {loaded ? <PermIdentity /> : <Spinner color="white" />}
          </CardIcon>
          <h4 className={classes.cardIconTitle}>My Profile</h4>
        </CardHeader>
        <CardBody>
          {loaded ? (
            <GridContainer direction="column">
              <GridItem>
                <b>Username: </b>
                {profile.username}
              </GridItem>

              <GridItem>
                <b>Email: </b>
                {profile.email}
              </GridItem>
              <GridItem>
                <div>
                  <b>Last Login Activity: </b>{" "}
                  <Moment format="YYYY/MM/DD HH:mm">{profile.lastLogin}</Moment>
                </div>
              </GridItem>
            </GridContainer>
          ) : (
            Spinner.renderCardLoading()
          )}
        </CardBody>
      </Card>
    );
  }
}

Profile.propTypes = {
  profile: PropTypes.object,
  loaded: PropTypes.bool
};

export default withRouter(withStyles(profileStyles)(Profile));
