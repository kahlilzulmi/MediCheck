import React from 'react';
import LoginForm from '../components/login_form';

const Login = ({ setIsAuthenticated }) => {
  return(
    <LoginForm setIsAuthenticated={setIsAuthenticated} />
  )
};

export default Login;
