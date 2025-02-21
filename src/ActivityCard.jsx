import React, { useState } from 'react';
    import { supabase } from './supabaseClient';

    function ActivityCard({ activity, closeModal, onActivityUpdate }) {
      const [isEditMode, setIsEditMode] = useState(false);
      const [activityType, setActivityType] = useState(activity.activity_type);
      const [comments, setComments] = useState(activity.comments);
      const [activityUser, setActivityUser] = useState(activity.activity_user);
      const [plateNumber, setPlateNumber] = useState(activity.plate_number);
      const [status, setStatus] = useState(activity.Status);
      const [activityDate, setActivityDate] = useState(activity.activity_date);
      const [loading, setLoading] = useState(false);

      const handleEditClick = () => {
        setIsEditMode(true);
      };

      const handleCancelClick = () => {
        setIsEditMode(false);
        setActivityType(activity.activity_type);
        setComments(activity.comments);
        setActivityUser(activity.activity_user);
        setPlateNumber(activity.plate_number);
        setStatus(activity.Status);
        setActivityDate(activity.activity_date);
      };

      const handleSaveClick = async () => {
        setLoading(true);
        try {
          const { data, error } = await supabase
            .from('activities')
            .update({
              activity_type: activityType,
              comments: comments,
              activity_user: activityUser,
              plate_number: plateNumber,
              Status: status,
              activity_date: activityDate,
            })
            .eq('id', activity.id);

          if (error) {
            console.error("Error updating activity:", error);
            alert('Error updating activity!');
            throw error;
          }

          console.log("Activity updated successfully:", data);
          alert('Activity updated successfully!');
          setIsEditMode(false);
          closeModal();
          onActivityUpdate(); // Refresh activities
        } catch (error) {
          alert(error.message);
        } finally {
          setLoading(false);
        }
      };

      return (
        <div className="container mx-auto mt-8">
          <div className="bg-white shadow-md rounded-md p-4">
            {isEditMode ? (
              <>
                <div className="mb-4">
                  <label htmlFor="activityType" className="block text-gray-700 text-sm font-bold mb-2">Activity Type:</label>
                  <input type="text" id="activityType" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={activityType} onChange={(e) => setActivityType(e.target.value)} />
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
                <button onClick={handleSaveClick} disabled={loading} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2">
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button onClick={handleCancelClick} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Cancel</button>
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold">{activity.activity_type}</h2>
                <p><strong>Comments:</strong> {activity.comments}</p>
                <p><strong>Assigned User:</strong> {activity.activity_user}</p>
                <p><strong>Plate Number:</strong> {activity.plate_number}</p>
                 <p><strong>Activity Date:</strong> {activity.activity_date}</p>
                <p><strong>Status:</strong> {activity.Status}</p>
                <button onClick={handleEditClick} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4 mr-2">Edit</button>
                <button onClick={closeModal} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4">Close</button>
              </>
            )}
          </div>
        </div>
      );
    }

    export default ActivityCard;
