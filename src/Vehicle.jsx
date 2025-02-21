import React, { useState, useEffect, useCallback, useRef } from 'react';
    import { supabase } from './supabaseClient';
    import Filter from './Filter'; // Import the Filter component

    function Vehicle() {
      const [loading, setLoading] = useState(true);
      const [vehicles, setVehicles] = useState([]);
      const [isFilterOpen, setIsFilterOpen] = useState(false);
      const [filters, setFilters] = useState({});
      const filterRef = useRef(null);

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
            .from('Vehicules')
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

      const toggleFilter = () => {
        setIsFilterOpen(!isFilterOpen);
      };

      const handleFilter = (newFilters) => {
        setFilters(newFilters);
      };

      return (
        <div className="container mx-auto mt-8">
          <h1 className="text-2xl font-bold mb-4">Vehicle Information</h1>

          <div className="flex justify-end mb-4 relative" ref={filterRef}>
            <button onClick={toggleFilter}>
              <img
                src="https://fbldpvpdmvtrfxdslfba.supabase.co/storage/v1/object/public/assets//filter-icon.png"
                alt="Filter"
                className="h-8 w-8"
              />
            </button>
            <div className="absolute right-0 mt-2 z-10" style={{ width: '400px' }}>
              <Filter
                isOpen={isFilterOpen}
                onClose={toggleFilter}
                onFilter={handleFilter}
                filterOptions={filterOptions}
              />
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
