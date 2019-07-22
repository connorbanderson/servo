import React from 'react';
import './AuthedLayout.scss';

const AuthedLayout = ({ children }) => (
  <section className='authedLayout'>
    {children}
  </section>
);

AuthedLayout.defaultProps = {
  children: null,
}

export default AuthedLayout;
