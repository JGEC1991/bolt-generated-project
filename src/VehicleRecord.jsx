import React, { useState, useEffect, useRef } from 'react';
    import { useParams } from 'react-router-dom';
    import { supabase } from './supabaseClient';

    function VehicleRecord() {
      const { id } = useParams();
      const [vehicle, setVehicle] = useState(null);
      const [loading, setLoading] = useState(true);
      const [uploading, setUploading] = useState(false);
      const fileInputFront = useRef(null);
      const fileInputLeft = useRef(null);
      const fileInputRight = useRef(null);
      const fileInputBack = useRef(null);
      const fileInputDashboard = useRef(null);

      useEffect(() => {
        const fetchVehicle = async () => {
          try {
            setLoading(true);
            const { data, error } = await supabase
              .from('Vehicles')
              .select('*')
              .eq('id', id)
              .single();

            if (error) {
              throw error;
            }

            if (data) {
              setVehicle(data);
            }
          } catch (error) {
            alert(error.message);
          } finally {
            setLoading(false);
          }
        };

        fetchVehicle();
      }, [id]);

      const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        });
      };

      async function uploadImage(event, bucketName, imageUrlField) {
        const file = event.target.files[0];
        const fileExt = file.name.split('.').pop();
        const filePath = `vehicles/${id}/${Math.random()}.${fileExt}`;

        setUploading(true);

        try {
          const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: false
            });

          if (error) {
            throw error;
          }

          const fileUrl = `https://fbldpvpdmvtrfxdslfba.supabase.co/storage/v1/object/public/${bucketName}/${filePath}`;

          const { error: updateError } = await supabase
            .from('Vehicles')
            .update({ [imageUrlField]: fileUrl })
            .eq('id', id);

          if (updateError) {
            throw updateError;
          }

          setVehicle({ ...vehicle, [imageUrlField]: fileUrl });
        } catch (error) {
          alert(error.message);
        } finally {
          setUploading(false);
        }
      }

      const handleFrontPhotoUpload = async (event) => {
        await uploadImage(event, 'vehicle-front-photo', 'front-photo');
      };

      const handleLeftPhotoUpload = async (event) => {
        await uploadImage(event, 'vehicle-left-photo', 'left-photo');
      };

      const handleRightPhotoUpload = async (event) => {
        await uploadImage(event, 'vehicle-right-photo', 'right-photo');
      };

      const handleBackPhotoUpload = async (event) => {
        await uploadImage(event, 'vehicle-back-photo', 'back-photo');
      };

      const handleDashboardPhotoUpload = async (event) => {
        await uploadImage(event, 'vehicle-dashboard-photo', 'dashboard-photo');
      };

      if (loading) {
        return <p>Loading vehicle information...</p>;
      }

      if (!vehicle) {
        return <p>Vehicle not found.</p>;
      }

      return (
        <div className="container mx-auto mt-8">
          <h1 className="text-2xl font-bold mb-4">{vehicle.make} {vehicle.model}</h1>
          <p><strong>Year:</strong> {vehicle.year}</p>
          <p><strong>Color:</strong> {vehicle.color}</p>
          <p><strong>Plate Number:</strong> {vehicle.plate_number}</p>
          <p><strong>Mileage:</strong> {vehicle.mileage}</p>
          <p><strong>Last Service:</strong> {formatDate(vehicle.last_service)}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="front-photo">Front Photo</label>
              <input
                style={{ visibility: 'hidden', position: 'absolute' }}
                type="file"
                id="front-photo"
                accept="image/*"
                onChange={handleFrontPhotoUpload}
                disabled={uploading}
                ref={fileInputFront}
              />
              <button
                style={{
                  backgroundColor: '#007bff',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px',
                }}
                onClick={() => fileInputFront.current.click()}
                disabled={uploading}
              >
                {uploading ? 'Uploading ...' : 'Upload'}
              </button>
              {vehicle["front-photo"] && <img src={vehicle["front-photo"]} alt="Front" className="mb-2" style={{ maxWidth: '200px' }} />}
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="left-photo">Left Photo</label>
              <input
                style={{ visibility: 'hidden', position: 'absolute' }}
                type="file"
                id="left-photo"
                accept="image/*"
                onChange={handleLeftPhotoUpload}
                disabled={uploading}
                ref={fileInputLeft}
              />
              <button
                style={{
                  backgroundColor: '#007bff',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px',
                }}
                onClick={() => fileInputLeft.current.click()}
                disabled={uploading}
              >
                {uploading ? 'Uploading ...' : 'Upload'}
              </button>
              {vehicle["left-photo"] && <img src={vehicle["left-photo"]} alt="Left" className="mb-2" style={{ maxWidth: '200px' }} />}
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="right-photo">Right Photo</label>
              <input
                style={{ visibility: 'hidden', position: 'absolute' }}
                type="file"
                id="right-photo"
                accept="image/*"
                onChange={handleRightPhotoUpload}
                disabled={uploading}
                ref={fileInputRight}
              />
              <button
                style={{
                  backgroundColor: '#007bff',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px',
                }}
                onClick={() => fileInputRight.current.click()}
                disabled={uploading}
              >
                {uploading ? 'Uploading ...' : 'Upload'}
              </button>
              {vehicle["right-photo"] && <img src={vehicle["right-photo"]} alt="Right" className="mb-2" style={{ maxWidth: '200px' }} />}
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="back-photo">Back Photo</label>
              <input
                style={{ visibility: 'hidden', position: 'absolute' }}
                type="file"
                id="back-photo"
                accept="image/*"
                onChange={handleBackPhotoUpload}
                disabled={uploading}
                ref={fileInputBack}
              />
              <button
                style={{
                  backgroundColor: '#007bff',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px',
                }}
                onClick={() => fileInputBack.current.click()}
                disabled={uploading}
              >
                {uploading ? 'Uploading ...' : 'Upload'}
              </button>
              {vehicle["back-photo"] && <img src={vehicle["back-photo"]} alt="Back" className="mb-2" style={{ maxWidth: '200px' }} />}
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dashboard-photo">Dashboard Photo</label>
              <input
                style={{ visibility: 'hidden', position: 'absolute' }}
                type="file"
                id="dashboard-photo"
                accept="image/*"
                onChange={handleDashboardPhotoUpload}
                disabled={uploading}
                ref={fileInputDashboard}
              />
              <button
                style={{
                  backgroundColor: '#007bff',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px',
                }}
                onClick={() => fileInputDashboard.current.click()}
                disabled={uploading}
              >
                {uploading ? 'Uploading ...' : 'Upload'}
              </button>
              {vehicle["dashboard-photo"] && <img src={vehicle["dashboard-photo"]} alt="Dashboard" className="mb-2" style={{ maxWidth: '200px' }} />}
            </div>
          </div>
        </div>
      );
    }

    export default VehicleRecord;
