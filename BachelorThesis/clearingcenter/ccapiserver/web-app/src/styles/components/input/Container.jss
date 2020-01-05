import {
  primaryColorLight,
  warningColorLight,
  dangerColorLight,
  successColorLight,
  infoColorLight,
  roseColorLight,
  grayColorLight,
  primaryColor,
  warningColor,
  dangerColor,
  successColor,
  infoColor,
  roseColor,
  grayColor
} from 'styles/app.jss';

const containerStyles = () => ({
  containerWrapper: {
    margin: 0,
    boxSizing: 'border-box',
    padding: 0,
    width: '100%'
  },
  containerOutline: {
    borderStyle: 'solid',
    borderWidth: '1px',
    fontSize: '14px',
    borderRadius: '4px',
    padding: '0 14px 32px 14px',
    borderSizing: 'border-box',
    lineHeight: '1.1875em'
  },
  legend: {
    textAlign: 'left',
    paddingLeft: '3px',
    paddingRight: '3px',
    fontSize: '0.75rem',
    padding: 0,
    lineHeight: '11px',
    fontWeight: 400
  },
  containerContent: {
    marginBottom: '32px'
  },

  warningBorderOutline: {
    borderColor: warningColorLight
  },
  transparentBorderOutline: {
    border: 'none !important'
  },
  primaryBorderOutline: {
    borderColor: primaryColorLight
  },
  dangerBorderOutline: {
    borderColor: dangerColorLight
  },
  successBorderOutline: {
    borderColor: successColorLight
  },
  infoBorderOutline: {
    borderColor: infoColorLight
  },
  roseBorderOutline: {
    borderColor: roseColorLight
  },
  grayBorderOutline: {
    borderColor: grayColorLight
  },

  warningLegend: {
    color: warningColor
  },
  primaryLegend: {
    color: primaryColor
  },
  dangerLegend: {
    color: dangerColor
  },
  successLegend: {
    color: successColor
  },
  infoLegend: {
    color: infoColor
  },
  roseLegend: {
    color: roseColor
  },
  grayLegend: {
    color: grayColor
  }
});

export default containerStyles;
