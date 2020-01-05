const chartStyles = {
  tooltiptext: {
    visibility: 'hidden',
    width: '120px',
    backgroundColor: 'black',
    color: '#fff',
    textAlign: 'center',
    padding: '5px 0',
    borderRadius: '6px',
    position: 'absolute',
    zIndex: '1',
    '&:hover,&:focus': {
      visibility: 'visible'
    }
  }
};

export default chartStyles;
