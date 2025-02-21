import { format } from 'date-fns';
import React, { useState } from 'react';
import { FaEdit, FaTrash } from "react-icons/fa";
import { io } from "socket.io-client";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const itemsFromBackend = [
  { id: '1', content: 'Task 1' },
  { id: '2', content: 'Task 2' },
  { id: '3', content: 'Task 3' },
];

const TaskCard = ({task}) => {
    const [items, setItems] = useState(task);

    const onDragEnd = (result) => {
      if (!result.destination) {
        return; // Dragged and dropped outside the droppable area
      }
  
      const reorderedItems = Array.from(items);
      const [removed] = reorderedItems.splice(result.source.index, 1);
      reorderedItems.splice(result.destination.index, 0, removed);
  
      setItems(reorderedItems);
    };

    return (
     <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="items">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
              <Draggable >
                {(provided) => (
                  <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    style={{ ...provided.draggableProps.style, ...getItemStyle(provided.isDragging) }}
                  >
                    {task}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
        // <div>
        //     <h1 className='text-2xl'>{format(task.timestamp,  "EEEE, MMMM d, yyyy")}</h1>
        //     <div className='border-b dark:border-gray-600 '></div>
        //     <div className='py-4 flex items-center justify-between'>
        //         <div>
        //         <h4 className='text-xl font-semibold'>{task.title}</h4>
        //         <p className='text-sm'>{task.description}</p>
        //         </div>
        //         <div className='space-y-2'>
        //             <FaEdit className='text-xl cursor-pointer' />
        //             <FaTrash className='text-xl cursor-pointer'  ></FaTrash>
        //         </div>
        //     </div>
        // </div>
    );
};
const getItemStyle = (isDragging) => ({
  userSelect: 'none',
  padding: '16px',
  margin: '0 0 8px 0',
  background: isDragging ? 'lightgreen' : 'lightblue',
  border: '1px solid lightgray',
});

export default TaskCard;