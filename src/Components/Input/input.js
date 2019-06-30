import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";

// Frontend Lib Imports

// Style Imports
import "./input.scss";

class Input extends Component {

  handleChange = e => {
    const { onChange, error, clearError } = this.props;
    e.preventDefault();
    if (error) {
      clearError();
    }
    this.props.onChange(e.target.value);
  };

  render() {
    const {
      type,
      label,
      onSubmit,
      handleSubmit,
      error,
      helperText,
      clearError,
      value,
      autoFocus,
    } = this.props;
    return (
      <form
        style={{ maxWidth: "195px" }}
        onSubmit={e => handleSubmit(e)}
        noValidate
        autoComplete="off"
      >
        <TextField
          label={label}
          onChange={e => this.handleChange(e)}
          margin="normal"
          type={type}
          error={error}
          helperText={helperText}
          value={value}
          autoFocus={autoFocus}
        />
      </form>
    );
  }
}

Input.defaultProps = {
  onChange: () => null,
  type: null,
  label: "no label",
  handleSubmit: e => e.preventDefault(),
  value: null,
  autoFocus: false,
};

export default Input;
