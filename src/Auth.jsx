import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';

function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (email, password) => {
    try {
      setLoading(true);
      let response;
      if (isSignUp) {
        response = await supabase.auth.signUp({
          email: email,
          password: password,
        });
      } else {
        response = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });
      }

      if (response.error) throw response.error;
      alert(isSignUp ? 'Check your email to verify your account!' : 'Signed in!');
      navigate('/profile');
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row flex flex-center">
      <div className="col-6 form-widget">
        <h1 className="header">Supabase + React Authentication</h1>
        <p className="description">
          {isSignUp ? 'Sign up with your email and password' : 'Sign in with your email and password'}
        </p>
        <div>
          <input
            className="inputField"
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <input
            className="inputField"
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleAuth(email, password);
            }}
            className={'button block primary' + (loading ? ' loading' : '')}
            disabled={loading}
          >
            {loading ? <span>Loading</span> : <span>{isSignUp ? 'Sign Up' : 'Sign In'}</span>}
          </button>
        </div>
        <div className="mt-4">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="button block secondary"
          >
            {isSignUp ? 'Already have an account? Sign In' : 'Don\'t have an account? Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Auth;
