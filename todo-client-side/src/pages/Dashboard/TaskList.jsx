import React, { useContext, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import { AuthContext } from "../../providers/AuthProviders";
import { format } from "date-fns";
import { Button, Modal } from "flowbite-react";
import { FaEdit, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import Swal from 'sweetalert2'
import Loading from "../../components/Loading";
import io from 'socket.io-client'

const socket = io('https://daily-todo-server.onrender.com')

import {
  DndContext,
  closestCorners,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

const initialTasks = {
  todo: ["Task 1", "Task 2", "Task 3"],
  inprocess: ["Task 4", "Task 5"],
  done: ["Task 6"],
};


const TaskList = () => {
  const queryClient = useQueryClient();
  const { user } = useContext(AuthContext)
  const [openModal, setOpenModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [update, setUpdate] = useState({ id: '', title: '', description: '', category: '' })

  const [taskColumns, setTaskColumns] = useState({
    "To-Do": [],
    "In Progress": [],
    "Done": [],
  });


  const { data: tasks = [], isLoading, isPending, refetch } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data } = await axios.get(`https://daily-todo-server.onrender.com/tasks?email=${user?.email}`);
      return data;
    }
  });


  const [taskss, setTaskss] = useState(initialTasks);

  useEffect(() => {
    // Group tasks by category
    const groupedTasks = {
      "To-Do": tasks.filter((task) => task.category === "todo"),
      "In Progress": tasks.filter((task) => task.category === "inprogress"),
      "Done": tasks.filter((task) => task.category === "done"),
    };

    setTaskColumns(groupedTasks);
  }, [tasks]);






  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const sourceCategory = Object.keys(taskColumns).find((key) => taskColumns[key].includes(active.id));
    const targetCategory = over.id;


    if (sourceCategory && targetCategory) {
      setTaskColumns((prev) => {
        const sourceTasks = [...prev[sourceCategory]];
        const targetTasks = [...prev[targetCategory]];
        const draggedItemIndex = sourceTasks.indexOf(active.id);

        if (sourceCategory === targetCategory) {
          const targetIndex = targetTasks.indexOf(over.id);
          const reorderedTasks = arrayMove(sourceTasks, draggedItemIndex, targetIndex);
          socket.emit('updateOrderTask', [reorderedTasks, over.id])

          return { ...prev, [sourceCategory]: reorderedTasks };
        } else {
          sourceTasks.splice(draggedItemIndex, 1);
          targetTasks.push(active.id);
          return { ...prev, [sourceCategory]: sourceTasks, [targetCategory]: targetTasks };
        }
      });


    }


    socket.emit('updateTask', [active, over, taskColumns])
 


  };





  // useEffect(() => {
  //   socket.on("receive_message", (data) => {
  //     // setMessages((prev) => [...prev, data]);
  //   });

  //   return () => socket.off("receive_message");
  // }, []);

  if (isPending || isLoading) return <Loading />
  // useEffect(() => {
  //   socket.on("tasksUpdated", (updatedTasks) => {
  //     queryClient.setQueryData(["tasks"], updatedTasks);
  //   });
  //   return () => socket.off("tasksUpdated");
  // }, [queryClient]);


  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.target;
    const title = form.title.value;
    const description = form.description.value;
    const category = form.category.value;

    if (title.length > 50) return alert("Title must be 50 characters or less");
    if (description.length > 200) return alert("Description must be 200 characters or less");

    const newTask = {
      title,
      description,
      category,
      timestamp: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      email: user.email
    };

    // ----- add task api call ------//

    try {
      const res = await axios.post(`${import.meta.env.VITE_URL}/tasks`, newTask)
      setOpenModal(false)
      refetch()
      toast.success("Successfully added task.")

    } catch (error) {
    
    }
    form.reset()
  }



  const updateTask = (id) => {
  
    const singleData = tasks.filter(task => task._id === id)
  
    setUpdate({ id: id, title: singleData[0].title, description: singleData[0].description, category: singleData[0].category })
    setOpenUpdateModal(true)
  }

  const handleUpdateSubmit = async (e) => {
    e.preventDefault()
    const form = e.target;
    const title = form.title.value;
    const description = form.description.value;
    const category = form.category.value;
    const updateTask = {
      title,
      description,
      category,
      timestamp: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
    };

    try {
      const res = await axios.put(`${import.meta.env.VITE_URL}/tasks/${update.id}`, updateTask)
      setOpenUpdateModal(false)
      toast.success("Updated successfully.")

      refetch()

    } catch (error) {
      setOpenUpdateModal(false)
      toast.error("Something wrong")
    }

  }

  const deleteTask = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.delete(`${import.meta.env.VITE_URL}/tasks/${id}`)
       
          refetch()
          toast.success('Your task has been deleted.')
        } catch (error) {
          toast.error("Something wrong")
        }

      }
    });
  }



  return (
    <div className="my-16 pb-32">
      <h2 className="text-3xl font-bold">Daily Todo - Task Management Made Simple</h2>

      <button onClick={() => setOpenModal(true)} className="inline-flex my-5 w-fit mx-auto h-12 animate-background-shine items-center justify-center rounded-md  border-2 dark:border-[#656fe2] border-[#c0c6fc] dark:bg-[linear-gradient(110deg,#1e2a78,45%,#3749be,55%,#1e2a78)] bg-[linear-gradient(110deg,#3d5af1,45%,#5471ff,55%,#3d5af1)] bg-[length:200%_100%] dark:hover:border-white px-6 font-medium text-white dark:text-white transition-colors focus:outline-none focus:ring-2 dark:focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-50">
      Add Task
    </button>

      {/*      
        <div className="grid md:grid-cols-3 gap-5 grid-cols-1">
          {["To-Do", "In Progress", "Done"].map((category, idx) => <div key={idx}
                 
                  className=" bg-gray-200 p-4 rounded"
                >
                  <h3 className="text-lg font-bold">{category}</h3>
                  {taskColumns[category].map((task, index) =>   <div key={index}
                         
                          className="bg-white p-3 my-4 rounded shadow flex justify-between"
                        >
                          <div >
                            <h1 className="text-xl font-semibold">  {task.title}</h1>
                            <p className="text-sm">{task.description}</p>
                            <p>{format(task.timestamp, "EEEE, MMMM d, yyyy")}</p>
                          </div>
                          <div className='space-y-2'>
                            <FaEdit onClick={()=>updateTask(task._id)} className='text-xl cursor-pointer' />
                            <FaTrash onClick={()=> deleteTask(task._id)} className='text-xl cursor-pointer'  ></FaTrash>
                          </div>
                        </div>
                    
                   
                  )}
                  
                </div>
              )}
            
          
        </div> */}
      <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}  >
        <div className="grid md:grid-cols-3 grid-cols-1  border rounded-lg  gap-4 p-4 bg-gray-900">
          {Object.keys(taskColumns)?.map((category) => (

            <TaskColumn key={category} id={category} title={category} update={updateTask} deleteTa={deleteTask} taskss={taskColumns[category]} />
          ))}
        </div>
      </DndContext>


      {/* add task modal */}

      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Create New Task</Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className='space-y-2'>
              <h2 className="font-bold text-lg">Create New Task</h2>
              <label className="label">Title (Max 50 chars)</label>
              <input
                type="text"
                className="input input-bordered w-full"
                name='title'
                maxLength={50}
                required
              />
              <label className="label">Description (Max 200 chars)</label>
              <textarea
                className="textarea textarea-bordered w-full"
                name='description'
                maxLength={200}
                required
              ></textarea>
              <label className="label">Category</label>
              <select className="select select-bordered w-full" name='category' >
                <option value={'todo'}>To-Do</option>
                <option value={'inprogress'}>In Progress</option>
                <option value={'done'}>Done</option>
              </select>


              <button type='submit' className="btn btn-success mt-3 px-6">Save</button>


            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          {/* <Button onClick={() => setOpenModal(false)}>I accept</Button> */}
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Decline
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={openUpdateModal} onClose={() => setOpenUpdateModal(false)}>
        <Modal.Header>Update Task</Modal.Header>
        <Modal.Body>
          <form onSubmit={handleUpdateSubmit}>
            <div className='space-y-2'>
              <h2 className="font-bold text-lg">Create New Task</h2>
              <label className="label">Title (Max 50 chars)</label>
              <input
                type="text"
                className="input input-bordered w-full"
                name='title'
                defaultValue={update.title}
                // onChange={(e)=> setUpdate(e.target.value)}
                maxLength={50}
                required
              />
              <label className="label">Description (Max 200 chars)</label>
              <textarea
                className="textarea textarea-bordered w-full"
                name='description'
                maxLength={200}
                defaultValue={update.description}
                required
              ></textarea>
              <label className="label">Category</label>

              <select defaultValue={update.category} className="select select-bordered w-full" name='category' >
                <option value={'todo'}>To-Do</option>
                <option value={'inprogress'}>In Progress</option>
                <option value={'done'}>Done</option>
              </select>


              <button type='submit' className="btn btn-success mt-3 px-6">Save</button>


            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          {/* <Button onClick={() => setOpenModal(false)}>I accept</Button> */}
          <Button color="gray" onClick={() => setOpenUpdateModal(false)}>
            Decline
          </Button>
        </Modal.Footer>
      </Modal>


    </div>
  );
};
const TaskColumn = ({ id, title, update, deleteTa, taskss }) => {
  taskss.map(task => {
  
  })
  const { isOver, setNodeRef } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={` border border-red-4 p-4  rounded ${isOver ? "bg-gray-200" : "bg-white"}`}
    >
      <h2 className="text-lg  font-bold mb-2 uppercase text-black">{title}</h2>
      <SortableContext items={taskss} strategy={verticalListSortingStrategy} >
        {/* {taskss[0].map((task) => (
          <Task key={task} id={task} />
        ))} */}
        {
          taskss.map(task => <Task key={task} update={update} deleteTa={deleteTa} id={task}></Task>)
        }
      </SortableContext>
    </div>
  );
};

const Task = ({ update, deleteTa ,id }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
 
  return (
    <div className="p-2 mb-2 flex   relative text-white  rounded cursor-pointer">
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className=" w-full block  p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
      style={{ transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined }}
    >
     <div>
     <h1 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{id.title}</h1>
      <p className="text-sm font-normal text-gray-700 dark:text-gray-400">{id.description}</p>
      <p className="font-normal text-gray-700 dark:text-gray-400">{format(id.timestamp, "EEEE, MMMM d, yyyy")}</p>

     </div>
        </div>

  
        
      <div className="space-y-2 absolute right-5 top-8 ">
        <FaEdit onClick={()=> update(id._id)}

          className="text-xl cursor-pointer"
        />
       <button  onClick={()=> deleteTa(id._id)}> <FaTrash
          className="text-xl cursor-pointer"
        /></button>
        </div>  
    
    </div>
  );
};


export default TaskList;



