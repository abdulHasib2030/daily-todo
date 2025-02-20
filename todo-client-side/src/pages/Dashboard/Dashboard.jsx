import React, { useState } from 'react';
import { format } from "date-fns";
import axios from 'axios';

const Dashboard = () => {
const [modal, setModal] = useState(false)

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
    };

    // ----- add task api call ------//

    try {
      const res = axios.post(`${import.meta.env.VITE_URL}/tasks`, newTask)
      console.log(res);

    } catch (error) {
      console.log(error);
    }
    form.reset()

   

  }

  return (
    <div className='mt-10  '>
      <div>
        <div className='text-xl font-semibold flex items-center text-center justify-center gap-10 '>
          <h4 onClick={() => document.getElementById('my_modal_3').showModal()} className='cursor-pointer hover:border-b hover:text-green-600'>Add Task</h4>
          <h4 className='cursor-pointer hover:border-b hover:text-green-600'>Reorder Task</h4>
          <h4></h4>
        </div>
        {/* Task Show */}
        <div>
          <h1 className='text-2xl font-semibold mt-5'>Your Task</h1>
          <div>
    
          </div>
        </div>
      </div>

      {/* add task modal */}

      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
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
            {
              modal ?
              <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button onClick={onclose} type='submit' className="btn btn-success mt-3 px-6">Save</button>
            </form>:
            <button onClick={onclose} type='submit' className="btn btn-success mt-3 px-6">Save</button>

            }
           
          </div>
          </form>
        </div>
      </dialog>
     
    </div>
  );
};

export default Dashboard;