import React, { useState } from 'react';
import { supabase } from './supabaseClient';

function Settings() {
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [language, setLanguage] = useState('en');
  const [customFields, setCustomFields] = useState([]);
  const [newFieldName, setNewFieldName] = useState('');

  const handlePasswordReset = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) {
        console.error('Error resetting password:', error);
        alert('Failed to reset password.');
      } else {
        alert('Password reset successfully!');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      alert('Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    alert(`Language changed to ${e.target.value}! (This is a mock implementation)`);
  };

  const handleAddField = () => {
    if (newFieldName.trim() !== '') {
      setCustomFields([...customFields, newFieldName.trim()]);
      setNewFieldName('');
    }
  };

  const handleRemoveField = (index) => {
    const newFields = [...customFields];
    newFields.splice(index, 1);
    setCustomFields(newFields);
  };

  return (
    <div className="container mx-auto mt-8">
      <div className="bg-white p-8 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4">Settings</h1>

        {/* Password Reset */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Password Reset</h2>
          <input
            type="password"
            placeholder="New Password"
            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline ml-2 text-xs"
            onClick={handlePasswordReset}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Reset Password'}
          </button>
        </div>

        {/* Language Settings */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Language Settings</h2>
          <select
            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={language}
            onChange={handleLanguageChange}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
        </div>

        {/* Custom Fields Creation */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Custom Fields Creation</h2>
          <div className="flex items-center mb-2">
            <input
              type="text"
              placeholder="New Field Name"
              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={newFieldName}
              onChange={(e) => setNewFieldName(e.target.value)}
            />
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline ml-2 text-xs"
              onClick={handleAddField}
            >
              Add Field
            </button>
          </div>
          <ul>
            {customFields.map((field, index) => (
              <li key={index} className="flex items-center justify-between py-2 border-b border-gray-200">
                <span>{field}</span>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline text-xs"
                  onClick={() => handleRemoveField(index)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Settings;
