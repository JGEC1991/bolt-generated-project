import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './supabaseClient';

function MyProfile({ session }) {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [updatedFullName, setUpdatedFullName] = useState('');
  const [updatedPhone, setUpdatedPhone] = useState('');
  const [updatedLicenseExpiryDate, setUpdatedLicenseExpiryDate] = useState('');
  const [updatedAddress, setUpdatedAddress] = useState('');

  useEffect(() => {
    getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      const { data, error, status } = await supabase
        .from('users')
        .select(`id, full_name, phone, legal_documents, updated_at, is_admin, plate_number, email, license_expiry_date, address, profile_image`)
        .eq('id', session?.user?.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setProfileData(data);
        setUpdatedFullName(data.full_name || '');
        setUpdatedPhone(data.phone || '');
        setUpdatedLicenseExpiryDate(data.license_expiry_date || '');
        setUpdatedAddress(data.address || '');
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function uploadImage(event) {
    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const filePath = `${session.user.id}/${Math.random()}.${fileExt}`;

    setUploading(true);

    try {
      const { data, error } = await supabase.storage
        .from('profile-photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      const imageUrl = `https://fbldpvpdmvtrfxdslfba.supabase.co/storage/v1/object/public/profile-photos/${filePath}`;

      const { error: updateError } = await supabase
        .from('users')
        .update({ profile_image: imageUrl })
        .eq('id', session.user.id);

      if (updateError) {
        throw updateError;
      }

      setProfileData({ ...profileData, profile_image: imageUrl });
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  }

  async function updateProfile() {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('users')
        .update({
          full_name: updatedFullName,
          phone: updatedPhone,
          license_expiry_date: updatedLicenseExpiryDate,
          address: updatedAddress,
        })
        .eq('id', session.user.id);

      if (error) {
        throw error;
      }

      setProfileData({
        ...profileData,
        full_name: updatedFullName,
        phone: updatedPhone,
        license_expiry_date: updatedLicenseExpiryDate,
        address: updatedAddress,
      });
      setIsEditing(false);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="profile-container">
      {loading ? (
        'Loading profile...'
      ) : profileData ? (
        <>
          <div className="profile-grid">
            <div className="profile-card profile-header-card">
              <div className="profile-header"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <div className="profile-image-container">
                  {profileData.profile_image ? (
                    <div className="image-wrapper">
                      <img
                        src={profileData.profile_image}
                        alt="Profile"
                        className="profile-image"
                        onError={(e) => {
                          console.error('Error loading image:', profileData.profile_image);
                          e.target.src = 'https://via.placeholder.com/150'; // Fallback image
                        }}
                      />
                      {isHovering && (
                        <div className="update-button-overlay">
                          <label htmlFor="single">Update</label>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <label htmlFor="single" className="upload-button">
                        {uploading ? 'Uploading ...' : 'Upload'}
                      </label>
                    </>
                  )}
                  <input
                    style={{ visibility: 'hidden', position: 'absolute' }}
                    type="file"
                    id="single"
                    accept="image/*"
                    onChange={uploadImage}
                    disabled={uploading}
                    ref={fileInput}
                  />
                </div>
                <div className="profile-info">
                  <h2 className="profile-name">{profileData.full_name || 'No Name'}</h2>
                </div>
              </div>
            </div>

            <div className="profile-card profile-details-card">
              <div className="detail-section">
                <h3>Information</h3>
                {isEditing ? (
                  <>
                    <label htmlFor="fullName">Full Name:</label>
                    <input
                      type="text"
                      id="fullName"
                      value={updatedFullName}
                      onChange={(e) => setUpdatedFullName(e.target.value)}
                    />
                    <label htmlFor="phone">Phone:</label>
                    <input
                      type="text"
                      id="phone"
                      value={updatedPhone}
                      onChange={(e) => setUpdatedPhone(e.target.value)}
                    />
                    <label htmlFor="licenseExpiryDate">License Expiry Date:</label>
                    <input
                      type="date"
                      id="licenseExpiryDate"
                      value={updatedLicenseExpiryDate}
                      onChange={(e) => setUpdatedLicenseExpiryDate(e.target.value)}
                    />
                    <label htmlFor="address">Address:</label>
                    <input
                      type="text"
                      id="address"
                      value={updatedAddress}
                      onChange={(e) => setUpdatedAddress(e.target.value)}
                    />
                    <div>
                      <button onClick={updateProfile} disabled={loading}>
                        {loading ? 'Saving...' : 'Save'}
                      </button>
                      <button onClick={() => setIsEditing(false)} disabled={loading}>
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="profile-info-item"><strong>Email:</strong> {profileData.email || 'N/A'}</p>
                    <p className="profile-info-item"><strong>Full Name:</strong> {profileData.full_name || 'N/A'}</p>
                    <p className="profile-info-item"><strong>Phone:</strong> {profileData.phone || 'N/A'}</p>
                    <p className="profile-info-item"><strong>License Expiry Date:</strong> {formatDate(profileData.license_expiry_date)}</p>
                    <p className="profile-info-item"><strong>Address:</strong> {profileData.address || 'N/A'}</p>
                    <button className="edit-button" onClick={() => setIsEditing(true)} disabled={loading}>
                      Edit
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        'No profile data found.'
      )}
    </div>
  );
}

export default MyProfile;
