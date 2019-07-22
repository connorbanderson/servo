import React from 'react'
import './Empty.scss'
import emptyImage from './empty.svg'

const Empty = ({ text }) => (
  <div className='empty'>
    <img className='empty__image' alt='empty image' src={emptyImage} />
    <span className='empty__text'>{text}</span>
  </div>
)

export default Empty

Empty.defaultProps = {
  text: 'Placeholder Text',
}
