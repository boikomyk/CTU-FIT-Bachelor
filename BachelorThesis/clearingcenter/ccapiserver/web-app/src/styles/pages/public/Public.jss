const publicStyles = theme => ({
  wrapper: {
    animationPlayState: 'running',
    height: 'auto',
    minHeight: '100vh',
    position: 'relative',
    top: '0'
  },
  fullPage: {
    padding: '195px 0 65px 0',
    position: 'relative',
    minHeight: '100vh',
    display: 'flex!important',
    margin: '0',
    border: '0',
    color: '#fff',
    alignItems: 'center',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    height: '100%',
    [theme.breakpoints.down('sm')]: {
      minHeight: 'fit-content!important'
    },
    '& footer': {
      position: 'absolute',
      bottom: '0',
      width: '100%',
      border: 'none !important'
    },

    '&:before': {},

    '&:before,&:after': {
      display: 'block',
      content: '""',
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: '0',
      left: '0',
      zIndex: '2'
    }
  }
});

export default publicStyles;
