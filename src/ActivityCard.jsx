import React, { useState, useEffect } from 'react';
    import { supabase } from './supabaseClient';

    function ActivityCard({ activity, closeModal, onActivityUpdate, initialEditMode = false }) {
      const [isEditMode, setIsEditMode] = useState(false);
      const [activityType, setActivityType] = useState(activity.activity_type);
      const [comments, setComments] = useState(activity.comments);
      const [activityUser, setActivityUser] = useState(activity.activity_user);
      const [plateNumber, setPlateNumber] = useState(activity.plate_number);
      const [status, setStatus] = useState(activity.Status);
      const [activityDate, setActivityDate] = useState(activity.activity_date);
      const [loading, setLoading] = useState(false);
      const [uploading, setUploading] = useState(false);
      const [selectedFile, setSelectedFile] = useState(null);
      const activityTypes = [
        'incident',
        'meeting',
        'flat_tire',
        'oil_change',
        'no_start',
        'towing',
        'crash',
      ];

      useEffect(() => {
        setIsEditMode(initialEditMode);
      }, [initialEditMode]);

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

      const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
      };

      const handleUploadClick = async () => {
        setUploading(true);
        try {
          if (!selectedFile) {
            alert('Please select a file to upload.');
            return;
          }

          const fileExt = selectedFile.name.split('.').pop();
          const filePath = `activities/${activity.id}/${Math.random()}.${fileExt}`;

          const { data, error } = await supabase.storage
            .from('activity-files')
            .upload(filePath, selectedFile, {
              cacheControl: '3600',
              upsert: false
            });

          if (error) {
            throw error;
          }

          const fileUrl = `https://fbldpvpdmvtrfxdslfba.supabase.co/storage/v1/object/public/activity-files/${filePath}`;

          const { data: updateData, error: updateError } = await supabase
            .from('activities')
            .update({ activity_files: fileUrl })
            .eq('id', activity.id);

          if (updateError) {
            throw updateError;
          }

          console.log("Activity updated successfully:", updateData);
          alert('File uploaded and activity updated successfully!');
          setIsEditMode(false);
          closeModal();
          onActivityUpdate(); // Refresh activities
        } catch (error) {
          alert(error.message);
        } finally {
          setUploading(false);
        }
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
                <div className="mb-4">
                  <label htmlFor="fileUpload" className="block text-gray-700 text-sm font-bold mb-2">Activity File:</label>
                  <input type="file" id="fileUpload" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" onChange={handleFileChange} />
                  {selectedFile && (
                    <button
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
                      onClick={handleUploadClick}
                      disabled={uploading}
                    >
                      {uploading ? 'Uploading...' : 'Upload File'}
                    </button>
                  )}
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
                <p><strong>Activity Files:</strong> {activity.activity_files ? <a href={activity.activity_files} target="_blank" rel="noopener noreferrer">View File</a> : 'No file uploaded'}</p>
                <button onClick={handleEditClick} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4 mr-2">Edit</button>
                <button onClick={closeModal} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4">Close</button>
              </>
            )}
          </div>
        </div>
      );
    }

    export default ActivityCard;
