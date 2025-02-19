import React, { useState } from 'react';
    import { supabase } from './supabaseClient';
    import { useNavigate } from 'react-router-dom';

    function Auth() {
      const [loading, setLoading] = useState(false);
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [fullName, setFullName] = useState('');
      const [phone, setPhone] = useState('');
      const [idNumber, setIdNumber] = useState('');
      const [licenseExpirationDate, setLicenseExpirationDate] = useState('');
      const [legalDocuments, setLegalDocuments] = useState(false);
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
        <div className="row flex-auto flex-col justify-center">
          <div className="col-6 form-widget">
            <h1>{isSignUp ? 'Sign Up' : 'Login'}</h1>
            <button onClick={() => setIsSignUp(!isSignUp)}>
              {isSignUp ? 'Already have an account? Login' : 'Need an account? Sign Up'}
            </button>

            {isSignUp ? (
              <form onSubmit={handleSignUp}>
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
                    type="tel"
                    placeholder="Phone Number"
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
                  <label htmlFor="licenseExpirationDate">Driver License Expiration Date</label>
                  <input
                    className="inputField"
                    type="date"
                    id="licenseExpirationDate"
                    placeholder="Driver License Expiration Date"
                    value={licenseExpirationDate}
                    onChange={(e) => setLicenseExpirationDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="legalDocuments">Legal Documents</label>
                  <input
                    type="checkbox"
                    id="legalDocuments"
                    checked={legalDocuments}
                    onChange={(e) => setLegalDocuments(e.target.checked)}
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="button block primary"
                    disabled={loading}
                  >
                    {loading ? <span>Loading</span> : <span>Sign Up</span>}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleLogin}>
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
                    className="button block primary"
                    disabled={loading}
                  >
                    {loading ? <span>Login</span> : <span>Login</span>}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      );
    }

    export default Auth;
