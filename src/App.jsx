import React, { useState, useEffect, useRef } from 'react';
    import {
      BrowserRouter as Router,
      Route,
      Routes,
      Link,
      NavLink,
    } from 'react-router-dom';
    import { createClient } from '@supabase/supabase-js';
    import Auth from './Auth';
    import MyProfile from './MyProfile';
    import Activities from './Activities';
    import Settings from './Settings';
    import Vehicle from './Vehicle';
    import VehicleAdd from './VehicleAdd';
    import ActivityAdd from './ActivityAdd';
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
      const [isDropdownOpen, setIsDropdownOpen] = useState(false);
      const dropdownRef = useRef(null);
      const [isVehicleAddModalOpen, setIsVehicleAddModalOpen] = useState(false);
      const [isActivityAddModalOpen, setIsActivityAddModalOpen] = useState(false);

      useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
          setSession(session);
        });

        supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session);
        });

        const handleClickOutside = (event) => {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsDropdownOpen(false);
          }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);

      const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
      };

      const openVehicleAddModal = () => {
        setIsVehicleAddModalOpen(true);
        setIsDropdownOpen(false); // Close the dropdown when modal opens
      };

      const closeVehicleAddModal = () => {
        setIsVehicleAddModalOpen(false);
      };

      const openActivityAddModal = () => {
        setIsActivityAddModalOpen(true);
        setIsDropdownOpen(false); // Close the dropdown when modal opens
      };

      const closeActivityAddModal = () => {
        setIsActivityAddModalOpen(false);
      };

      return (
        <Router>
          <div className="container mx-auto px-4 py-8">
            <nav className="app-navbar">
              <ul className="app-navbar-list">
                <div className="app-navbar-group">
                  <li className="app-navbar-item">
                    <Link to="/" className="app-navbar-link">
                      <img
                        src="https://fbldpvpdmvtrfxdslfba.supabase.co/storage/v1/object/public/assets//Home.png"
                        alt="Home"
                        className="app-navbar-icon"
                      />
                    </Link>
                  </li>
                  <li className="app-navbar-item">
                    <NavLink
                      to="/activities"
                      className={({ isActive }) => `app-navbar-link ${isActive ? 'active' : ''}`}
                    >
                      <img
                        src="https://fbldpvpdmvtrfxdslfba.supabase.co/storage/v1/object/public/assets//Activities.gif"
                        alt="Activities"
                        className="app-navbar-icon"
                      />
                    </NavLink>
                  </li>
                  <li className="app-navbar-item">
                    <NavLink
                      to="/vehicle"
                      className={({ isActive }) => `app-navbar-link ${isActive ? 'active' : ''}`}
                    >
                      <img
                        src="https://fbldpvpdmvtrfxdslfba.supabase.co/storage/v1/object/public/assets//my-vehicule-icon.png"
                        alt="Vehicle"
                        className="app-navbar-icon"
                      />
                    </NavLink>
                  </li>
                  {session ? (
                    <li className="app-navbar-item">
                      <NavLink
                        to="/profile"
                        className={({ isActive }) => `app-navbar-link ${isActive ? 'active' : ''}`}
                      >
                        <img
                          src="https://fbldpvpdmvtrfxdslfba.supabase.co/storage/v1/object/public/assets//my-profile-icon.png"
                          alt="Profile"
                          className="app-navbar-icon"
                        />
                      </NavLink>
                    </li>
                  ) : (
                    <li className="app-navbar-item">
                      <NavLink
                        to="/auth"
                        className={({ isActive }) => `app-navbar-link ${isActive ? 'active' : ''}`}
                      >
                        Auth
                      </NavLink>
                    </li>
                  )}
                </div>
                <div
                  className="app-navbar-item app-navbar-item-right"
                  ref={dropdownRef}
                >
                  {session && (
                    <div className="relative">
                      <button
                        onClick={toggleDropdown}
                        className="app-navbar-link add-button"
                      >
                        <img
                          src="https://fbldpvpdmvtrfxdslfba.supabase.co/storage/v1/object/public/assets//universal-add-icon.png"
                          alt="Add"
                          className="app-navbar-icon"
                        />
                      </button>
                      {isDropdownOpen && (
                        <div className="dropdown">
                          <button
                            onClick={openVehicleAddModal}
                            className="dropdown-item"
                          >
                            Add Vehicle
                          </button>
                          <button
                            onClick={openActivityAddModal}
                            className="dropdown-item"
                          >
                            Add Activity
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  {session ? (
                    <button
                      onClick={() => supabase.auth.signOut()}
                      className="app-navbar-link logout-button"
                    >
                      Logout
                    </button>
                  ) : (
                    <NavLink
                      to="/auth"
                      className={({ isActive }) => `app-navbar-link ${isActive ? 'active' : ''}`}
                    >
                      Login
                    </NavLink>
                  )}
                  <NavLink
                    to="/settings"
                    className={({ isActive }) => `app-navbar-link ${isActive ? 'active' : ''}`}
                  >
                    <img
                      src="https://fbldpvpdmvtrfxdslfba.supabase.co/storage/v1/object/public/assets//settings-icon.png"
                      alt="Settings"
                      className="app-navbar-icon"
                    />
                  </NavLink>
                </div>
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

            {/* Vehicle Add Modal */}
            {isVehicleAddModalOpen && (
              <div className="modal">
                <div className="modal-content">
                  <span className="close" onClick={closeVehicleAddModal}>
                    &times;
                  </span>
                  <VehicleAdd closeModal={closeVehicleAddModal} />
                </div>
              </div>
            )}

            {/* Activity Add Modal */}
            {isActivityAddModalOpen && (
              <div className="modal">
                <div className="modal-content">
                  <span className="close" onClick={closeActivityAddModal}>
                    &times;
                  </span>
                  <ActivityAdd closeModal={closeActivityAddModal} session={session} />
                </div>
              </div>
            )}
          </div>
        </Router>
      );
    }

    function Home() {
      return (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            Welcome to My Website
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            This is a basic React website integrated with Supabase for
            authentication and data storage.
          </p>
        </div>
      );
    }

    export default App;
