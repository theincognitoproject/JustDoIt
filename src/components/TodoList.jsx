import React, { useState, useEffect } from 'react';

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [taskTimerInput, setTaskTimerInput] = useState('');

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(savedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (taskInput.trim() !== "") {
      const newTask = {
        text: taskInput.trim(),
        timer: parseInt(taskTimerInput) * 60 || 0,
        completed: false,
        timerInterval: null,
      };
      setTasks([...tasks, newTask]);
      setTaskInput('');
      setTaskTimerInput('');
    } else {
      alert("Please enter a valid task.");
    }
  };

  const handleDeleteTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  const handleToggleComplete = (index) => {
    const newTasks = [...tasks];
    newTasks[index].completed = !newTasks[index].completed;
    if (newTasks[index].completed) {
      clearInterval(newTasks[index].timerInterval);
      newTasks[index].timerInterval = null;
    } else if (newTasks[index].timer > 0) {
      startTimer(index);
    }
    setTasks(newTasks);
  };

  const startTimer = (index) => {
    const newTasks = [...tasks];
    if (newTasks[index].timerInterval) {
      clearInterval(newTasks[index].timerInterval);
    }
    newTasks[index].timerInterval = setInterval(() => {
      setTasks(prevTasks => {
        const updatedTasks = [...prevTasks];
        if (updatedTasks[index].timer > 0) {
          updatedTasks[index].timer--;
        } else {
          clearInterval(updatedTasks[index].timerInterval);
          updatedTasks[index].timerInterval = null;
        }
        return updatedTasks;
      });
    }, 1000);
    setTasks(newTasks);
  };

  useEffect(() => {
    tasks.forEach((task, index) => {
      if (!task.completed && task.timer > 0 && !task.timerInterval) {
        startTimer(index);
      }
    });

    return () => {
      tasks.forEach(task => {
        if (task.timerInterval) {
          clearInterval(task.timerInterval);
        }
      });
    };
  }, [tasks]); // Re-run effect when tasks change

  return (
    <div className="text-white rounded-lg h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4 text-center">To-Do List</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          id="taskInput"
          placeholder="Add a new task"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          className="flex-grow p-2 rounded-lg bg-transparent border border-gray-400 focus:outline-none focus:border-white"
        />
        <input
          type="number"
          id="taskTimer"
          placeholder="Timer (min)"
          value={taskTimerInput}
          onChange={(e) => setTaskTimerInput(e.target.value)}
          className="w-24 p-2 rounded-lg bg-transparent border border-gray-400 focus:outline-none focus:border-white"
        />
        <button 
          onClick={handleAddTask} 
          className="p-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 border border-gray-400"
        >
          Add
        </button>
      </div>
      <ul id="taskList" className="space-y-2 overflow-y-auto flex-grow">
        {tasks.map((task, index) => (
          <li key={index} className="flex items-center justify-between p-2 rounded-lg bg-white bg-opacity-10">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleComplete(index)}
                className="form-checkbox h-5 w-5 text-pink-500 bg-transparent rounded border-gray-400 focus:ring-pink-500"
              />
              <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                {task.text}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {!task.completed && task.timer > 0 && (
                <span>
                  {`${Math.floor(task.timer / 60)}m ${task.timer % 60}s`}
                </span>
              )}
               {!task.completed && task.timer === 0 && task.timerInterval === null && (
                  <span className="text-red-500">Time's up!</span>
              )}
              <button 
                onClick={() => handleDeleteTask(index)} 
                className="p-1 rounded-full bg-red-500 hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;