import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const initialActivities = [
  { id: '1', title: 'Activity 1', status: 'Open' },
  { id: '2', title: 'Activity 2', status: 'In Progress' },
  { id: '3', title: 'Activity 3', status: 'Completed' },
  { id: '4', title: 'Activity 4', status: 'Open' },
  { id: '5', title: 'Activity 5', status: 'In Progress' },
];

const columnMap = {
  Open: 'Open',
  'In Progress': 'In Progress',
  Completed: 'Completed',
};

function Activities() {
  const [activities, setActivities] = useState(initialActivities);
  const [currentPage, setCurrentPage] = useState(1);
  const activitiesPerPage = 5;

  useEffect(() => {
    document.title = 'Activities';
  }, []);

  const handleDragEnd = (result) => {
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
    const activityIndex = activities.findIndex((activity) => activity.id === draggableId);
    const activity = newActivities[activityIndex];
    activity.status = destination.droppableId;
    newActivities.splice(source.index, 1);
    newActivities.splice(destination.index, 0, activity);

    setActivities(newActivities);
  };

  const indexOfLastActivity = currentPage * activitiesPerPage;
  const indexOfFirstActivity = indexOfLastActivity - activitiesPerPage;
  const currentActivities = activities.slice(indexOfFirstActivity, indexOfLastActivity);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Activities</h1>

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
                      .filter((activity) => activity.status === columnKey)
                      .map((activity, index) => (
                        <Draggable key={activity.id} draggableId={activity.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-white dark:bg-gray-800 shadow rounded p-2 mb-2"
                            >
                              {activity.title}
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
    </div>
  );
}

export default Activities;
