import React, { useState, useEffect } from 'react';
    import { supabase } from './supabaseClient';

    function ActivityAdd({ closeModal, session, onActivityAdd }) {
      const [activityType, setActivityType] = useState('incident'); // Default value
      const [comments, setComments] = useState('');
      const [activityUser, setActivityUser] = useState('');
      const [plateNumber, setPlateNumber] = useState('');
      const [status, setStatus] = useState('Open'); // Default status
      const [activityDate, setActivityDate] = useState('');
      const [loading, setLoading] = useState(false);

      useEffect(() => {
        // Autofill with current user's email
        if (session?.user?.email) {
          setActivityUser(session.user.email);
        }
      }, [session]);

      const activityTypes = [
        'incident',
        'meeting',
        'flat_tire',
        'oil_change',
        'no_start',
        'towing',
        'crash',
      ];

      async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);

        try {
          let newStatus = status;
          const today = new Date();
          const activityDateObj = new Date(activityDate);

          if (activityDateObj > today) {
            newStatus = 'Open';
          }

          const { error } = await supabase
            .from('activities')
            .insert({
              activity_type: activityType,
              comments: comments,
              activity_user: activityUser,
              plate_number: plateNumber,
              Status: newStatus,
              activity_date: activityDate,
            });

          if (error) {
            throw error;
          }

          alert('Activity added successfully!');
          closeModal(); // Close the modal after successful submission
          onActivityAdd(); // Refresh activities
        } catch (error) {
          alert(error.message);
        } finally {
          setLoading(false);
        }
      }

      return (
        <div className="container mx-auto mt-8">
          <h1 className="text-2xl font-bold mb-4">Add Activity</h1>
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="mb-4">
              <label htmlFor="activityType" className="block text-gray-700 text-sm font-bold mb-2">Activity Type:</label>
              <select id="activityType" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={activityType} onChange={(e) => setActivityType(e.target.value)}>
                {activityTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="comments" className="block text-gray-700 text-sm font-bold mb-2">Comments:</label>
              <textarea id="comments" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={comments} onChange={(e) => setComments(e.target.value)} />
            </div>
            <div className="mb-4">
              <label htmlFor="activityUser" className="block text-gray-700 text-sm font-bold mb-2">Assigned User:</label>
              <input type="text" id="activityUser" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={activityUser} onChange={(e) => setActivityUser(e.target.value)} />
            </div>
            <div className="mb-4">
              <label htmlFor="plateNumber" className="block text-gray-700 text-sm font-bold mb-2">Plate Number:</label>
              <input type="text" id="plateNumber" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={plateNumber} onChange={(e) => setPlateNumber(e.target.value)} />
            </div>
             <div className="mb-4">
              <label htmlFor="activityDate" className="block text-gray-700 text-sm font-bold mb-2">Activity Date:</label>
              <input type="date" id="activityDate" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={activityDate} onChange={(e) => setActivityDate(e.target.value)} />
            </div>
            <div className="mb-4">
              <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">Status:</label>
              <select id="status" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add Activity'}
              </button>
            </div>
          </form>
        </div>
      );
    }

    export default ActivityAdd;
