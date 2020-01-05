import { container, cardTitle, grayColor } from 'styles/app.jss';

const loginStyles = {
  eye: {
    cursor: 'pointer',
    color: grayColor
  },
  container: {
    ...container,
    position: 'relative',
    zIndex: '3',
    paddingBottom: '120px'
  },
  cardIconTitle: {
    ...cardTitle,

    marginTop: '15px',
    marginBottom: '0px',
    '& small': {
      fontSize: '80%',
      fontWeight: '400'
    }
  },
  cardSignup: {
    borderRadius: '6px',
    boxShadow:
      '0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)',
    marginBottom: '100px',
    padding: '40px 0px',
    marginTop: '15vh'
  },
  center: {
    textAlign: 'center'
  },
  right: {
    textAlign: 'right'
  },
  left: {
    textAlign: 'left'
  },
  form: {
    padding: '0 20px',
    position: 'relative'
  },
  socialTitle: {
    fontSize: '18px'
  },
  inputAdornment: {
    marginRight: '18px',
    position: 'relative'
  },
  inputAdornmentIcon: {
    color: '#555'
  },
  customFormControlClasses: {
    margin: '0 12px'
  },
  checkboxLabelControl: {
    margin: '0'
  },
  checkboxLabel: {
    marginLeft: '6px',
    color: 'rgba(0, 0, 0, 0.26)'
  }
};

export default loginStyles;
