"use client"
// pages/TaskDashboard.js
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import TaskManagerABI from '../contracts/TaskManager.json';

const TaskDashboard = () => {
  const [tasks, setTasks] = useState([]);
  // Add this inside TaskDashboard.js component

const completeTask = async (taskId) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        'YOUR_CONTRACT_ADDRESS',
        TaskManagerABI.abi,
        signer
      );
      const tx = await contract.completeTask(taskId);
      await tx.wait();
      alert('Task completed successfully');
    } catch (err) {
      console.error(err);
    }
  };
  
  
  

  useEffect(() => {
    const fetchTasks = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        'YOUR_CONTRACT_ADDRESS', // Replace with deployed contract address
        TaskManagerABI.abi,
        provider
      );
      const taskCount = await contract.taskCount();
      const taskList = [];
      for (let i = 1; i <= taskCount; i++) {
        const task = await contract.tasks(i);
        taskList.push(task);
      }
      setTasks(taskList);
    };

    fetchTasks();
  }, []);

  return (
    <div>
      <h2>Task Dashboard</h2>
      {tasks.length === 0 ? (
        <p>No tasks available</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>Reward: {ethers.utils.formatEther(task.reward)} ETH</p>
              <p>Status: {task.completed ? 'Completed' : 'Open'}</p>
              // Add this inside the map function where tasks are displayed
  <button onClick={() => completeTask(task.id)}>Complete Task</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskDashboard;
