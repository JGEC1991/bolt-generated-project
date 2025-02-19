import React, { useState } from 'react';

function MyProfile() {
  const [profileImage, setProfileImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.size <= 20 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Image size should be less than 20MB.');
    }
  };

  return (
    <div className="profile-container">
      <h1>My Profile</h1>
      <div className="profile-picture-container">
        <div className="profile-picture-frame">
          {profileImage ? (
            <img src={profileImage} alt="Profile" className="profile-picture" />
          ) : (
            <div className="profile-picture-placeholder">Upload Photo</div>
          )}
        </div>
        <input type="file" accept="image/*" onChange={handleImageChange} className="profile-image-input" />
      </div>
      <p>This is the My Profile page.</p>
    </div>
  );
}

export default MyProfile;
