import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField';

// Frontend Lib Imports

// Style Imports
import './input.scss'

class Input extends Component {

  handleChange = (e) => {
    const { onChange } = this.props;
    e.preventDefault();
    this.props.onChange(e.target.value);
  }

  render() {
    const { type } = this.props;
    return (
      <form noValidate autoComplete="off">
        <TextField
          id="standard-name"
          label="Email"
          onChange={(e)=>this.handleChange(e)}
          margin="normal"
          type={type}
        />
      </form>
    )
  }
}

Input.defaultProps = {
  onChange: () => null,
  type: null
}

export default Input





/*
value={values.name}
*/
