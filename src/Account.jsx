import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const Account = ({ session }) => {
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [legalDocuments, setLegalDocuments] = useState(false);
  const [plateNumber, setPlateNumber] = useState('');
  const [email, setEmail] = useState('');

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
        .select(`full_name, phone, legal_documents, plate_number, email`)
        .eq('id', session.user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setFullName(data.full_name || '');
        setPhone(data.phone || '');
        setLegalDocuments(data.legal_documents || false);
        setPlateNumber(data.plate_number || '');
        setEmail(data.email || '');
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
        full_name: fullName,
        phone,
        legal_documents: legalDocuments,
        plate_number: plateNumber,
        email: email,
      });

      const updates = {
        id: session?.user?.id,
        full_name: fullName,
        phone,
        legal_documents: legalDocuments,
        plate_number: plateNumber,
        email: email,
        updated_at: new Date(),
      };

      const { data, error } = await supabase.from('profiles').upsert(updates).eq('id', session.user.id);

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
        <label htmlFor="fullName">Full Name</label>
        <input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
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
        <label htmlFor="plateNumber">Plate Number</label>
        <input
          id="plateNumber"
          type="text"
          value={plateNumber}
          onChange={(e) => setPlateNumber(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
