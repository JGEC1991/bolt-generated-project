import React, { useState, useEffect } from 'react';
    import { Link, Route, Routes, useNavigate } from 'react-router-dom';
    import MyProfile from './MyProfile';
    import Vehicle from './Vehicle';
    import Events from './Events';
    import LoginPage from './LoginPage';
    import { supabase } from './supabaseClient';
    import './index.css'; // Import the CSS file

    function App() {
      const [session, setSession] = useState(null);
      const navigate = useNavigate();
      const [theme, setTheme] = useState('light');
      const [isDarkMode, setIsDarkMode] = useState(false);

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

      const toggleTheme = () => {
        setIsDarkMode((prevMode) => !prevMode);
      };

      useEffect(() => {
        if (isDarkMode) {
          document.body.classList.add('dark');
        } else {
          document.body.classList.remove('dark');
        }
      }, [isDarkMode]);

      return (
        <div className={`container ${isDarkMode ? 'dark' : ''}`}>
          <div className="header-top">
            <div className="dark-mode-toggle-container">
              <span className="dark-mode-label">
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </span>
              <label className="switch">
                <input type="checkbox" checked={isDarkMode} onChange={toggleTheme} />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
          <header className="header">
            <nav className={`nav ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}>
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
            <div className="header-buttons">
              {session ? (
                <button className="logout-button" onClick={handleSignOut}>
                  Logout
                </button>
              ) : (
                <Link to="/login" className="login-button">
                  Login
                </Link>
              )}
            </div>
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
