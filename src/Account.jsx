import React, { useState, useEffect } from 'react';
    import { supabase } from './supabaseClient';

    const Account = ({ session }) => {
      const [loading, setLoading] = useState(false);
      const [name, setName] = useState('');
      const [phone, setPhone] = useState('');
      const [driverLicense, setDriverLicense] = useState('');
      const [legalDocuments, setLegalDocuments] = useState('');
      const [username, setUsername] = useState('');
      const [website, setWebsite] = useState('');
      const [avatar_url, setAvatarUrl] = useState('');

      useEffect(() => {
        getProfile();
      }, [session]);

      const getProfile = async () => {
        try {
          setLoading(true);
          const { data, error, status } = await supabase
            .from('profiles')
            .select(`full_name, phone, driver_license, legal_documents, username, website, avatar_url`)
            .eq('id', session?.user?.id)
            .single();

          if (error && status !== 406) {
            throw error;
          }

          if (data) {
            setName(data.full_name || '');
            setPhone(data.phone || '');
            setDriverLicense(data.driver_license || '');
            setLegalDocuments(data.legal_documents || '');
            setUsername(data.username || '');
            setWebsite(data.website || '');
            setAvatarUrl(data.avatar_url || '');
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

          const updates = {
            id: session?.user?.id,
            full_name: name,
            phone,
            driver_license,
            legal_documents,
            username,
            website,
            avatar_url,
            updated_at: new Date(),
          };

          const { error } = await supabase.from('profiles').upsert(updates);

          if (error) {
            console.error('Error updating profile:', error);
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
            <label htmlFor="driverLicense">Driver License</label>
            <input
              id="driverLicense"
              type="text"
              value={driverLicense}
              onChange={(e) => setDriverLicense(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="legalDocuments">Legal Documents</label>
            <input
              id="legalDocuments"
              type="text"
              value={legalDocuments}
              onChange={(e) => setLegalDocuments(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="website">Website</label>
            <input
              id="website"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="avatar_url">Avatar URL</label>
            <input
              id="avatar_url"
              type="url"
              value={avatar_url}
              onChange={(e) => setAvatarUrl(e.target.value)}
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
