import React, { useContext, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { io } from "socket.io-client";
import { AuthContext } from "../../providers/AuthProviders";
import { format } from "date-fns";
import { Button, Modal } from "flowbite-react";
import { FaEdit, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Loading from "../../components/Loading";

const socket = io("http://localhost:5000");

const Dashboard = () => {
  const queryClient = useQueryClient();
  const { user } = useContext(AuthContext);
  const [openModal, setOpenModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [update, setUpdate] = useState({
    id: "",
    title: "",
    description: "",
    category: "",
  });

  const { data: tasks = [], isLoading, isPending, refetch } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data } = await axios.get(
        `http://localhost:5000/tasks?email=${user.email}`
      );
      return data;
    },
  });

  const [taskColumns, setTaskColumns] = useState({
    "To-Do": [],
    "In Progress": [],
    "Done": [],
  });

  useEffect(() => {
    const groupedTasks = {
      "To-Do": tasks.filter((task) => task.category === "todo"),
      "In Progress": tasks.filter((task) => task.category === "inprocess"),
      "Done": tasks.filter((task) => task.category === "done"),
    };
    setTaskColumns(groupedTasks);
  }, [tasks]);

  if (isPending || isLoading) return <Loading />;

  // Handle Drag and Drop
  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceCategory = source.droppableId;
    const destinationCategory = destination.droppableId;

    // Clone columns
    const updatedColumns = { ...taskColumns };

    // Remove the task from the source category
    const movedTask = updatedColumns[sourceCategory].splice(source.index, 1)[0];

    // Update task's category if moved to a different section
    movedTask.category =
      destinationCategory === "To-Do"
        ? "todo"
        : destinationCategory === "In Progress"
        ? "inprocess"
        : "done";

    // Add the task to the new category
    updatedColumns[destinationCategory].splice(destination.index, 0, movedTask);

    // Update state
    setTaskColumns(updatedColumns);

    // Update database
    try {
      await axios.put(`${import.meta.env.VITE_URL}/tasks/${movedTask._id}`, {
        category: movedTask.category,
      });
      refetch();
      toast.success("Task updated successfully.");
    } catch (error) {
      toast.error("Failed to update task.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Task Manager with Drag & Drop</h2>
      <button
        onClick={() => setOpenModal(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded my-4"
      >
        Add Task
      </button>

      {/* DragDropContext for DnD */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid md:grid-cols-3 gap-5 grid-cols-1">
          {Object.keys(taskColumns).map((category, idx) => (
            <Droppable key={idx} droppableId={category}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="bg-gray-200 p-4 rounded min-h-[300px]"
                >
                  <h3 className="text-lg font-bold">{category}</h3>
                  {taskColumns[category].map((task, index) => (
                    <Draggable key={task._id} draggableId={task._id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white p-3 my-4 rounded shadow flex justify-between"
                        >
                          <div>
                            <h1 className="text-xl font-semibold">{task.title}</h1>
                            <p className="text-sm">{task.description}</p>
                            <p>{format(task.timestamp, "EEEE, MMMM d, yyyy")}</p>
                          </div>
                          <div className="space-y-2">
                            <FaEdit
                             
                              className="text-xl cursor-pointer"
                            />
                            <FaTrash
                           
                              className="text-xl cursor-pointer"
                            />
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Dashboard;
