const homeStyles = {
  getAccessBtn: {
    marginTop: 32,
    color: '#9a56fa',
    border: 'none',
    backgroundColor: '#fff',
    '&:hover': {
      backgroundColor: '#aa3afa',
      color: '#fff'
    },
    '&:active': {
      backgroundColor: '#aa3afa',
      color: '#fff'
    },
    '&:focus': {
      color: '#9a56fa',
      backgroundColor: '#fff'
    }
  },
  pageBg: {
    width: '100%'
  },
  imgFluid: {
    width: '100%',
    position: 'relative',
    zIndex: 2,
    maxWidth: '100%',
    height: 'auto'
  },
  headerPromo: {
    textAlign: 'center',
    paddingLeft: '1rem',
    paddingRight: '1rem',
    margin: '0',
    paddingBottom: '5rem',
    paddingTop: '5rem'
  },
  lead: {
    marginTop: '1rem !important',
    maxWidth: 550,
    marginLeft: 'auto !important',
    marginRight: 'auto !important',
    fontSize: '1.125rem'
  },
  container: {
    zIndex: 4,
    width: '100%'
  },
  promo: {
    fontWeight: 100
  }
};

export default homeStyles;
