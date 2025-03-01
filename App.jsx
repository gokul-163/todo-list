import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');

  // Fetch tasks from backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/tasks');
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  }, []);

  // Add Task
  const addTask = async () => {
    if (!task.trim()) {
      alert('Task cannot be empty!');
      return;
    }
    try {
      const newTask = { _id: Date.now().toString(), text: task, completed: false };
      setTasks((prevTasks) => [...prevTasks, newTask]);
      setTask('');
      await axios.post('http://localhost:5000/api/tasks', { text: task, completed: false });
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  // Delete Task
  const deleteTask = async (id) => {
    try {
      setTasks((prevTasks) => prevTasks.filter(task => task._id !== id));
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Toggle Completion
  const toggleComplete = async (id) => {
    try {
      setTasks((prevTasks) =>
        prevTasks.map(task =>
          task._id === id ? { ...task, completed: !task.completed } : task
        )
      );
      await axios.put(`http://localhost:5000/api/tasks/${id}`, { completed: !tasks.find(task => task._id === id).completed });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <div className="app-container">
      <h2>Todo List</h2>
      <div className="input-container">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Add a new task"
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task._id} className={task.completed ? 'completed' : ''}>
            <span>{task.text}</span>
            <button onClick={() => toggleComplete(task._id)}>
              {task.completed ? 'Mark as Pending' : 'Mark as Completed'}
            </button>
            <button className="delete-button" onClick={() => deleteTask(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
