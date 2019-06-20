import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField';

// Frontend Lib Imports

// Style Imports
import './input.scss'

class Input extends Component {

  handleChange = (e) => {
    console.log('handleChange', e.target.value);
    const { onChange } = this.props;
    e.preventDefault();
    this.props.onChange(e.target.value);
  }

  render() {
    const { type, label, onSubmit, handleSubmit } = this.props;
    return (
      <form onSubmit={(e)=> handleSubmit(e)} noValidate autoComplete="off">
        <TextField
          label={label}
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
  type: null,
  label: 'no label',
  handleSubmit: (e) => e.preventDefault(),
}

export default Input





/*
value={values.name}
*/
