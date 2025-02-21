import React, { useState, useEffect } from 'react';

    function Filter({ isOpen, onClose, onFilter, filterOptions }) {
      const [filters, setFilters] = useState({});

      useEffect(() => {
        // Initialize filters based on filterOptions
        const initialFilters = {};
        filterOptions.forEach(option => {
          initialFilters[option.value] = '';
        });
        setFilters(initialFilters);
      }, [filterOptions]);

      const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFilters({
          ...filters,
          [name]: value,
        });
      };

      const handleApplyFilters = () => {
        onFilter(filters);
        onClose();
      };

      const handleClearFilters = () => {
        const clearedFilters = {};
        filterOptions.forEach(option => {
          clearedFilters[option.value] = '';
        });
        setFilters(clearedFilters);
        onFilter({}); // Apply empty filters
        onClose();
      };

      if (!isOpen) {
        return null;
      }

      return (
        <div className="absolute top-full right-0 bg-white p-4 rounded shadow-md w-96 z-10">
          <h2 className="text-lg font-semibold mb-4">Filter Options</h2>
          {filterOptions.map((option) => (
            <div key={option.value} className="mb-2">
              <label htmlFor={option.value} className="block text-gray-700 text-sm font-bold mb-1">
                {option.label}
              </label>
              {option.type === 'select' ? (
                <select
                  id={option.value}
                  name={option.value}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={filters[option.value] || ''}
                  onChange={handleInputChange}
                >
                  <option value="">All</option>
                  {option.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : option.type === 'date' ? (
                <input
                  type="date"
                  id={option.value}
                  name={option.value}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={filters[option.value] || ''}
                  onChange={handleInputChange}
                />
              ) : (
                <input
                  type="text"
                  id={option.value}
                  name={option.value}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={filters[option.value] || ''}
                  onChange={handleInputChange}
                />
              )}
            </div>
          ))}
          <div className="flex justify-end mt-4">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
              onClick={handleApplyFilters}
            >
              Apply Filters
            </button>
            <button
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleClearFilters}
            >
              Clear Filters
            </button>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      );
    }

    export default Filter;
