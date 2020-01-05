import { cardTitle, dangerColor, successColor } from 'styles/app.jss';

const userStrategiesStyles = {
  dangerCellColor: {
    color: dangerColor
  },
  successCellColor: {
    color: successColor
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
export default userStrategiesStyles;
