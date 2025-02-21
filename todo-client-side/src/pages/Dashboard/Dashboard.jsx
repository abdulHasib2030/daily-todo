import React, { useState, useEffect, useContext } from 'react';
import { format } from "date-fns";
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import Loading from '../../components/Loading';
import TaskCard from './TaskCard';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { io } from "socket.io-client";
import { AuthContext } from '../../providers/AuthProviders';
import img from '../../assets/login.jpg'
const socket = io.connect("http://localhost:5000");
import { Button, Modal } from "flowbite-react";
import toast from 'react-hot-toast';
import { FaEdit, FaTrash } from 'react-icons/fa';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const { user } = useContext(AuthContext)
  
  // useEffect(() => {
  //   if (user) {
  //     axios.get(`http://localhost:5000/tasks?email=${user.email}`).then((res) => setTasks(res.data));
  //   }

  //   // socket.on("task-updated", (newTask) => {
  //   //   setTasks((prev) => [...prev.filter((task) => task._id !== newTask._id), newTask]);
  //   // });

  //   // socket.on("task-deleted", (taskId) => {
  //   //   setTasks((prev) => prev.filter((task) => task._id !== taskId));
  //   // });

  //   // return () => socket.off();
  // }, []);

 
  

  const { data, isLoading , refetch} = useQuery({
    queryKey: ['todo'],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_URL}/tasks?email=${user.email}`)
      return res.data
    }
  })
 

  if (isLoading) return <Loading></Loading>

 console.log(data);


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




  return (
    <div className='mt-10  '>
      <div>
        <div className='text-xl font-semibold flex items-center text-center justify-center gap-10 '>
          <h4 onClick={() => setOpenModal(true)} className='cursor-pointer hover:border-b hover:text-green-600'>Add Task</h4>
          <h4 className='cursor-pointer hover:border-b hover:text-green-600'>Reorder Task</h4>
          <h4></h4>
        </div>
        {/* Task Show */}
        <div>
          <h1 className='text-3xl font-semibold mt-5 mb-3'>Your Task</h1>
          {
            data?.map((task) => <div key={task._id} className='dark:text-white'>
                  <h1 className='text-2xl'>{format(task.timestamp,  "EEEE, MMMM d, yyyy")}</h1>
                  <div className='border-b dark:border-gray-600 '></div>
                  <div className='py-4 flex items-center justify-between'>
                      <div>
                      <h4 className='text-xl font-semibold'>{task.title}</h4>
                      <p className='text-sm'>{task.description}</p>
                      </div>
                      <div className='space-y-2'>
                          <FaEdit className='text-xl cursor-pointer' />
                          <FaTrash className='text-xl cursor-pointer'  ></FaTrash>
                      </div>
                  </div>
              </div>
              )
          }
           
        </div>
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
             
                   
                  <button  type='submit'  className="btn btn-success mt-3 px-6">Save</button>


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

    

    </div>
  );
};

export default Dashboard;