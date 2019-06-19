import React, { Component } from 'react'

// Frontend Lib Imports

// Style Imports
import './input.scss'

class Input extends Component {

  render() {
    return (
      <form>
        <div class="group">
          <input type="text" required />
          <span class="highlight"></span>
          <span class="bar"></span>
          <label> {this.props.label} </label>
        </div>
      </form>
    )
  }
}

export default Input
