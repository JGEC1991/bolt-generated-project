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
      const [isListView, setIsListView] = false; // State to track view mode
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
      const [sortColumn, setSortColumn] = useState(null);
      const [sortDirection, setSortDirection] = useState('asc');

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

      const sortedActivities = useCallback(() => {
        if (!sortColumn) return [...activities];

        const sorted = [...activities].sort((a, b) => {
          const aValue = a[sortColumn];
          const bValue = b[sortColumn];

          if (aValue == null) return sortDirection === 'asc' ? -1 : 1;
          if (bValue == null) return sortDirection === 'asc' ? 1 : -1;

          if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
          }

          const aString = String(aValue).toLowerCase();
          const bString = String(bValue).toLowerCase();

          if (aString < bString) return sortDirection === 'asc' ? -1 : 1;
          if (aString > bString) return sortDirection === 'asc' ? 1 : -1;
          return 0;
        });
        return sorted;
      }, [activities, sortColumn, sortDirection]);

      const currentActivities = sortedActivities().slice(indexOfFirstActivity, indexOfLastActivity);

      const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

      const handleDeleteActivity = async (activityId) => {
        if (window.confirm('Are you sure you want to delete this activity?')) {
          setLoading(true);
          try {
            const { error } = await supabase
              .from('activities')
              .delete()
              .eq('id', activityId);

            if (error) {
              throw error;
            }

            alert('Activity deleted successfully!');
            fetchActivities(); // Refresh activities
          } catch (error) {
            alert(error.message);
          } finally {
            setLoading(false);
          }
        }
      };

      const handleEditClick = (activity) => {
        setSelectedActivity(activity);
        setIsCardModalOpen(true);
      };

      const handleCloseCardModal = () => {
        setSelectedActivity(null);
        setIsCardModalOpen(false);
      };

      const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      };

      const handleSort = (column) => {
        if (column === sortColumn) {
          setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
          setSortColumn(column);
          setSortDirection('asc');
        }
      };

      const getSortIcon = (column) => {
        if (column !== sortColumn) return null;
        return sortDirection === 'asc' ? '▲' : '▼';
      };

      const clearFilter = (filterKey) => {
        const newFilters = { ...filters };
        delete newFilters[filterKey];
        setFilters(newFilters);
      };

      return (
        <div className="container mx-auto mt-8">
          <h1 className="text-2xl font-bold mb-4">Activities</h1>

          <div className="flex justify-between items-center mb-4 relative" ref={filterRef}>
            <div>
              <button onClick={toggleView}>
                <img
                  src="https://fbldpvpdmvtrfxdslfba.supabase.co/storage/v1/object/public/assets//view-switch-icon.png"
                  alt="Switch View"
                  className="h-8 w-8"
                />
              </button>
            </div>
            <div className="flex items-center relative">
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
              <ColumnToggle
                isOpen={isColumnToggleOpen}
                onClose={toggleColumnToggle}
                onColumnToggle={handleColumnToggle}
                columns={columnOptions}
              />
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

          {/* Filter Tags */}
          {Object.keys(filters).length > 0 && (
            <div className="flex flex-wrap mb-4">
              {Object.keys(filters).map((key) => (
                filters[key] && (
                  <div
                    key={key}
                    className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"
                  >
                    {key}: {filters[key]}
                    <button
                      type="button"
                      className="ml-1.5 -mr-2.5 text-blue-500 hover:text-blue-700"
                      onClick={() => clearFilter(key)}
                    >
                      <span className="sr-only">Remove filter</span>
                      <svg className="w-3 h-3" style={{ width: '0.7em', height: '0.7em' }} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6-6" />
                      </svg>
                    </button>
                  </div>
                )
              ))}
            </div>
          )}

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
                                        <button onClick={() => handleEditClick(activity)} className="w-full text-left">
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
                        {columnVisibility.activity_type && <th className="text-center" onClick={() => handleSort('activity_type')}>Activity Type {getSortIcon('activity_type')}</th>}
                        {columnVisibility.comments && <th className="text-center" onClick={() => handleSort('comments')}>Comments {getSortIcon('comments')}</th>}
                        {columnVisibility.activity_user && <th className="text-center" onClick={() => handleSort('activity_user')}>Activity User {getSortIcon('activity_user')}</th>}
                        {columnVisibility.plate_number && <th className="text-center" onClick={() => handleSort('plate_number')}>Plate Number {getSortIcon('plate_number')}</th>}
                        {columnVisibility.Status && <th className="text-center" onClick={() => handleSort('Status')}>Status {getSortIcon('Status')}</th>}
                        {columnVisibility.activity_date && <th className="text-center" onClick={() => handleSort('activity_date')}>Activity Date {getSortIcon('activity_date')}</th>}
                        {columnVisibility.activity_files && <th className="text-center" onClick={() => handleSort('activity_files')}>Activity Files {getSortIcon('activity_files')}</th>}
                        {columnVisibility.created_at && <th className="text-center" onClick={() => handleSort('created_at')}>Created At {getSortIcon('created_at')}</th>}
                        {columnVisibility.id && <th className="text-center" onClick={() => handleSort('id')}>ID {getSortIcon('id')}</th>}
                        <th className="text-center">Actions</th> {/* Add Actions header */}
                      </tr>
                    </thead>
                    <tbody>
                      {currentActivities.map((activity, index) => (
                        <tr key={activity.id} className={`bg-white dark:bg-gray-800 ${index % 2 === 0 ? '' : 'bg-gray-100 dark:bg-gray-700'} hover:bg-gray-200 dark:hover:bg-gray-600`}>
                          {columnVisibility.activity_type && <td style={{ padding: '0.75rem', textAlign: 'center' }}>{activity.activity_type}</td>}
                          {columnVisibility.comments && <td style={{ padding: '0.75rem', textAlign: 'center' }}>{activity.comments}</td>}
                          {columnVisibility.activity_user && <td style={{ padding: '0.75rem', textAlign: 'center' }}>{activity.activity_user}</td>}
                          {columnVisibility.plate_number && <td style={{ padding: '0.75rem', textAlign: 'center' }}>{activity.plate_number}</td>}
                          {columnVisibility.Status && <td style={{ padding: '0.75rem', textAlign: 'center' }}>{activity.Status}</td>}
                          {columnVisibility.activity_date && <td style={{ padding: '0.75rem', textAlign: 'center' }}>{formatDate(activity.activity_date)}</td>}
                          {columnVisibility.activity_files && <td style={{ padding: '0.75rem', textAlign: 'center' }}>{activity.activity_files}</td>}
                          {columnVisibility.created_at && <td style={{ padding: '0.75rem', textAlign: 'center' }}>{formatDate(activity.created_at)}</td>}
                          {columnVisibility.id && <td style={{ padding: '0.75rem', textAlign: 'center' }}>{activity.id}</td>}
                          <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                            <button
                              className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded focus:outline-none focus:shadow-outline mr-2"
                              style={{ padding: '0.2rem 0.4rem', fontSize: '0.7rem' }} // Reduced padding and font size
                              onClick={() => handleEditClick(activity)}
                            >
                              Edit
                            </button>
                            <button
                              className="bg-red-500 hover:bg-red-700 text-white font-bold rounded focus:outline-none focus:shadow-outline"
                              style={{ padding: '0.2rem 0.4rem', fontSize: '0.7rem' }} // Reduced padding and font size
                              onClick={() => handleDeleteActivity(activity.id)}
                            >
                              Delete
                            </button>
                          </td>
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
                <span className="close" onClick={handleCloseCardModal}>
                  &times;
                </span>
                <ActivityCard activity={selectedActivity} closeModal={handleCloseCardModal} onActivityUpdate={fetchActivities} initialEditMode={true} />
              </div>
            </div>
          )}
        </div>
      );
    }

    export default Activities;
