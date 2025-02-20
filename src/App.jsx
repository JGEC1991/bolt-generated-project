import React, { useState, useEffect } from 'react';
import { Link, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import MyProfile from './MyProfile';
import Vehicle from './Vehicle';
import Activities from './Activities';
import LoginPage from './LoginPage';
import { supabase } from './supabaseClient';
import './index.css'; // Import the CSS file
import Settings from './Settings';

// Import image assets
const homeIcon = 'https://fbldpvpdmvtrfxdslfba.supabase.co/storage/v1/object/public/assets//my-vehicule-icon.png';
const myProfileIcon = 'https://fbldpvpdmvtrfxdslfba.supabase.co/storage/v1/object/public/assets//my-profile-icon.png';
const activitiesIcon = 'https://fbldpvpdmvtrfxdslfba.supabase.co/storage/v1/object/public/assets//Activities.gif';
const settingsIcon = 'https://fbldpvpdmvtrfxdslfba.supabase.co/storage/v1/object/public/assets//my-seetings-icon.png';

function App() {
  const [session, setSession] = useState(null);
  const navigate = useNavigate();
  const [theme, setTheme] = useState('light');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation(); // Get current location

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
        <nav className="nav">
          <ul className="nav-list">
            <li className={`nav-item ${location.pathname === '/my-profile' ? 'active' : ''}`}>
              <Link to="/my-profile" className="nav-link">
                <img src={myProfileIcon} alt="My Profile" className="nav-icon" />
                My Profile
              </Link>
            </li>
            <li className={`nav-item ${location.pathname === '/vehicle' ? 'active' : ''}`}>
              <Link to="/vehicle" className="nav-link">
                <img src={homeIcon} alt="Vehicle" className="nav-icon" />
                Vehicle
              </Link>
            </li>
            <li className={`nav-item ${location.pathname === '/activities' ? 'active' : ''}`}>
              <Link to="/activities" className="nav-link">
                <img src={activitiesIcon} alt="Activities" className="nav-icon" />
                Activities
              </Link>
            </li>
            <li className={`nav-item ${location.pathname === '/settings' ? 'active' : ''}`}>
              <Link to="/settings" className="nav-link">
                <img src={settingsIcon} alt="Settings" className="nav-icon" />
                Settings
              </Link>
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
        <Route path="/activities" element={<Activities session={session} />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  );
}

export default App;
