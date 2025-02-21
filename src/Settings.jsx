import React, { useState } from 'react';

function Settings() {
  const [language, setLanguage] = useState('en');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handlePasswordReset = () => {
    // Implement password reset logic here
    alert('Password reset initiated');
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      <div className="mb-4">
        <label htmlFor="language" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
          Language:
        </label>
        <select
          id="language"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
          value={language}
          onChange={handleLanguageChange}
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="currentPassword" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
          Current Password:
        </label>
        <input
          type="password"
          id="currentPassword"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="mb-6">
        <label htmlFor="newPassword" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
          New Password:
        </label>
        <input
          type="password"
          id="newPassword"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>

      <div className="flex items-center justify-between">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={handlePasswordReset}
        >
          Reset Password
        </button>
      </div>
    </div>
  );
}

export default Settings;
