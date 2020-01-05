import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

import {
  cardStyles,
  cardBodyStyles,
  cardHeaderStyles,
  cardIconStyles
} from "styles/components/card/Card.jss";

class _Card extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      classes,
      className,
      children,
      plain,
      profile,
      blog,
      raised,
      background,
      pricing,
      color,
      product,
      testimonial,
      chart,
      login,
      ...rest
    } = this.props;
    const cardClasses = classNames({
      [classes.card]: true,
      [classes.cardPlain]: plain,
      [classes.cardProfile]: profile || testimonial,
      [classes.cardBlog]: blog,
      [classes.cardRaised]: raised,
      [classes.cardBackground]: background,
      [classes.cardPricingColor]:
        (pricing && color !== undefined) ||
        (pricing && background !== undefined),
      [classes[color]]: color,
      [classes.cardPricing]: pricing,
      [classes.cardProduct]: product,
      [classes.cardChart]: chart,
      [classes.cardLogin]: login,
      [className]: className !== undefined
    });
    return (
      <div className={cardClasses} {...rest}>
        {children}
      </div>
    );
  }
}
_Card.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  plain: PropTypes.bool,
  profile: PropTypes.bool,
  blog: PropTypes.bool,
  raised: PropTypes.bool,
  background: PropTypes.bool,
  pricing: PropTypes.bool,
  testimonial: PropTypes.bool,
  color: PropTypes.oneOf([
    "primary",
    "info",
    "success",
    "warning",
    "blue",
    "danger",
    "rose"
  ]),
  product: PropTypes.bool,
  chart: PropTypes.bool,
  login: PropTypes.bool
};

class _CardBody extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes, className, children, padding, ...rest } = this.props;
    const cardBodyClasses = classNames({
      [classes.cardBody]: true,
      [classes.cardBodyPadding]: padding,
      [className]: className !== undefined
    });

    return (
      <div className={cardBodyClasses} {...rest}>
        {children}
      </div>
    );
  }
}
_CardBody.defaultProps = {
  padding: true
};

_CardBody.propTypes = {
  padding: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  background: PropTypes.bool,
  plain: PropTypes.bool,
  formHorizontal: PropTypes.bool,
  pricing: PropTypes.bool,
  signup: PropTypes.bool,
  color: PropTypes.bool,
  profile: PropTypes.bool,
  calendar: PropTypes.bool
};

class _CardHeader extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      classes,
      className,
      children,
      color,
      plain,
      image,
      contact,
      signup,
      stats,
      icon,
      text,
      ...rest
    } = this.props;
    const cardHeaderClasses = classNames({
      [classes.cardHeader]: true,
      [classes[color + "CardHeader"]]: color,
      [classes.cardHeaderPlain]: plain,
      [classes.cardHeaderImage]: image,
      [classes.cardHeaderContact]: contact,
      [classes.cardHeaderSignup]: signup,
      [classes.cardHeaderStats]: stats,
      [classes.cardHeaderIcon]: icon,
      [classes.cardHeaderText]: text,
      [className]: className !== undefined
    });

    return (
      <div className={cardHeaderClasses} {...rest}>
        {children}
      </div>
    );
  }
}

_CardHeader.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  color: PropTypes.oneOf([
    "warning",
    "success",
    "danger",
    "info",
    "blue",
    "primary",
    "rose"
  ]),
  plain: PropTypes.bool,
  image: PropTypes.bool,
  contact: PropTypes.bool,
  signup: PropTypes.bool,
  stats: PropTypes.bool,
  icon: PropTypes.bool,
  text: PropTypes.bool
};

class _CardIcon extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes, className, children, color, ...rest } = this.props;
    const cardIconClasses = classNames({
      [classes.cardIcon]: true,
      [classes[color + "CardHeader"]]: color,
      [className]: className !== undefined
    });

    return (
      <div className={cardIconClasses} {...rest}>
        {children}
      </div>
    );
  }
}

_CardIcon.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  color: PropTypes.oneOf([
    "warning",
    "success",
    "danger",
    "info",
    "blue",
    "primary",
    "rose"
  ])
};

const Card = withStyles(cardStyles)(_Card);
const CardBody = withStyles(cardBodyStyles)(_CardBody);
const CardHeader = withStyles(cardHeaderStyles)(_CardHeader);
const CardIcon = withStyles(cardIconStyles)(_CardIcon);

export { Card, CardBody, CardHeader, CardIcon };
