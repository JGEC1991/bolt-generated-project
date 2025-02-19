import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Auth from './Auth';
import Account from './Account';
import DriverDashboard from './DriverDashboard';
import AdminDashboard from './AdminDashboard';
import VehicleCondition from './VehicleCondition';
import LeasePayments from './LeasePayments';
// import './App.css';

function App() {
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (session) {
        const { data, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching admin status:', error);
          setIsAdmin(false);
        } else if (data) {
          setIsAdmin(data.is_admin || false);
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [session]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="container mx-auto">
      <header className="flex justify-between items-center py-4">
        <h1 className="text-2xl font-bold">VIP Taxi</h1>
        <nav>
          {session ? (
            <>
              <Link to="/account" className="mr-4">Account</Link>
              {isAdmin ? (
                <Link to="/admin" className="mr-4">Admin Dashboard</Link>
              ) : (
                <Link to="/driver" className="mr-4">Driver Dashboard</Link>
              )}
              <button onClick={handleSignOut} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Sign Out
              </button>
            </>
          ) : (
            <Link to="/login" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Login
            </Link>
          )}
        </nav>
      </header>

      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/account" element={session ? <Account session={session} /> : <Auth />} />
        <Route path="/driver" element={session ? <DriverDashboard session={session} /> : <Auth />} />
        <Route path="/admin" element={session ? <AdminDashboard session={session} /> : <Auth />} />
        <Route path="/vehicle-condition" element={session ? <VehicleCondition session={session} /> : <Auth />} />
        <Route path="/lease-payments" element={session ? <LeasePayments session={session} /> : <Auth />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

function Home() {
  return (
    <div className="text-center mt-10">
      <h2 className="text-3xl font-bold mb-4">Welcome to VIP Taxi</h2>
      <p className="text-lg">Manage your taxi operations efficiently.</p>
    </div>
  );
}

export default App;
