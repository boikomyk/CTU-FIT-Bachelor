import {
  primaryColorLight,
  warningColorLight,
  dangerColorLight,
  successColorLight,
  infoColorLight,
  roseColorLight,
  grayColorLight,
  primaryColor,
  warningColor,
  dangerColor,
  successColor,
  infoColor,
  roseColor,
  grayColor
} from 'styles/app.jss';

const textFieldStyles = () => ({
  cssFocused: {},

  notchedOutlinePrimary: {
    borderColor: primaryColorLight
  },
  cssLabelPrimary: {
    color: primaryColor + '!important'
  },
  cssOutlinedInputPrimary: {
    '&$cssFocused $notchedOutlinePrimary': {
      borderColor: primaryColor + '!important'
    }
  },

  notchedOutlineWarning: {
    borderColor: warningColorLight
  },
  cssLabelWarning: {
    color: warningColor + '!important'
  },
  cssOutlinedInputWarning: {
    '&$cssFocused $notchedOutlineWarning': {
      borderColor: warningColor + '!important'
    }
  },

  notchedOutlineDanger: {
    borderColor: dangerColorLight
  },
  cssLabelDanger: {
    color: dangerColor + '!important'
  },
  cssOutlinedInputDanger: {
    '&$cssFocused $notchedOutlineDanger': {
      borderColor: dangerColor + '!important'
    }
  },

  notchedOutlineSuccess: {
    borderColor: successColorLight
  },
  cssLabelSuccess: {
    color: successColor + '!important'
  },
  cssOutlinedInputSuccess: {
    '&$cssFocused $notchedOutlineSuccess': {
      borderColor: successColor + '!important'
    }
  },

  notchedOutlineInfo: {
    borderColor: infoColorLight
  },
  cssLabelInfo: {
    color: infoColor + '!important'
  },
  cssOutlinedInputInfo: {
    '&$cssFocused $notchedOutlineInfo': {
      borderColor: infoColor + '!important'
    }
  },

  notchedOutlineRose: {
    borderColor: roseColorLight
  },
  cssLabelRose: {
    color: roseColor + '!important'
  },
  cssOutlinedInputRose: {
    '&$cssFocused $notchedOutlineRose': {
      borderColor: roseColor + '!important'
    }
  },

  notchedOutlineGray: {
    borderColor: grayColorLight
  },
  cssLabelGray: {
    color: grayColor + '!important'
  },
  cssOutlinedInputGray: {
    '&$cssFocused $notchedOutlineGray': {
      borderColor: grayColor + '!important'
    }
  }
});

export default textFieldStyles;
