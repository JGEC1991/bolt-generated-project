import React, { useState, useEffect } from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import MyProfile from './MyProfile';
import Vehicle from './Vehicle';
import Events from './Events';
import LoginPage from './LoginPage';
import { supabase } from './supabaseClient';

function App() {
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="container">
      <header className="header">
        <nav className="nav">
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/my-profile">My Profile</Link>
            </li>
            <li className="nav-item">
              <Link to="/vehicle">Vehicle</Link>
            </li>
            <li className="nav-item">
              <Link to="/events">Events</Link>
            </li>
          </ul>
        </nav>
        {session ? (
          <div>
            <button className="logout-button" onClick={handleSignOut}>
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="login-button">
            Login
          </Link>
        )}
      </header>
      <Routes>
        <Route path="/my-profile" element={<MyProfile session={session} />} />
        <Route path="/vehicle" element={<Vehicle />} />
        <Route path="/events" element={<Events />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  );
}

export default App;
