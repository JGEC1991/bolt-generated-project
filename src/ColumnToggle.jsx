import React, { useState } from 'react';

    function ColumnToggle({ isOpen, onClose, onColumnToggle, columns }) {
      const [columnVisibility, setColumnVisibility] = useState(() => {
        const initialState = {};
        columns.forEach(column => {
          initialState[column.value] = true; // Initially all columns are visible
        });
        return initialState;
      });

      const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        setColumnVisibility({
          ...columnVisibility,
          [name]: checked,
        });
      };

      const handleApplyChanges = () => {
        onColumnToggle(columnVisibility);
        onClose();
      };

      if (!isOpen) {
        return null;
      }

      return (
        <div className="absolute top-full right-0 bg-white p-4 rounded shadow-md w-96 z-10">
          <h2 className="text-lg font-semibold mb-4">Toggle Columns</h2>
          {columns.map((column) => (
            <div key={column.value} className="mb-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-blue-600"
                  name={column.value}
                  checked={columnVisibility[column.value]}
                  onChange={handleCheckboxChange}
                />
                <span className="ml-2 text-gray-700">{column.label}</span>
              </label>
            </div>
          ))}
          <div className="flex justify-end mt-4">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
              onClick={handleApplyChanges}
            >
              Apply Changes
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

    export default ColumnToggle;
