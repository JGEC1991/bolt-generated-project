import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';

function Auth({ showSignUp = true }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [licenseExpirationDate, setLicenseExpirationDate] = useState('');
  const [legalDocuments, setLegalDocuments] = useState(false);
  const [plateNumber, setPlateNumber] = useState('');
  const [address, setAddress] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
            id_number: idNumber,
            license_expiration_date: licenseExpirationDate,
            legal_documents: legalDocuments,
            plate_number: plateNumber,
            address: address,
            profile_image: profileImage,
          },
        },
      });

      if (error) {
        console.error('Supabase sign-up error:', error);
        alert(`Sign-up failed: ${error.message}`);
        throw error;
      }

      console.log('Sign-up successful. Check your email!');
      alert('Check your email for the confirmation link!');
      navigate('/account');
    } catch (error) {
      console.error('Error during sign-up:', error);
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) {
        console.error('Supabase login error:', error);
        alert(`Login failed: ${error.message}`);
        throw error;
      }
      alert('Logged in successfully!');
      navigate('/account');
    } catch (error) {
      console.error('Error during login:', error);
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-box">
      {!showSignUp && (
        <form onSubmit={handleLogin} className="login-form">
          <div>
            <input
              className="inputField"
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              className="inputField"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              Login
            </button>
          </div>
        </form>
      )}
      {showSignUp && (
        <form onSubmit={handleSignUp} className="login-form">
          <div>
            <input
              className="inputField"
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              className="inputField"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              className="inputField"
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              className="inputField"
              type="text"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              className="inputField"
              type="text"
              placeholder="ID Number"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              className="inputField"
              type="date"
              placeholder="License Expiration Date"
              value={licenseExpirationDate}
              onChange={(e) => setLicenseExpirationDate(e.target.value)}
            />
          </div>
          <div>
            <input
              className="inputField"
              type="text"
              placeholder="Plate Number"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value)}
            />
          </div>
          <div>
            <input
              className="inputField"
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div>
            <input
              className="inputField"
              type="text"
              placeholder="Profile Image URL"
              value={profileImage}
              onChange={(e) => setProfileImage(e.target.value)}
            />
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                checked={legalDocuments}
                onChange={(e) => setLegalDocuments(e.target.checked)}
              />
              I agree to the legal documents
            </label>
          </div>
          <div>
            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              Sign Up
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Auth;
