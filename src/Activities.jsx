import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newActivity, setNewActivity] = useState({
    plate_number: '',
    activity_type: '',
    comments: '',
    activity_user: '',
  });
  const [users, setUsers] = useState([]);
  const [activityTypes, setActivityTypes] = useState([]);

  useEffect(() => {
    fetchActivities();
    fetchUsers();
    fetchActivityTypes();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('activities')
        .select('*');

      if (error) {
        console.error('Error fetching activities:', error);
        alert('Failed to load activities.');
      } else {
        setActivities(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('email');

      if (error) {
        console.error('Error fetching users:', error);
        alert('Failed to load users.');
      } else {
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Failed to load users.');
    }
  };

  const fetchActivityTypes = async () => {
    try {
      const { data, error } = await supabase
      .from('activity_type')
      .select('*');

      if (error) {
        console.error('Error fetching activity types:', error);
        alert('Failed to load activity types.');
      } else {
        setActivityTypes(data);
      }
    } catch (error) {
      console.error('Error fetching activity types:', error);
      alert('Failed to load activity types.');
    }
  };

  const handleInputChange = (e) => {
    setNewActivity({ ...newActivity, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('activities')
        .insert([newActivity]);

      if (error) {
        console.error('Error adding activity:', error);
        alert('Failed to add activity.');
      } else {
        setActivities([...activities, data[0]]);
        setNewActivity({
          plate_number: '',
          activity_type: '',
          comments: '',
          activity_user: '',
        });
        setShowForm(false);
        fetchActivities();
      }
    } catch (error) {
      console.error('Error adding activity:', error);
      alert('Failed to add activity.');
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="container mx-auto mt-8">
      <button
        onClick={toggleForm}
        className="mb-4"
      >
        <img
          src="https://fbldpvpdmvtrfxdslfba.supabase.co/storage/v1/object/public/assets//plus.png"
          alt="Add Activity"
          className="w-6 h-6"
        />
      </button>

      {showForm && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-8 rounded shadow-md w-96">
            <h2 className="text-xl font-bold mb-4">Add New Activity</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="plate_number" className="block text-gray-700 text-sm font-bold mb-2">
                  Plate Number:
                </label>
                <input
                  type="text"
                  id="plate_number"
                  name="plate_number"
                  value={newActivity.plate_number}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="activity_type" className="block text-gray-700 text-sm font-bold mb-2">
                  Activity Type:
                </label>
                <select
                  id="activity_type"
                  name="activity_type"
                  value={newActivity.activity_type}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  <option value="">Select Activity Type</option>
                  {activityTypes.map((type) => (
                    <option key={type.id} value={type.name}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="comments" className="block text-gray-700 text-sm font-bold mb-2">
                  Comments:
                </label>
                <textarea
                  id="comments"
                  name="comments"
                  value={newActivity.comments}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="activity_user" className="block text-gray-700 text-sm font-bold mb-2">
                  Activity User:
                </label>
                <select
                  id="activity_user"
                  name="activity_user"
                  value={newActivity.activity_user}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  <option value="">Select User</option>
                  {users.map((user) => (
                    <option key={user.email} value={user.email}>
                      {user.email}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded ml-2 focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <p>Loading activities...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Created At</th>
                <th className="px-4 py-2 text-left">Plate Number</th>
                <th className="px-4 py-2 text-left">Activity Type</th>
                <th className="px-4 py-2 text-left">Comments</th>
                <th className="px-4 py-2 text-left">Activity User</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{activity.id}</td>
                  <td className="border px-4 py-2">{activity.created_at}</td>
                  <td className="border px-4 py-2">{activity.plate_number}</td>
                  <td className="border px-4 py-2">{activity.activity_type}</td>
                  <td className="border px-4 py-2">{activity.comments}</td>
                  <td className="border px-4 py-2">{activity.activity_user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Activities;
