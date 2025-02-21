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

const socket = io("http://localhost:5000");



const TaskList = () => {
  const queryClient = useQueryClient();
  const { user } = useContext(AuthContext)
  const [openModal, setOpenModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [update, setUpdate] = useState({id: '',title:'', description:'', category:''})

  const { data: tasks = [], refetch } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data } = await axios.get(`http://localhost:5000/tasks?email=${user.email}`);
      return data;
    }
  });

  const [taskColumns, setTaskColumns] = useState({
    "To-Do": [],
    "In Progress": [],
    "Done": [],
  });

  useEffect(() => {
    // Group tasks by category
    const groupedTasks = {
      "To-Do": tasks.filter((task) => task.category === "todo"),
      "In Progress": tasks.filter((task) => task.category === "inprocess"),
      "Done": tasks.filter((task) => task.category === "done"),
    };
    setTaskColumns(groupedTasks);
  }, [tasks]);

  // useEffect(() => {
  //   socket.on("tasksUpdated", (updatedTasks) => {
  //     queryClient.setQueryData(["tasks"], updatedTasks);
  //   });
  //   return () => socket.off("tasksUpdated");
  // }, [queryClient]);


  const handleSubmit = (e) => {
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

    refetch()
    try {
      const res = axios.post(`${import.meta.env.VITE_URL}/tasks`, newTask)
      setOpenModal(false)
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

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Real-Time Task Board</h2>
      <button onClick={() => setOpenModal(true)} className="bg-blue-500 text-white px-4 py-2 rounded my-4">
        Add Task
      </button>

     
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
                            <FaTrash className='text-xl cursor-pointer'  ></FaTrash>
                          </div>
                        </div>
                    
                   
                  )}
                  
                </div>
              )}
            
          
        </div>
     


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
                <option value={'inprocess'}>In Progress</option>
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

export default TaskList;
