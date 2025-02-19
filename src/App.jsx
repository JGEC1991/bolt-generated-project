import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import MyProfile from './MyProfile';
import Vehicle from './Vehicle';
import Events from './Events';

function App() {
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
        <Link to="/login" className="login-button">Login</Link>
      </header>
      <Routes>
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/vehicle" element={<Vehicle />} />
        <Route path="/events" element={<Events />} />
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>
    </div>
  );
}

export default App;
