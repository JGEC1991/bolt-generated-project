import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

function MyProfile() {
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [licenseExpiryDate, setLicenseExpiryDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [session, setSession] = useState(null);
  const [initialProfileData, setInitialProfileData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    if (session) {
      fetchProfileData();
    }
  }, [session]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, email, phone, address, license_expiry_date, profile_image')
        .eq('id', session?.user?.id)
        .single();

      if (error) {
        console.error('Error fetching profile data:', error);
        alert('Failed to load profile data.');
      } else if (data) {
        setName(data.full_name || '');
        setEmail(data.email || '');
        setPhone(data.phone || '');
        setAddress(data.address || '');
        setLicenseExpiryDate(data.license_expiry_date || '');
        setInitialProfileData(data);
        setProfileImageUrl(data.profile_image || '');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.size <= 20 * 1024 * 1024) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Image size should be less than 20MB.');
    }
  };

  const uploadProfileImage = async () => {
    try {
      setLoading(true);

      if (!session?.user) {
        console.error('User is not authenticated.');
        alert('User is not authenticated. Please log in.');
        return;
      }

      if (!selectedFile) {
        alert('Please select an image to upload.');
        return;
      }

      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${session.user.id}.${fileExt}`; // File name includes user ID
      const filePath = `${fileName}`; // Path within the bucket

      const { data, error } = await supabase.storage
        .from('profile-photos')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image.');
        return;
      }

      const imageUrl = `${supabase.supabaseUrl}/storage/v1/object/public/profile-photos/${filePath}`;
      setProfileImageUrl(imageUrl);

      await updateProfile({ profile_image: imageUrl });
    } catch (error) {
      console.error('Error uploading profile image:', error);
      alert('Error uploading profile image.');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    try {
      setLoading(true);

      if (!session?.user) {
        console.error('User is not authenticated.');
        alert('User is not authenticated. Please log in.');
        return;
      }

      const updatesToApply = { ...updates };

      if (name !== initialProfileData.full_name) {
        updatesToApply.full_name = name;
      }
      if (email !== initialProfileData.email) {
        updatesToApply.email = email;
      }
      if (phone !== initialProfileData.phone) {
        updatesToApply.phone = phone;
      }
      if (address !== initialProfileData.address) {
        updatesToApply.address = address;
      }
      if (licenseExpiryDate !== initialProfileData.license_expiry_date) {
        updatesToApply.license_expiry_date = licenseExpiryDate || null;
      }

      if (Object.keys(updatesToApply).length === 0) {
        alert('No changes to update.');
        setIsEditing(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(updatesToApply)
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        alert('Failed to update profile.');
      } else {
        alert('Profile updated successfully!');
        setIsEditing(false);
        fetchProfileData();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    const updates = {};
    if (name !== initialProfileData.full_name) {
      updates.full_name = name;
    }
    if (email !== initialProfileData.email) {
      updates.email = email;
    }
    if (phone !== initialProfileData.phone) {
      updates.phone = phone;
    }
    if (address !== initialProfileData.address) {
      updates.address = address;
    }
    if (licenseExpiryDate !== initialProfileData.license_expiry_date) {
      updates.license_expiry_date = licenseExpiryDate || null;
    }

    await updateProfile(updates);
  };

  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="profile-left-panel">
          <div className="profile-picture-container">
            <div className="profile-picture-frame">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="profile-picture" />
              ) : profileImageUrl ? (
                <img src={profileImageUrl} alt="Profile" className="profile-picture" />
              ) : (
                <div className="profile-picture-placeholder">Upload Photo</div>
              )}
            </div>
            <input type="file" accept="image/*" onChange={handleImageChange} className="profile-image-input" />
            {selectedFile && (
              <div style={{ marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={uploadProfileImage}
                  disabled={loading}
                  className="save-button"
                  style={{
                    padding: '5px 10px',
                    fontSize: '0.8em',
                  }}
                >
                  {loading ? 'Uploading...' : 'Upload Image'}
                </button>
              </div>
            )}
          </div>
          {loading ? (
            <p>Loading profile data...</p>
          ) : session ? (
            <form className="profile-form">
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                {isEditing ? (
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                ) : (
                  <input type="text" id="name" value={name} readOnly />
                )}
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                {isEditing ? (
                  <input
                    type="text"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                ) : (
                  <input type="text" id="email" value={email} readOnly />
                )}
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone:</label>
                {isEditing ? (
                  <input
                    type="text"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                ) : (
                  <input type="text" id="phone" value={phone} readOnly />
                )}
              </div>
              <div className="form-group">
                <label htmlFor="address">Address:</label>
                {isEditing ? (
                  <input
                    type="text"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                ) : (
                  <input type="text" id="address" value={address} readOnly />
                )}
              </div>
              <div className="form-group">
                <label htmlFor="licenseExpiryDate">License Expiry Date:</label>
                {isEditing ? (
                  <input
                    type="date"
                    id="licenseExpiryDate"
                    value={licenseExpiryDate}
                    onChange={(e) => setLicenseExpiryDate(e.target.value)}
                  />
                ) : (
                  <input
                    type="date"
                    id="licenseExpiryDate"
                    value={licenseExpiryDate}
                    disabled
                  />
                )}
              </div>
              {!isEditing ? (
                <button type="button" className="edit-button" onClick={() => setIsEditing(true)}>
                  Edit
                </button>
              ) : (
                <div className="save-button-container">
                  <button type="button" className="save-button" onClick={handleSaveProfile}>
                    Save
                  </button>
                </div>
              )}
            </form>
          ) : (
            <p>Loading session...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
