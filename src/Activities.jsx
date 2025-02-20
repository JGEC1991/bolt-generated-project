import React, { useState, useEffect } from 'react';
    import { supabase } from './supabaseClient';

    function Activities() {
      const [activities, setActivities] = useState([]);
      const [loading, setLoading] = useState(true);
      const [users, setUsers] = useState([]);
      const [showForm, setShowForm] = useState(false);
      const [newActivity, setNewActivity] = useState({
        plate_number: '',
        activity_type: '',
        comments: '',
        activity_user: '',
        activity_files: '',
      });
      const [filters, setFilters] = useState({
        plate_number: '',
        activity_type: '',
        activity_user: '',
        created_at_from: '',
        created_at_to: '',
      });
      const [selectedFile, setSelectedFile] = useState(null);

      useEffect(() => {
        fetchActivities();
        fetchUsers();
      }, [filters]);

      const fetchActivities = async () => {
        try {
          setLoading(true);
          let query = supabase
            .from('activities')
            .select('*')
            .order('created_at', { ascending: false });

          if (filters.plate_number) {
            query = query.ilike('plate_number', `%${filters.plate_number}%`);
          }
          if (filters.activity_type) {
            query = query.eq('activity_type', filters.activity_type);
          }
          if (filters.activity_user) {
            query = query.eq('activity_user', filters.activity_user);
          }
          if (filters.created_at_from) {
            query = query.gte('created_at', filters.created_at_from + 'T00:00:00.000Z');
          }
          if (filters.created_at_to) {
            query = query.lte('created_at', filters.created_at_to + 'T23:59:59.999Z');
          }

          const { data, error } = await query;

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

      const handleInputChange = (e) => {
        setNewActivity({ ...newActivity, [e.target.name]: e.target.value });
      };

      const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
      };

      const uploadFile = async () => {
        if (!selectedFile) {
          alert('Please select a file to upload.');
          return null;
        }

        try {
          setLoading(true);
          const fileExt = selectedFile.name.split('.').pop();
          const fileName = `${Date.now()}.${fileExt}`;
          const filePath = `${fileName}`;

          const { data, error } = await supabase.storage
            .from('activity-files')
            .upload(filePath, selectedFile, {
              cacheControl: '3600',
              upsert: false,
            });

          if (error) {
            console.error('Error uploading file:', error);
            alert('Failed to upload file.');
            return null;
          }

          const fileUrl = `${supabase.supabaseUrl}/storage/v1/object/public/activity-files/${filePath}`;
          return fileUrl;
        } catch (error) {
          console.error('Error uploading file:', error);
          alert('Error uploading file.');
          return null;
        } finally {
          setLoading(false);
        }
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        let fileUrl = null;
        if (selectedFile) {
          fileUrl = await uploadFile();
          if (!fileUrl) {
            return; // Stop submission if file upload fails
          }
        }

        try {
          setLoading(true);
          const { data, error } = await supabase
            .from('activities')
            .insert([{ ...newActivity, activity_files: fileUrl || null }])
            .select();

          if (error) {
            console.error('Error adding activity:', error);
            alert('Failed to add activity.');
          } else {
            setActivities([data[0], ...activities]);
            setNewActivity({
              plate_number: '',
              activity_type: '',
              comments: '',
              activity_user: '',
              activity_files: '',
            });
            setSelectedFile(null);
            setShowForm(false);
          }
        } catch (error) {
          console.error('Error adding activity:', error);
          alert('Failed to add activity.');
        } finally {
          setLoading(false);
        }
      };

      const toggleForm = () => {
        setShowForm(!showForm);
      };

      const activityTypes = [
        'incident',
        'meeting',
        'flat_tire',
        'oil_change',
        'no_start',
        'towing',
        'crash',
      ];

      const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
      };

      const handleFilterSubmit = async (e) => {
        e.preventDefault();
        await fetchActivities();
      };

      const handleClearFilters = () => {
        setFilters({
          plate_number: '',
          activity_type: '',
          activity_user: '',
          created_at_from: '',
          created_at_to: '',
        });
        fetchActivities();
      };

      const renderFilterTags = () => {
        const handleRemoveTag = (key) => {
          const newFilters = { ...filters };
          newFilters[key] = '';
          setFilters(newFilters);
        };

        const tags = [];
        for (const key in filters) {
          if (filters[key]) {
            let label = '';
            switch (key) {
              case 'plate_number':
                label = 'Plate Number: ';
                break;
              case 'activity_type':
                label = 'Activity Type: ';
                break;
              case 'activity_user':
                label = 'Activity User: ';
                break;
              case 'created_at_from':
                label = 'Created From: ';
                break;
              case 'created_at_to':
                label = 'Created To: ';
                break;
              default:
                label = '';
            }
            tags.push(
              <span
                key={key}
                className="inline-flex items-center bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
              >
                {label}
                {filters[key]}
                <button
                  onClick={() => handleRemoveTag(key)}
                  className="ml-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </span>
            );
          }
        }
        return tags;
      };

      const handleDeleteActivity = async (id) => {
        try {
          setLoading(true);
          const { data, error } = await supabase
            .from('activities')
            .delete()
            .eq('id', id);

          if (error) {
            console.error('Error deleting activity:', error);
            alert('Failed to delete activity.');
          } else {
            setActivities(activities.filter((activity) => activity.id !== id));
          }
        } catch (error) {
          console.error('Error deleting activity:', error);
          alert('Error deleting activity.');
        } finally {
          setLoading(false);
        }
      };

      const handleArchiveActivity = async (id) => {
        try {
          setLoading(true);
          // Implement your archive logic here (e.g., update a column 'is_archived' to true)
          const { data, error } = await supabase
            .from('activities')
            .update({ is_archived: true })
            .eq('id', id)
            .select();

          if (error) {
            console.error('Error archiving activity:', error);
            alert('Failed to archive activity.');
          } else {
            setActivities(activities.map((activity) => (activity.id === id ? { ...activity, is_archived: true } : activity)));
          }
        } catch (error) {
          console.error('Error archiving activity:', error);
          alert('Error archiving activity.');
        } finally {
          setLoading(false);
        }
      };

      return (
        <div className="container mx-auto mt-8">
          {/* Render filter tags */}
          <div className="mb-4">{renderFilterTags()}</div>

          <div className="flex items-center mb-4">
            <form onSubmit={handleFilterSubmit} className="flex items-center">
              <input
                type="text"
                name="plate_number"
                placeholder="Plate Number"
                value={filters.plate_number}
                onChange={handleFilterChange}
                className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
              />
              <select
                name="activity_type"
                value={filters.activity_type}
                onChange={handleFilterChange}
                className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
              >
                <option value="">Activity Type</option>
                {activityTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="activity_user"
                placeholder="Activity User"
                value={filters.activity_user}
                onChange={handleFilterChange}
                className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
              />
              <input
                type="date"
                name="created_at_from"
                placeholder="Created From"
                value={filters.created_at_from}
                onChange={handleFilterChange}
                className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
              />
              <input
                type="date"
                name="created_at_to"
                placeholder="Created To"
                value={filters.created_at_to}
                onChange={handleFilterChange}
                className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Filter
              </button>
              <button
                type="button"
                onClick={handleClearFilters}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
              >
                Clear
              </button>
            </form>
            <button
              onClick={toggleForm}
              className="flex items-center ml-2"
            >
              <img
                src="https://fbldpvpdmvtrfxdslfba.supabase.co/storage/v1/object/public/assets//plus.png"
                alt="Add Activity"
                className="w-12 h-12"
              />
            </button>
          </div>

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
                        <option key={type} value={type}>
                          {type}
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
                   {/* File Upload Input */}
                  <div className="mb-4">
                    <label htmlFor="activity_files" className="block text-gray-700 text-sm font-bold mb-2">
                      Activity Files:
                    </label>
                    <input
                      type="file"
                      id="activity_files"
                      name="activity_files"
                      onChange={handleFileChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    {selectedFile && (
                      <p className="text-gray-600 text-sm mt-1">Selected file: {selectedFile.name}</p>
                    )}
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
                <thead className="bg-gray-100 text-black">
                  <tr>
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Created At</th>
                    <th className="px-4 py-2 text-left">Plate Number</th>
                    <th className="px-4 py-2 text-left">Activity Type</th>
                    <th className="px-4 py-2 text-left">Comments</th>
                    <th className="px-4 py-2 text-left">Activity User</th>
                    {/* Add column for activity_files */}
                    <th className="px-4 py-2 text-left">Files</th>
                     <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {activities.map((activity) => (
                    <tr key={activity.id} className="hover:bg-gray-50">
                      <td className="border px-4 py-2">{activity.id}</td>
                      <td className="border px-4 py-2">{activity.created_at}</td>
                      <td className="border px-4 py-2">{activity.plate_number}</td>
                      <td className="border px-4 py-2">{activity.activity_type}</td>
                      <td className="border px-4 py-2">{activity.comments}</td>
                      <td className="border px-4 py-2">{activity.activity_user}</td>
                      {/* Display activity_files link */}
                      <td className="border px-4 py-2">
                        {activity.activity_files && (
                          <a
                            href={activity.activity_files}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-700"
                          >
                            View File
                          </a>
                        )}
                      </td>
                      <td className="border px-4 py-2">
                         <button
                            onClick={() => toggleForm(activity)}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline text-xs mr-1"
                          >
                            Edit
                          </button>
                        <button
                          onClick={() => handleDeleteActivity(activity.id)}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline text-xs mr-1"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => handleArchiveActivity(activity.id)}
                          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline text-xs"
                          >
                            Archive
                          </button>
                      </td>
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
