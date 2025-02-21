import React, { useState, useEffect } from 'react';
    import { supabase } from './supabaseClient';

    function Vehicle() {
      const [loading, setLoading] = useState(true);
      const [vehicles, setVehicles] = useState([]);

      useEffect(() => {
        getVehicles();
      }, []);

      async function getVehicles() {
        try {
          setLoading(true);
          const { data, error } = await supabase
            .from('Vehicules')
            .select('*');

          if (error) {
            throw error;
          }

          if (data) {
            setVehicles(data);
          }
        } catch (error) {
          alert(error.message);
        } finally {
          setLoading(false);
        }
      }

      const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        });
      };

      return (
        <div className="container mx-auto mt-8">
          <h1 className="text-2xl font-bold mb-4">Vehicle Information</h1>
          {loading ? (
            <p>Loading vehicles...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vehicles.map((vehicle) => (
                <div key={vehicle.id} className="bg-white shadow-md rounded-md p-4">
                  <h2 className="text-lg font-semibold">{vehicle.make} {vehicle.model}</h2>
                  <p><strong>Year:</strong> {vehicle.year}</p>
                  <p><strong>Color:</strong> {vehicle.color}</p>
                  <p><strong>Plate Number:</strong> {vehicle.plate_number}</p>
                  <p><strong>Mileage:</strong> {vehicle.mileage}</p>
                  <p><strong>Last Service:</strong> {formatDate(vehicle.last_service)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    export default Vehicle;
