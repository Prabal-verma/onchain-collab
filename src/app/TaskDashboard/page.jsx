"use client";
// pages/TaskDashboard.js
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import TaskManagerABI from "../../contracts/TaskManager.json";

const TaskDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [account, setAccount] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  // Function to connect MetaMask
  const connectMetaMask = async () => {
    try {
      if (typeof window.ethereum !== "undefined") {
        console.log("MetaMask is available!");
  
        // Request accounts
        const [selectedAccount] = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
  
        if (selectedAccount) {
          setAccount(selectedAccount);
          setIsConnected(true);
          console.log("Connected account:", selectedAccount);
        } else {
          console.error("No account selected");
        }
      } else {
        alert("MetaMask is not installed. Please install MetaMask.");
        console.error("MetaMask is not installed");
      }
    } catch (err) {
      console.error("Error connecting to MetaMask:", err);
      if (err.message) {
        console.error("Error message:", err.message);
      }
    }
  };
  

  // Function to fetch tasks from the smart contract
  const fetchTasks = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        "YOUR_CONTRACT_ADDRESS", // Replace with deployed contract address
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
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  // Function to complete a task
  const completeTask = async (taskId) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        "YOUR_CONTRACT_ADDRESS", // Replace with deployed contract address
        TaskManagerABI.abi,
        signer
      );
      const tx = await contract.completeTask(taskId);
      await tx.wait();
      alert("Task completed successfully");
    } catch (err) {
      console.error("Error completing task:", err);
    }
  };

  useEffect(() => {
    if (isConnected) {
      fetchTasks();
    }
  }, [isConnected]);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Task Dashboard</h2>

      {/* MetaMask Connection Button */}
      {!isConnected ? (
        <button
          onClick={connectMetaMask}
          className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition-all"
        >
          Connect to MetaMask
        </button>
      ) : (
        <div className="mb-4">
          <p className="text-green-500">Connected as: {account}</p>
        </div>
      )}

      {/* Task List */}
      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks available</p>
      ) : (
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="p-4 border border-gray-200 rounded-lg shadow"
            >
              <h3 className="text-xl font-semibold">{task.title}</h3>
              <p className="text-gray-700">{task.description}</p>
              <p className="text-gray-500">
                Reward: {ethers.utils.formatEther(task.reward)} ETH
              </p>
              <p>Status: {task.completed ? "Completed" : "Open"}</p>
              {!task.completed && (
                <button
                  onClick={() => completeTask(task.id)}
                  className="mt-2 px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-all"
                >
                  Complete Task
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskDashboard;
