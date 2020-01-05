import {
  blackColor,
  cardTitle,
  dangerColor,
  grayColorLight,
  infoColorDark,
  successColor,
  whiteColor
} from 'styles/app.jss';

const userStrategyStyles = {
  chipIndicator: {
    margin: '0 8px 8px 8px ',
    color: blackColor,
    borderColor: infoColorDark + '!important',
    '&:hover,&:focus': {
      backgroundColor: infoColorDark + '!important',
      color: whiteColor
    }
  },
  root: {},
  formControl: {
    minWidth: 120,
    maxWidth: 300
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  chip: {},
  noLabel: {},
  dangerCellColor: {
    color: dangerColor
  },
  selectHelper: {
    color: grayColorLight
  },
  successCellColor: {
    color: successColor
  },
  selectInput: {
    display: 'flex !important'
  },
  selectMenu: {
    color: grayColorLight,
    weight: 300
  },
  cardTitle,
  cardIconTitle: {
    ...cardTitle,

    marginTop: '15px',
    marginBottom: '0px',
    '& small': {
      fontSize: '80%',
      fontWeight: '400'
    }
  },
  cardCategory: {
    marginTop: '10px',
    color: '#999999 !important',
    textAlign: 'center'
  },
  description: {
    color: '#999999'
  },
  updateProfileButton: {
    float: 'right'
  }
};
export default userStrategyStyles;
