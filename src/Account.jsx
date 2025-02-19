<file path="src/Account.jsx">
      import React, { useState, useEffect } from 'react';
      import { supabase } from './supabaseClient';

      const Account = ({ session }) => {
        const [loading, setLoading] = useState(false);
        const [name, setName] = useState('');
        const [phone, setPhone] = useState('');
        const [legalDocuments, setLegalDocuments] = useState(false);

        useEffect(() => {
          getProfile();
        }, [session]);

        const getProfile = async () => {
          try {
            setLoading(true);
            console.log('Session:', session);
            if (!session?.user?.id) {
              console.error('User ID is missing from session');
              alert('User ID is missing from session');
              return;
            }
            const { data, error, status } = await supabase
              .from('profiles')
              .select(`full_name, phone, legal_documents`)
              .eq('id', session.user.id)
              .single();

            if (error && status !== 406) {
              throw error;
            }

            if (data) {
              setName(data.full_name || '');
              setPhone(data.phone || '');
              setLegalDocuments(data.legal_documents || false);
            }
          } catch (error) {
            console.error('Error loading user data:', error);
            alert('Error loading user data!');
          } finally {
            setLoading(false);
          }
        };

        const updateProfile = async () => {
          try {
            setLoading(true);
            console.log('Updating profile with:', {
              id: session?.user?.id,
              full_name: name,
              phone,
              legalDocuments,
            });

            const updates = {
              full_name: name,
              phone,
              legal_documents: legalDocuments,
              updated_at: new Date(),
            };

            const { data, error } = await supabase
              .from('profiles')
              .update(updates)
              .eq('id', session.user.id)
              .select();

            if (error) {
              console.error('Error updating profile:', error);
              alert('Error updating the data!');
              throw error;
            }
            alert('Profile updated successfully!');
          } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error updating the data!');
          } finally {
            setLoading(false);
          }
        };

        return (
          <div className="form-widget">
            <div>
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
                className="button block primary"
                onClick={() => updateProfile()}
                disabled={loading}
              >
                {loading ? 'Loading ...' : 'Update'}
              </button>
            </div>
          </div>
        );
      };

      export default Account;
    </file>
