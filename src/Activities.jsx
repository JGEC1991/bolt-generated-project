import React, { useState, useEffect, useCallback, useRef } from 'react';
    import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
    import { supabase } from './supabaseClient';
    import ActivityCard from './ActivityCard';
    import Filter from './Filter'; // Import the Filter component
    import ColumnToggle from './ColumnToggle'; // Import the ColumnToggle component

    const columnMap = {
      Open: 'Open',
      'In Progress': 'In Progress',
      Completed: 'Completed',
    };

    const activityTypes = [
      'incident',
      'meeting',
      'flat_tire',
      'oil_change',
      'no_start',
      'towing',
      'crash',
    ];

    const statuses = ['Open', 'In Progress', 'Completed'];

    function Activities() {
      const [activities, setActivities] = useState([]);
      const [currentPage, setCurrentPage] = useState(1);
      const activitiesPerPage = 5;
      const [loading, setLoading] = useState(true);
      const [selectedActivity, setSelectedActivity] = useState(null);
      const [isCardModalOpen, setIsCardModalOpen] = useState(false);
      const [isListView, setIsListView] = useState(false); // State to track view mode
      const [isFilterOpen, setIsFilterOpen] = useState(false); // State to track filter visibility
      const [filters, setFilters] = useState({}); // State to store filter values
      const [userEmails, setUserEmails] = useState([]); // State to store user emails
      const filterRef = useRef(null);
      const [isColumnToggleOpen, setIsColumnToggleOpen] = useState(false); // State for column toggle visibility
      const [columnVisibility, setColumnVisibility] = useState({ // State for column visibility
        activity_type: true,
        comments: true,
        activity_user: true,
        plate_number: true,
        Status: true,
        activity_date: true,
        activity_files: true,
        created_at: true,
        id: true,
      });

      const filterOptions = [
        { label: 'Activity Type', value: 'activity_type', type: 'select', options: activityTypes },
        { label: 'Status', value: 'Status', type: 'select', options: statuses },
        { label: 'Assigned User', value: 'activity_user', type: 'select', options: userEmails },
        { label: 'Plate Number', value: 'plate_number' },
        { label: 'Activity Date From', value: 'activity_date_from', type: 'date' },
        { label: 'Activity Date To', value: 'activity_date_to', type: 'date' },
      ];

      const columnOptions = [
        { label: 'Activity Type', value: 'activity_type' },
        { label: 'Comments', value: 'comments' },
        { label: 'Activity User', value: 'activity_user' },
        { label: 'Plate Number', value: 'plate_number' },
        { label: 'Status', value: 'Status' },
        { label: 'Activity Date', value: 'activity_date' },
        { label: 'Activity Files', value: 'activity_files' },
        { label: 'Created At', value: 'created_at' },
        { label: 'ID', value: 'id' },
      ];

      const fetchActivities = useCallback(async () => {
        try {
          setLoading(true);
          let query = supabase
            .from('activities')
            .select('*');

          // Apply filters to the query
          Object.keys(filters).forEach(key => {
            if (filters[key]) {
              if (key === 'activity_date_from') {
                query = query.gte('activity_date', filters[key]);
              } else if (key === 'activity_date_to') {
                query = query.lte('activity_date', filters[key]);
              } else {
                query = query.eq(key, filters[key]);
              }
            }
          });

          const { data, error } = await query;

          if (error) {
            throw error;
          }

          if (data) {
            setActivities(data);
          }
        } catch (error) {
          alert(error.message);
        } finally {
          setLoading(false);
        }
      }, [filters]);

      const fetchUserEmails = useCallback(async () => {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('email');

          if (error) {
            throw error;
          }

          if (data) {
            const emails = data.map(user => user.email);
            setUserEmails(emails);
          }
        } catch (error) {
          alert(error.message);
        }
      }, []);

      useEffect(() => {
        document.title = 'Activities';
        fetchActivities();
        fetchUserEmails();
      }, [fetchActivities, fetchUserEmails]);

      const handleDragEnd = async (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) {
          return;
        }

        if (
          destination.droppableId === source.droppableId &&
          destination.index === source.index
        ) {
          return;
        }

        const newActivities = [...activities];
        const activityIndex = activities.findIndex((activity) => activity.id === parseInt(draggableId));
        const activity = newActivities[activityIndex];
        const newStatus = destination.droppableId;

        // Optimistic update
        const previousStatus = activity.Status;
        activity.Status = newStatus;
        newActivities.splice(source.index, 1);
        newActivities.splice(destination.index, 0, activity);
        setActivities([...newActivities]); // Update state immediately

        try {
          const { error } = await supabase
            .from('activities')
            .update({ Status: newStatus })
            .eq('id', draggableId);

          if (error) {
            console.error("Error updating activity:", error);
            alert('Error updating activity!');
            // Revert optimistic update
            activity.Status = previousStatus;
            setActivities([...activities]);
            throw error;
          }
        } catch (error) {
          alert(error.message);
        }
      };

      const indexOfLastActivity = currentPage * activitiesPerPage;
      const indexOfFirstActivity = indexOfLastActivity - activitiesPerPage;
      const currentActivities = activities.slice(indexOfFirstActivity, indexOfLastActivity);

      const paginate = (pageNumber) => setCurrentPage(pageNumber);

      const openCardModal = (activity) => {
        setSelectedActivity(activity);
        setIsCardModalOpen(true);
      };

      const closeCardModal = () => {
        setSelectedActivity(null);
        setIsCardModalOpen(false);
      };

      const toggleView = () => {
        setIsListView(!isListView);
      };

      const toggleFilter = () => {
        setIsFilterOpen(!isFilterOpen);
      };

      const toggleColumnToggle = () => {
        setIsColumnToggleOpen(!isColumnToggleOpen);
      };

      const handleFilter = (newFilters) => {
        setFilters(newFilters);
        setCurrentPage(1); // Reset to the first page after filtering
      };

      const handleColumnToggle = (newColumnVisibility) => {
        setColumnVisibility(newColumnVisibility);
      };

      return (
        <div className="container mx-auto mt-8">
          <h1 className="text-2xl font-bold mb-4">Activities</h1>

          <div className="flex justify-between items-center mb-4 relative">
            <div>
              <button onClick={toggleView}>
                <img
                  src="https://fbldpvpdmvtrfxdslfba.supabase.co/storage/v1/object/public/assets//view-switch-icon.png"
                  alt="Switch View"
                  className="h-8 w-8"
                />
              </button>
            </div>
            <div className="flex items-center">
              <button onClick={toggleFilter} className="mr-2">
                <img
                  src="https://fbldpvpdmvtrfxdslfba.supabase.co/storage/v1/object/public/assets//filter-icon.png"
                  alt="Filter"
                  className="h-8 w-8"
                />
              </button>
              <button onClick={toggleColumnToggle}>
                <img
                  src="https://fbldpvpdmvtrfxdslfba.supabase.co/storage/v1/object/public/assets//column-icon.png"
                  alt="Column Toggle"
                  className="h-8 w-8"
                />
              </button>
            </div>
            <div className="absolute right-0 mt-2 z-10" style={{ width: '400px' }}>
              <Filter
                isOpen={isFilterOpen}
                onClose={toggleFilter}
                onFilter={handleFilter}
                filterOptions={filterOptions}
              />
            </div>
          </div>

          <ColumnToggle
            isOpen={isColumnToggleOpen}
            onClose={toggleColumnToggle}
            onColumnToggle={handleColumnToggle}
            columns={columnOptions}
          />

          {loading ? (
            <p>Loading activities...</p>
          ) : (
            <>
              {!isListView ? (
                <DragDropContext onDragEnd={handleDragEnd}>
                  <div className="flex justify-between">
                    {Object.keys(columnMap).map((columnKey) => (
                      <div key={columnKey} className="w-1/3 p-2">
                        <h2 className="text-lg font-semibold mb-2">{columnMap[columnKey]}</h2>
                        <Droppable droppableId={columnKey}>
                          {(provided) => (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              className="bg-gray-100 dark:bg-gray-700 rounded p-2 min-h-[100px]"
                            >
                              {currentActivities
                                .filter((activity) => activity.Status === columnKey)
                                .map((activity, index) => (
                                  <Draggable key={activity.id} draggableId={activity.id.toString()} index={index}>
                                    {(provided) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className="bg-white dark:bg-gray-800 shadow rounded p-2 mb-2"
                                      >
                                        <button onClick={() => openCardModal(activity)} className="w-full text-left">
                                          {activity.activity_type} - {activity.Status}
                                        </button>
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </div>
                    ))}
                  </div>
                </DragDropContext>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table-auto w-full">
                    <thead>
                      <tr className="bg-gray-200 dark:bg-gray-700">
                        {columnVisibility.activity_type && <th>Activity Type</th>}
                        {columnVisibility.comments && <th>Comments</th>}
                        {columnVisibility.activity_user && <th>Activity User</th>}
                        {columnVisibility.plate_number && <th>Plate Number</th>}
                        {columnVisibility.Status && <th>Status</th>}
                        {columnVisibility.activity_date && <th>Activity Date</th>}
                        {columnVisibility.activity_files && <th>Activity Files</th>}
                        {columnVisibility.created_at && <th>Created At</th>}
                        {columnVisibility.id && <th>ID</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {currentActivities.map((activity) => (
                        <tr key={activity.id} className="bg-white dark:bg-gray-800">
                          {columnVisibility.activity_type && <td>{activity.activity_type}</td>}
                          {columnVisibility.comments && <td>{activity.comments}</td>}
                          {columnVisibility.activity_user && <td>{activity.activity_user}</td>}
                          {columnVisibility.plate_number && <td>{activity.plate_number}</td>}
                          {columnVisibility.Status && <td>{activity.Status}</td>}
                          {columnVisibility.activity_date && <td>{activity.activity_date}</td>}
                          {columnVisibility.activity_files && <td>{activity.activity_files}</td>}
                          {columnVisibility.created_at && <td>{activity.created_at}</td>}
                          {columnVisibility.id && <td>{activity.id}</td>}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          <div className="flex justify-center mt-4">
            {Array.from({ length: Math.ceil(activities.length / activitiesPerPage) }).map((_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className="mx-1 px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded"
              >
                {index + 1}
              </button>
            ))}
          </div>

          {/* Activity Card Modal */}
          {isCardModalOpen && selectedActivity && (
            <div className="modal">
              <div className="modal-content">
                <span className="close" onClick={closeCardModal}>
                  &times;
                </span>
                <ActivityCard activity={selectedActivity} closeModal={closeCardModal} onActivityUpdate={fetchActivities} />
              </div>
            </div>
          )}
        </div>
      );
    }

    export default Activities;
