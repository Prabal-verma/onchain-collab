"use client"
// pages/CreateTask.js
import { useState } from 'react';
import { ethers } from 'ethers';
import TaskManagerABI from '../../contracts/TaskManager.json';

const CreateTask = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reward, setReward] = useState(0);

  const createTask = async () => {
    try {
      // Connect to the blockchain
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        'YOUR_CONTRACT_ADDRESS', // Replace with deployed contract address
        TaskManagerABI.abi,
        signer
      );
      const tx = await contract.createTask(title, description, ethers.utils.parseEther(reward.toString()));
      await tx.wait();
      alert('Task created successfully');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Create a Task</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="number"
        placeholder="Reward (ETH)"
        value={reward}
        onChange={(e) => setReward(Number(e.target.value))}
      />
      <button onClick={createTask}>Create Task</button>
    </div>
  );
};

export default CreateTask;
