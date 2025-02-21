import React, { useState, useEffect, useCallback, useRef } from 'react';
    import { supabase } from './supabaseClient';
    import Filter from './Filter'; // Import the Filter component
    import { Link, useNavigate } from 'react-router-dom';

    function Vehicle() {
      const [loading, setLoading] = useState(true);
      const [vehicles, setVehicles] = useState([]);
      const [isFilterOpen, setIsFilterOpen] = useState(false);
      const [filters, setFilters] = useState({});
      const [isListView, setIsListView] = useState(false); // State to track view mode
      const filterRef = useRef(null);
      const navigate = useNavigate();

      const filterOptions = [
        { label: 'Make', value: 'make' },
        { label: 'Model', value: 'model' },
        { label: 'Year', value: 'year' },
        { label: 'Color', value: 'color' },
        { label: 'Plate Number', value: 'plate_number' },
      ];

      const fetchVehicles = useCallback(async () => {
        try {
          setLoading(true);
          let query = supabase
            .from('Vehicles')
            .select('*');

          // Apply filters to the query
          Object.keys(filters).forEach(key => {
            if (filters[key]) {
              query = query.eq(key, filters[key]);
            }
          });

          const { data, error } = await query;

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
      }, [filters]);

      useEffect(() => {
        getVehicles();
      }, [fetchVehicles]);

      async function getVehicles() {
        try {
          setLoading(true);
          const { data, error } = await supabase
            .from('Vehicles')
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

      const toggleFilter = () => {
        setIsFilterOpen(!isFilterOpen);
      };

      const handleFilter = (newFilters) => {
        setFilters(newFilters);
      };

      const toggleView = () => {
        setIsListView(!isListView);
      };

      const goToVehicle = (id) => {
        navigate(`/vehicle/${id}`);
      };

      return (
        <div className="container mx-auto mt-8">
          <h1 className="text-2xl font-bold mb-4">Vehicle Information</h1>

          <div className="flex justify-between items-center mb-4">
            <div>
              <button onClick={toggleView}>
                <img
                  src="https://fbldpvpdmvtrfxdslfba.supabase.co/storage/v1/object/public/assets//view-switch-icon.png"
                  alt="Switch View"
                  className="h-8 w-8"
                />
              </button>
            </div>
            <div className="flex justify-end">
              <button onClick={toggleFilter}>
                <img
                  src="https://fbldpvpdmvtrfxdslfba.supabase.co/storage/v1/object/public/assets//filter-icon.png"
                  alt="Filter"
                  className="h-8 w-8"
                />
              </button>
            </div>
          </div>

          <Filter
            isOpen={isFilterOpen}
            onClose={toggleFilter}
            onFilter={handleFilter}
            filterOptions={filterOptions}
          />

          {loading ? (
            <p>Loading vehicles...</p>
          ) : (
            <>
              {!isListView ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {vehicles.map((vehicle) => (
                    <div key={vehicle.id} className="bg-white shadow-md rounded-md p-4 cursor-pointer" onClick={() => goToVehicle(vehicle.id)}>
                      <h2 className="text-lg font-semibold">{vehicle.make} {vehicle.model}</h2>
                      <p><strong>Year:</strong> {vehicle.year}</p>
                      <p><strong>Color:</strong> {vehicle.color}</p>
                      <p><strong>Plate Number:</strong> {vehicle.plate_number}</p>
                      <p><strong>Mileage:</strong> {vehicle.mileage}</p>
                      <p><strong>Last Service:</strong> {formatDate(vehicle.last_service)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table-auto w-full">
                    <thead>
                      <tr className="bg-gray-200 dark:bg-gray-700">
                        <th className="px-4 py-2 text-center">Make</th>
                        <th className="px-4 py-2 text-center">Model</th>
                        <th className="px-4 py-2 text-center">Year</th>
                        <th className="px-4 py-2 text-center">Color</th>
                        <th className="px-4 py-2 text-center">Plate Number</th>
                        <th className="px-4 py-2 text-center">Mileage</th>
                        <th className="px-4 py-2 text-center">Last Service</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vehicles.map((vehicle) => (
                        <tr key={vehicle.id} className="bg-white dark:bg-gray-800 cursor-pointer" onClick={() => goToVehicle(vehicle.id)}>
                          <td className="px-4 py-2 text-center">{vehicle.make}</td>
                          <td className="px-4 py-2 text-center">{vehicle.model}</td>
                          <td className="px-4 py-2 text-center">{vehicle.year}</td>
                          <td className="px-4 py-2 text-center">{vehicle.color}</td>
                          <td className="px-4 py-2 text-center">{vehicle.plate_number}</td>
                          <td className="px-4 py-2 text-center">{vehicle.mileage}</td>
                          <td className="px-4 py-2 text-center">{formatDate(vehicle.last_service)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      );
    }

    export default Vehicle;
