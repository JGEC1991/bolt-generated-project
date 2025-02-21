import React, { useState } from 'react';
    import { supabase } from './supabaseClient';

    function VehicleAdd({ closeModal }) {
      const [make, setMake] = useState('');
      const [model, setModel] = useState('');
      const [year, setYear] = useState('');
      const [color, setColor] = useState('');
      const [plateNumber, setPlateNumber] = useState('');
      const [mileage, setMileage] = useState('');
      const [lastService, setLastService] = useState('');
      const [loading, setLoading] = useState(false);

      async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);

        try {
          const { error } = await supabase
            .from('Vehicules')
            .insert({
              make: make,
              model: model,
              year: year,
              color: color,
              plate_number: plateNumber,
              mileage: mileage,
              last_service: lastService,
            });

          if (error) {
            throw error;
          }

          alert('Vehicle added successfully!');
          closeModal(); // Close the modal after successful submission
        } catch (error) {
          alert(error.message);
        } finally {
          setLoading(false);
        }
      }

      return (
        <div className="container mx-auto mt-8">
          <h1 className="text-2xl font-bold mb-4">Add Vehicle</h1>
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="mb-4">
              <label
                htmlFor="make"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Make:
              </label>
              <input
                type="text"
                id="make"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={make}
                onChange={(e) => setMake(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="model"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Model:
              </label>
              <input
                type="text"
                id="model"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="year"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Year:
              </label>
              <input
                type="number"
                id="year"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="color"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Color:
              </label>
              <input
                type="text"
                id="color"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="plateNumber"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Plate Number:
              </label>
              <input
                type="text"
                id="plateNumber"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={plateNumber}
                onChange={(e) => setPlateNumber(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="mileage"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Mileage:
              </label>
              <input
                type="number"
                id="mileage"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="lastService"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Last Service:
              </label>
              <input
                type="date"
                id="lastService"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={lastService}
                onChange={(e) => setLastService(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add Vehicle'}
              </button>
            </div>
          </form>
        </div>
      );
    }

    export default VehicleAdd;
