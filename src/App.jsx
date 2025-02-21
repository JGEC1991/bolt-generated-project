import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, NavLink } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import Auth from './Auth';
import MyProfile from './MyProfile';
import Activities from './Activities';
import Settings from './Settings';
import Vehicle from './Vehicle';
import './App.css';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <Router>
      <div className="container mx-auto px-4 py-8">
        <nav className="app-navbar">
          <ul className="app-navbar-list">
            <div className="app-navbar-group">
              <li className="app-navbar-item">
                <Link to="/" className="app-navbar-link">
                  <img src="https://fbldpvpdmvtrfxdslfba.supabase.co/storage/v1/object/public/assets//Home.png" alt="Home" className="app-navbar-icon" />
                </Link>
              </li>
              <li className="app-navbar-item">
                <NavLink to="/activities" className={({ isActive }) => `app-navbar-link ${isActive ? 'active' : ''}`}>
                  <img src="https://fbldpvpdmvtrfxdslfba.supabase.co/storage/v1/object/public/assets//Activities.gif" alt="Activities" className="app-navbar-icon" />
                </NavLink>
              </li>
              <li className="app-navbar-item">
                <NavLink to="/vehicle" className={({ isActive }) => `app-navbar-link ${isActive ? 'active' : ''}`}>
                  <img src="https://fbldpvpdmvtrfxdslfba.supabase.co/storage/v1/object/public/assets//my-vehicule-icon.png" alt="Vehicle" className="app-navbar-icon" />
                </NavLink>
              </li>
              {session ? (
                <li className="app-navbar-item">
                  <NavLink to="/profile" className={({ isActive }) => `app-navbar-link ${isActive ? 'active' : ''}`}>
                    <img src="https://fbldpvpdmvtrfxdslfba.supabase.co/storage/v1/object/public/assets//my-profile-icon.png" alt="Profile" className="app-navbar-icon" />
                  </NavLink>
                </li>
              ) : (
                <li className="app-navbar-item">
                  <NavLink to="/auth" className={({ isActive }) => `app-navbar-link ${isActive ? 'active' : ''}`}>Auth</NavLink>
                </li>
              )}
            </div>
            <li className="app-navbar-item app-navbar-item-right">
              {session ? (
                <button onClick={() => supabase.auth.signOut()} className="app-navbar-link">
                  Logout
                </button>
              ) : (
                <NavLink to="/auth" className={({ isActive }) => `app-navbar-link ${isActive ? 'active' : ''}`}>
                  Login
                </NavLink>
              )}
              <NavLink to="/settings" className={({ isActive }) => `app-navbar-link ${isActive ? 'active' : ''}`}>
                <img src="https://fbldpvpdmvtrfxdslfba.supabase.co/storage/v1/object/public/assets//settings-icon.png" alt="Settings" className="app-navbar-icon" />
              </NavLink>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<MyProfile session={session} />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/vehicle" element={<Vehicle />} />
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4">Welcome to My Website</h2>
      <p className="text-gray-600 dark:text-gray-400">This is a basic React website integrated with Supabase for authentication and data storage.</p>
    </div>
  );
}

export default App;
