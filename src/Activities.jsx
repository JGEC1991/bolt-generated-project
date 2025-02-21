import React, { useState, useEffect, useCallback } from 'react';
    import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
    import { supabase } from './supabaseClient';
    import ActivityCard from './ActivityCard';

    const columnMap = {
      Open: 'Open',
      'In Progress': 'In Progress',
      Completed: 'Completed',
    };

    function Activities() {
      const [activities, setActivities] = useState([]);
      const [currentPage, setCurrentPage] = useState(1);
      const activitiesPerPage = 5;
      const [loading, setLoading] = useState(true);
      const [selectedActivity, setSelectedActivity] = useState(null);
      const [isCardModalOpen, setIsCardModalOpen] = useState(false);

      const fetchActivities = useCallback(async () => {
        try {
          setLoading(true);
          const { data, error } = await supabase
            .from('activities')
            .select('*');

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
      }, []);

      useEffect(() => {
        document.title = 'Activities';
        fetchActivities();
      }, [fetchActivities]);

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

      return (
        <div className="container mx-auto mt-8">
          <h1 className="text-2xl font-bold mb-4">Activities</h1>

          {loading ? (
            <p>Loading activities...</p>
          ) : (
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
