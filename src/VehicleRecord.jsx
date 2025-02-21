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

      async function uploadImage(bucketName, file, setImageUrlState, fileInputRef, imageUrlField) {
        setUploading(true);
        try {
          if (!file) {
            alert('Please select a file to upload.');
            return;
          }

          const fileExt = file.name.split('.').pop();
          const filePath = `vehicles/${id}/${Math.random()}.${fileExt}`;

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

          const { data: updateData, error: updateError } = await supabase
            .from('Vehicles')
            .update({ [imageUrlField]: fileUrl })
            .eq('id', id);

          if (updateError) {
            throw updateError;
          }

          setImageUrlState(fileUrl);
          alert('File uploaded and vehicle updated successfully!');
        } catch (error) {
          alert(error.message);
        } finally {
          setUploading(false);
          fileInputRef.current.value = null;
        }
      }

      const handleFrontPhotoUpload = async (event) => {
        const file = event.target.files[0];
        await uploadImage('vehicle-front-photo', file, (url) => setVehicle({ ...vehicle, "front-photo": url }), fileInputFront, 'front-photo');
      };

      const handleLeftPhotoUpload = async (event) => {
        const file = event.target.files[0];
        await uploadImage('vehicle-left-photo', file,  (url) => setVehicle({ ...vehicle, "left-photo": url }), fileInputLeft, 'left-photo');
      };

      const handleRightPhotoUpload = async (event) => {
        const file = event.target.files[0];
        await uploadImage('vehicle-right-photo', file, (url) => setVehicle({ ...vehicle, "right-photo": url }), fileInputRight, 'right-photo');
      };

      const handleBackPhotoUpload = async (event) => {
        const file = event.target.files[0];
        await uploadImage('vehicle-back-photo', file, (url) => setVehicle({ ...vehicle, "back-photo": url }), fileInputBack, 'back-photo');
      };

      const handleDashboardPhotoUpload = async (event) => {
        const file = event.target.files[0];
        await uploadImage('vehicle-dashboard-photo', file, (url) => setVehicle({ ...vehicle, "dashboard-photo": url }), fileInputDashboard, 'dashboard-photo');
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
              {vehicle && vehicle["front-photo"] && <img src={vehicle["front-photo"]} alt="Front" className="mb-2" style={{ maxWidth: '200px' }} />}
              <input type="file" id="front-photo" ref={fileInputFront} onChange={handleFrontPhotoUpload} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="left-photo">Left Photo</label>
              {vehicle && vehicle["left-photo"] && <img src={vehicle["left-photo"]} alt="Left" className="mb-2" style={{ maxWidth: '200px' }} />}
              <input type="file" id="left-photo" ref={fileInputLeft} onChange={handleLeftPhotoUpload} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="right-photo">Right Photo</label>
              {vehicle && vehicle["right-photo"] && <img src={vehicle["right-photo"]} alt="Right" className="mb-2" style={{ maxWidth: '200px' }} />}
              <input type="file" id="right-photo" ref={fileInputRight} onChange={handleRightPhotoUpload} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="back-photo">Back Photo</label>
              {vehicle && vehicle["back-photo"] && <img src={vehicle["back-photo"]} alt="Back" className="mb-2" style={{ maxWidth: '200px' }} />}
              <input type="file" id="back-photo" ref={fileInputBack} onChange={handleBackPhotoUpload} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dashboard-photo">Dashboard Photo</label>
              {vehicle && vehicle["dashboard-photo"] && <img src={vehicle["dashboard-photo"]} alt="Dashboard" className="mb-2" style={{ maxWidth: '200px' }} />}
              <input type="file" id="dashboard-photo" ref={fileInputDashboard} onChange={handleDashboardPhotoUpload} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
          </div>
        </div>
      );
    }

    export default VehicleRecord;
