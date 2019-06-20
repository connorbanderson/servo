import React, { Component } from 'react'

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
      <form>
        <div type={type} className="group">
          <input onChange={(e)=>this.handleChange(e)} type="text" required />
          <span className="highlight"></span>
          <span className="bar"></span>
          <label>{this.props.label}</label>
        </div>
      </form>
    )
  }
}

Input.defaultProps = {
  onChange: () => null,
  type: null
}

export default Input
