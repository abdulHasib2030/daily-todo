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

const socket = io('http://localhost:5000')

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
  const [update, setUpdate] = useState({id: '',title:'', description:'', category:''})

  const [taskColumns, setTaskColumns] = useState({
    "To-Do": [],
    "In Progress": [],
    "Done": [],
  });


  const { data: tasks = [],isLoading,isPending, refetch } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data } = await axios.get(`http://localhost:5000/tasks`);
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

  console.log(tasks);
 

console.log(taskColumns);


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
    // console.log(taskColumns["Done"]);

    socket.emit('updateTask', [active, over, taskColumns])
    // console.log(taskss['todo']);


  };





  // useEffect(() => {
  //   socket.on("receive_message", (data) => {
  //     // setMessages((prev) => [...prev, data]);
  //   });

  //   return () => socket.off("receive_message");
  // }, []);

 if(isPending || isLoading) return <Loading/>
  // useEffect(() => {
  //   socket.on("tasksUpdated", (updatedTasks) => {
  //     queryClient.setQueryData(["tasks"], updatedTasks);
  //   });
  //   return () => socket.off("tasksUpdated");
  // }, [queryClient]);


  const handleSubmit = async(e) => {
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
      const res =await axios.post(`${import.meta.env.VITE_URL}/tasks`, newTask)
      setOpenModal(false)
      refetch()
      toast.success("Successfully added task.")

    } catch (error) {
      console.log(error);
    }
    form.reset()
  }



  const updateTask = (id) =>{
    console.log(id);
    const singleData = tasks.filter(task=> task._id === id)
    console.log(singleData[0]);
    setUpdate({id:id ,title:singleData[0].title, description:singleData[0].description, category:singleData[0].category})
    setOpenUpdateModal(true)
  }

  const handleUpdateSubmit = async (e) =>{
    e.preventDefault()
    const form = e.target;
    const title  = form.title.value;
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

  const deleteTask= async(id)=>{
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async(result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.delete(`${import.meta.env.VITE_URL}/tasks/${id}`)
          console.log(res.data);
          refetch()
         toast.success('Your task has been deleted.')
        } catch (error) {
          toast.error("Something wrong")
        }
       
      }
    });
  }



  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Real-Time Task Board</h2>
      <button onClick={() => setOpenModal(true)} className="bg-blue-500 text-white px-4 py-2 rounded my-4">
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
      <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="flex border gap-4 p-4 bg-red-500">
        {Object.keys(taskColumns)?.map((category) => (

          <TaskColumn key={category} id={category} title={category} taskss={taskColumns[category]} />
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
                <option value={'inprocess'}>In Progress</option>
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
const TaskColumn = ({ id, title, taskss }) => {
 taskss.map(task=> {
  console.log(task._id);
 })
  const { isOver, setNodeRef } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`w-1/3 border border-red-4 p-4  rounded ${isOver ? "bg-gray-200" : "bg-white"}`}
    >
      <h2 className="text-lg  font-bold mb-2 uppercase text-black">{title}</h2>
      <SortableContext items={taskss} strategy={verticalListSortingStrategy}>
        {/* {taskss[0].map((task) => (
          <Task key={task} id={task} />
        ))} */}
        {
          taskss.map(task=> <Task key={task} id={task}></Task>)
        }
      </SortableContext>
    </div>
  );
};

const Task = ({ id }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="p-2 mb-2 bg-blue-500 text-white  rounded cursor-pointer"
      style={{ transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined }}
    >
      {id.title}
    </div>
  );
};


export default TaskList;



