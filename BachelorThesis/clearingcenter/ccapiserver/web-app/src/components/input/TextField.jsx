import React from "react";
import PropTypes from "prop-types";

import withStyles from "@material-ui/core/styles/withStyles";

import textFieldStyles from "styles/components/input/TextField.jss";
import TextField from "@material-ui/core/TextField";

function CustomTextField({ ...props }) {
  const {
    classes,
    textFieldOutlineColor,
    readOnly,
    InputProps,
    className,
    ...rest
  } = props;

  if (textFieldOutlineColor === undefined) {
    return <TextField {...rest} className={className} />;
  }

  return (
    <TextField
      {...rest}
      fullwidth="true"
      className={className}
      InputLabelProps={{
        classes: {
          root: classes["cssLabel" + textFieldOutlineColor],
          focused: classes["cssFocused"]
        }
      }}
      InputProps={{
        ...InputProps,
        classes: {
          root: classes["cssOutlinedInput" + textFieldOutlineColor],
          focused: classes["cssFocused"],
          notchedOutline: classes["notchedOutline" + textFieldOutlineColor]
        },
        readOnly: readOnly
      }}
      variant="outlined"
    />
  );
}

CustomTextField.defaultProps = {
  readOnly: false
};

CustomTextField.propTypes = {
  classes: PropTypes.object.isRequired,
  readOnly: PropTypes.bool,
  textFieldOutlineColor: PropTypes.oneOf([
    "Warning",
    "Primary",
    "Danger",
    "Success",
    "Info",
    "Rose",
    "Gray"
  ])
};

export default withStyles(textFieldStyles)(CustomTextField);
