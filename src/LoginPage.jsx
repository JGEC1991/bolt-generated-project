import React from 'react';
import Auth from './Auth';

function LoginPage() {
  return (
    <div className="login-page container">
      <Auth showSignUp={false} />
    </div>
  );
}

export default LoginPage;
