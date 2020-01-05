import {
  defaultFont,
  primaryBoxShadow,
  infoBoxShadow,
  successBoxShadow,
  warningBoxShadow,
  dangerBoxShadow,
  roseBoxShadow
} from 'styles/app.jss';

const globalNotificationStyles = {
  root: {
    ...defaultFont,
    flexWrap: 'unset',
    position: 'relative',
    padding: '10px 15px',
    lineHeight: '20px',
    marginBottom: '20px',
    width: '100%',
    fontSize: '14px',
    backgroundColor: 'white',
    color: '#555555',
    borderRadius: '3px',
    boxShadow:
      '0 12px 20px -10px rgba(255, 255, 255, 0.28), 0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(255, 255, 255, 0.2)'
  },
  top20: {
    top: '20px',
    width: '80%'
  },
  top40: {
    top: '40px'
  },
  info: {
    backgroundColor: '#00d3ee',
    color: '#ffffff',
    ...infoBoxShadow
  },
  success: {
    backgroundColor: '#5cb860',
    color: '#ffffff',
    ...successBoxShadow
  },
  warning: {
    backgroundColor: '#ffa21a',
    color: '#ffffff',
    ...warningBoxShadow
  },
  danger: {
    backgroundColor: '#f55a4e',
    color: '#ffffff',
    ...dangerBoxShadow
  },
  primary: {
    backgroundColor: '#af2cc5',
    color: '#ffffff',
    ...primaryBoxShadow
  },
  rose: {
    backgroundColor: '#eb3573',
    color: '#ffffff',
    ...roseBoxShadow
  },
  message: {
    padding: '0',
    display: 'block',
    width: '100%',
    textAlign: 'center',
    maxWidth: '100%'
  },
  close: {
    width: '11px',
    height: '11px'
  }
};

export default globalNotificationStyles;
