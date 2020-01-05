import {
  cardTitle,
  dangerColor,
  successColor,
  whiteColor,
  infoColorDark,
  blackColor
} from 'styles/app.jss';

const strategyStyles = {
  dangerCellColor: {
    color: dangerColor
  },
  successCellColor: {
    color: successColor
  },
  graphContainer: {
    minWidth: '1000px !important'
  },
  graph: {
    width: 1000,
    minWidth: 1000,
    margin: 'auto'
  },
  descriptionCard: {
    padding: '15px'
  },
  signalCard: {
    padding: '0px !important'
  },
  statisticsCard: {
    padding: '0px !important'
  },
  favorite: {
    width: '17px',
    height: '17px',
    color: dangerColor
  },
  favoriteBorder: {
    width: '17px',
    height: '17px'
  },
  buttonIcons: {},
  pageSubcategoriesTitle: {
    color: '#3C4858',
    textDecoration: 'none',
    textAlign: 'center'
  },
  buttonControls: {
    marginBottom: 32,
    color: '#fff'
  },
  chipIndicator: {
    margin: '0 8px 8px 8px ',
    color: blackColor,
    borderColor: infoColorDark + '!important',
    '&:hover,&:focus': {
      backgroundColor: infoColorDark + '!important',
      color: whiteColor
    }
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
  follow: {
    color: '#fff',
    '&$checked': {
      color: dangerColor
    }
  },
  followChecked: {
    color: '#fff'
  },
  whiteLabel: {
    color: '#fff'
  },
  subscribe: {
    color: '#fff'
  },
  description: {
    color: '#999999'
  },
  updateProfileButton: {
    float: 'right'
  }
};
export default strategyStyles;
