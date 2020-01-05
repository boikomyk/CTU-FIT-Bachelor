import {
  warningCardHeader,
  successCardHeader,
  dangerCardHeader,
  infoCardHeader,
  blueCardHeader,
  primaryCardHeader,
  roseCardHeader
} from 'styles/app.jss';

const hoverStyles = {
  cardHover: {
    '&:hover': {
      '& $cardHeaderHover': {
        transform: 'translate3d(0, -50px, 0)'
      }
    }
  },
  cardHeaderHover: {
    transition: 'all 300ms cubic-bezier(0.34, 1.61, 0.7, 1)'
  },
  cardHoverUnder: {
    position: 'absolute',
    zIndex: '1',
    top: '-50px',
    width: 'calc(100% - 30px)',
    left: '17px',
    right: '17px',
    textAlign: 'center'
  }
};
const cardStyles = {
  card: {
    border: '0',
    borderRadius: '6px',
    color: 'rgba(0, 0, 0, 0.87)',
    background: '#fff',
    width: '100%',
    boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.14)',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    minWidth: '0',
    wordWrap: 'break-word',
    fontSize: '.875rem'
  },
  cardPlain: {
    background: 'transparent',
    boxShadow: 'none'
  },
  cardProfile: {
    marginTop: '30px',
    textAlign: 'center'
  },
  cardBlog: {
    marginTop: '60px'
  },
  cardRaised: {
    boxShadow:
      '0 16px 38px -12px rgba(0, 0, 0, 0.56), 0 4px 25px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)'
  },
  cardBackground: {
    backgroundPosition: 'center center',
    backgroundSize: 'cover',
    textAlign: 'center',
    '&:after': {
      position: 'absolute',
      zIndex: '1',
      width: '100%',
      height: '100%',
      display: 'block',
      left: '0',
      top: '0',
      content: '""',
      backgroundColor: 'rgba(0, 0, 0, 0.56)',
      borderRadius: '6px'
    },
    '& small': {
      color: 'rgba(255, 255, 255, 0.7) !important'
    }
  },
  cardPricing: {
    textAlign: 'center',
    '&:after': {
      backgroundColor: 'rgba(0, 0, 0, 0.7) !important'
    },
    '& ul': {
      listStyle: 'none',
      padding: 0,
      maxWidth: '240px',
      margin: '10px auto'
    },
    '& ul li': {
      color: '#999999',
      textAlign: 'center',
      padding: '12px 0px',
      borderBottom: '1px solid rgba(153,153,153,0.3)'
    },
    '& ul li:last-child': {
      border: 0
    },
    '& ul li b': {
      color: '#3c4858'
    },
    '& h1': {
      marginTop: '30px'
    },
    '& h1 small': {
      display: 'inline-flex',
      height: 0,
      fontSize: '18px'
    },
    '& h1 small:first-child': {
      position: 'relative',
      top: '-17px',
      fontSize: '26px'
    },
    '& ul li svg, & ul li .fab,& ul li .fas,& ul li .far,& ul li .fal,& ul li .material-icons': {
      position: 'relative',
      top: '7px'
    }
  },
  cardPricingColor: {
    '& ul li': {
      color: '#fff',
      borderColor: 'rgba(255,255,255,0.3)',
      '& b, & svg,& .fab,& .fas,& .far,& .fal,& .material-icons': {
        color: '#fff',
        fontWeight: '700'
      }
    }
  },
  cardProduct: {
    marginTop: '30px'
  },
  primary: {
    background: 'linear-gradient(60deg,#ab47bc,#7b1fa2)',
    '& h1 small': {
      color: 'rgba(255, 255, 255, 0.8)'
    },
    color: '#FFFFFF'
  },
  blue: {
    background: 'linear-gradient(60deg,#5364b7,#5364b7)',
    '& h1 small': {
      color: 'rgba(255, 255, 255, 0.8)'
    },
    color: '#FFFFFF'
  },
  info: {
    background: 'linear-gradient(60deg,#26c6da,#0097a7)',
    '& h1 small': {
      color: 'rgba(255, 255, 255, 0.8)'
    },
    color: '#FFFFFF'
  },
  success: {
    background: 'linear-gradient(60deg,#009688,#009688)',
    '& h1 small': {
      color: 'rgba(255, 255, 255, 0.8)'
    },
    color: '#FFFFFF'
  },
  warning: {
    background: 'linear-gradient(60deg,#ffc107,#ffc107)',
    '& h1 small': {
      color: 'rgba(255, 255, 255, 0.8)'
    },
    color: '#FFFFFF'
  },
  danger: {
    background: 'linear-gradient(60deg,#ef5350,#d32f2f)',
    '& h1 small': {
      color: 'rgba(255, 255, 255, 0.8)'
    },
    color: '#FFFFFF'
  },
  rose: {
    background: 'linear-gradient(60deg,#ff5ccb,#ff4fc4)',
    '& h1 small': {
      color: 'rgba(255, 255, 255, 0.8)'
    },
    color: '#FFFFFF'
  },
  cardChart: {
    '& p': {
      marginTop: '0px',
      paddingTop: '0px'
    }
  },
  cardLogin: {
    transform: 'translate3d(0, 0, 0)',
    transition: 'all 300ms linear'
  }
};
const cardBodyStyles = {
  cardBodyPadding: {
    margin: '30px !important'
  },
  cardBody: {
    flex: '1 1 auto',
    WebkitBoxFlex: '1',
    margin: '0',
    position: 'relative'
  },
  cardBodyBackground: {
    position: 'relative',
    zIndex: '2',
    minHeight: '280px',
    paddingTop: '40px',
    paddingBottom: '40px',
    maxWidth: '440px',
    margin: '0 auto'
  },
  cardBodyPlain: {
    paddingLeft: '5px',
    paddingRight: '5px'
  },
  cardBodyFormHorizontal: {
    paddingLeft: '15px',
    paddingRight: '15px',
    '& form': {
      margin: '0'
    }
  },
  cardPricing: {
    padding: '15px!important',
    margin: '0px!important'
  },
  cardSignup: {
    padding: '0px 30px 0px 30px'
  },
  cardBodyColor: {
    borderRadius: '6px',
    '&': {
      'h1, h2, h3': {
        '& small': {
          color: 'rgba(255, 255, 255, 0.8)'
        }
      }
    }
  },
  cardBodyProfile: {
    marginTop: '15px'
  },
  cardBodyCalendar: {
    padding: '0px !important'
  }
};
const cardIconStyles = {
  cardIcon: {
    '&$warningCardHeader,&$successCardHeader,&$dangerCardHeader,&$infoCardHeader,&$blueCardHeader,&$primaryCardHeader,&$roseCardHeader': {
      borderRadius: '3px',
      backgroundColor: '#999',
      padding: '15px',
      marginTop: '-20px',
      marginRight: '15px',
      float: 'left'
    }
  },
  warningCardHeader,
  successCardHeader,
  dangerCardHeader,
  infoCardHeader,
  blueCardHeader,
  primaryCardHeader,
  roseCardHeader
};
const cardHeaderStyles = {
  cardHeader: {
    padding: '0.75rem 1.25rem',
    marginBottom: '0',
    borderBottom: 'none',
    background: 'transparent',
    zIndex: '3 !important',
    '&$cardHeaderPlain,&$cardHeaderImage,&$cardHeaderContact,&$cardHeaderSignup,&$cardHeaderIcon,&$cardHeaderStats,&$warningCardHeader,&$successCardHeader,&$dangerCardHeader,&$blueCardHeader,&$infoCardHeader,&$primaryCardHeader,&$roseCardHeader': {
      margin: '0 15px',
      padding: '0',
      position: 'relative',
      color: '#FFFFFF'
    },
    '&:first-child': {
      borderRadius: 'calc(.25rem - 1px) calc(.25rem - 1px) 0 0'
    },
    '&$warningCardHeader,&$successCardHeader,&$dangerCardHeader,&$infoCardHeader,&$infoCardHeader, &$primaryCardHeader,&$roseCardHeader': {
      '&:not($cardHeaderIcon):not($cardHeaderImage):not($cardHeaderText)': {
        borderRadius: '3px',
        marginTop: '-20px',
        padding: '15px'
      }
    },
    '&$cardHeaderStats svg': {
      fontSize: '36px',
      lineHeight: '56px',
      textAlign: 'center',
      width: '36px',
      height: '36px',
      margin: '10px 10px 4px'
    },
    '&$cardHeaderStats .fab,&$cardHeaderStats .fas,&$cardHeaderStats .far,&$cardHeaderStats .fal,&$cardHeaderStats .material-icons': {
      fontSize: '36px',
      lineHeight: '56px',
      width: '56px',
      height: '56px',
      textAlign: 'center',
      overflow: 'unset',
      marginBottom: '1px'
    },
    '&$cardHeaderStats$cardHeaderIcon': {
      textAlign: 'right'
    },
    '&$cardHeaderImage': {
      marginLeft: '15px',
      marginRight: '15px',
      marginTop: '-30px',
      borderRadius: '6px'
    },
    '&$cardHeaderText': {
      display: 'inline-block'
    }
  },
  cardHeaderPlain: {
    marginLeft: '0px',
    marginRight: '0px',
    '&$cardHeaderImage': {
      margin: '0 !important'
    }
  },
  cardHeaderImage: {
    position: 'relative',
    padding: '0',
    zIndex: '1',
    '& img': {
      width: '100%',
      borderRadius: '6px',
      pointerEvents: 'none',
      boxShadow:
        '0 5px 15px -8px rgba(0, 0, 0, 0.24), 0 8px 10px -5px rgba(0, 0, 0, 0.2)'
    },
    '& a': {
      display: 'block'
    }
  },
  cardHeaderContact: {
    margin: '0 15px',
    marginTop: '-20px'
  },
  cardHeaderSignup: {
    marginLeft: '20px',
    marginRight: '20px',
    marginTop: '-40px',
    padding: '20px 0',
    width: '100%',
    marginBottom: '15px'
  },
  cardHeaderStats: {
    '& $cardHeaderIcon': {
      textAlign: 'right'
    },
    '& h1,& h2,& h3,& h4,& h5,& h6': {
      margin: '0 !important'
    }
  },
  cardHeaderIcon: {
    '&$warningCardHeader,&$successCardHeader,&$dangerCardHeader,&$infoCardHeader,&$infoCardHeader,&$primaryCardHeader,&$roseCardHeader': {
      background: 'transparent',
      boxShadow: 'none'
    },
    '& .fab,& .fas,& .far,& .fal,& .material-icons': {
      width: '33px',
      height: '33px',
      textAlign: 'center',
      lineHeight: '33px'
    },
    '& svg': {
      width: '24px',
      height: '24px',
      textAlign: 'center',
      lineHeight: '33px',
      margin: '5px 4px 0px'
    }
  },
  cardHeaderText: {},
  warningCardHeader: {
    color: '#FFFFFF',
    '&:not($cardHeaderText):not($cardHeaderIcon)': {
      ...warningCardHeader
    }
  },
  successCardHeader: {
    color: '#FFFFFF',
    '&:not($cardHeaderText):not($cardHeaderIcon)': {
      ...successCardHeader
    }
  },
  dangerCardHeader: {
    color: '#FFFFFF',
    '&:not($cardHeaderText):not($cardHeaderIcon)': {
      ...dangerCardHeader
    }
  },
  blueCardHeader: {
    color: '#FFFFFF',
    '&:not($cardHeaderText):not($cardHeaderIcon)': {
      ...blueCardHeader
    }
  },
  infoCardHeader: {
    color: '#FFFFFF',
    '&:not($cardHeaderText):not($cardHeaderIcon)': {
      ...infoCardHeader
    }
  },
  primaryCardHeader: {
    color: '#FFFFFF',
    '&:not($cardHeaderText):not($cardHeaderIcon)': {
      ...primaryCardHeader
    }
  },
  roseCardHeader: {
    color: '#FFFFFF',
    '&:not($cardHeaderText):not($cardHeaderIcon)': {
      ...roseCardHeader
    }
  }
};

export {
  hoverStyles,
  cardStyles,
  cardBodyStyles,
  cardIconStyles,
  cardHeaderStyles
};
