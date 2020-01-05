import { successColor, tooltip, dangerColor, cardTitle } from 'styles/app.jss';

import { hoverStyles } from 'styles/components/card/Card.jss';

const walletStyles = {
  ...hoverStyles,
  tooltip,
  dangerCellColor: {
    color: dangerColor
  },
  successCellColor: {
    color: successColor
  },
  cardTitle: {
    ...cardTitle,
    marginTop: '0px',
    marginBottom: '3px'
  },
  cardIconTitle: {
    ...cardTitle,
    marginTop: '15px',
    marginBottom: '0px'
  },
  cardProductTitle: {
    ...cardTitle,
    marginTop: '0px',
    marginBottom: '3px',
    textAlign: 'center'
  },
  cardCategory: {
    color: '#999999',
    fontSize: '14px',
    paddingTop: '10px',
    marginBottom: '0',
    marginTop: '0',
    margin: '0'
  },
  cardProductDesciprion: {
    textAlign: 'center',
    color: '#999999'
  },
  transactionsTable: {
    marginTop: 32,
    marginBottom: 32
  },
  dashboardCard: {
    height: '100%'
  },
  dashboardBody: {
    padding: '0px !important'
  },
  stats: {
    color: '#999999',
    fontSize: '12px',
    lineHeight: '22px',
    display: 'inline-flex',
    '& svg': {
      position: 'relative',
      top: '4px',
      width: '16px',
      height: '16px',
      marginRight: '3px'
    },
    '& .fab,& .fas,& .far,& .fal,& .material-icons': {
      position: 'relative',
      top: '4px',
      fontSize: '16px',
      marginRight: '3px'
    }
  },
  productStats: {
    paddingTop: '7px',
    paddingBottom: '7px',
    margin: '0'
  },
  successText: {
    color: successColor
  },
  dangerText: {
    color: dangerColor
  },
  upArrowCardCategory: {
    width: 14,
    height: 14
  },
  underChartIcons: {
    width: '17px',
    height: '17px'
  },
  price: {
    color: 'inherit',
    '& h4': {
      marginBottom: '0px',
      marginTop: '0px'
    }
  }
};

export default walletStyles;
