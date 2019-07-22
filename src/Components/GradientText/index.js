import React from 'react';
import './GradientText.scss';

const GradientText = ({ text, size }) => (
  <h1 className={`gradientText gradientText--${size}`}>
    {text}
  </h1>
);

GradientText.defaultProps = {
  text: 'Gradient Text Placeholder',
  size: 'medium',
};

export default GradientText;
