import React, { useState, useEffect } from 'react';

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [taskTimerInput, setTaskTimerInput] = useState('');
  const [tick, setTick] = useState(0); // for triggering re-renders

  // Load tasks from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(saved);
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Global ticking interval every 1 second
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1); // trigger re-render every second
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getRemainingTime = (task) => {
    if (!task.startTime || task.completed) return 0;
    const elapsed = Math.floor((Date.now() - task.startTime) / 1000);
    return Math.max(task.duration - elapsed, 0);
  };

  const handleAddTask = () => {
    const minutes = parseInt(taskTimerInput);
    if (taskInput.trim() === '') {
      alert('Please enter a task.');
      return;
    }

    const newTask = {
      text: taskInput.trim(),
      duration: isNaN(minutes) ? 0 : minutes * 60,
      startTime: isNaN(minutes) ? null : Date.now(),
      completed: false,
    };

    setTasks((prev) => [...prev, newTask]);
    setTaskInput('');
    setTaskTimerInput('');
  };

  const handleDeleteTask = (index) => {
    const updated = tasks.filter((_, i) => i !== index);
    setTasks(updated);
  };

  const handleToggleComplete = (index) => {
    const updated = [...tasks];
    updated[index].completed = !updated[index].completed;
    setTasks(updated);
  };

  return (
    <div className="text-white rounded-lg h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4 text-center">To-Do List</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Add a new task"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          className="flex-grow p-2 rounded-lg bg-transparent border border-gray-400 focus:outline-none focus:border-white"
        />
        <input
          type="number"
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

      <ul className="space-y-2 overflow-y-auto flex-grow">
        {tasks.map((task, index) => {
          const remaining = getRemainingTime(task);
          return (
            <li
              key={index}
              className="flex justify-between items-center p-2 rounded-lg bg-white bg-opacity-10"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleComplete(index)}
                  className="form-checkbox h-5 w-5 text-pink-500 bg-transparent rounded border-gray-400 focus:ring-pink-500"
                />
                <span className={task.completed ? 'line-through text-gray-400' : ''}>
                  {task.text}
                </span>
              </div>
              <div className="flex items-center gap-3">
                {!task.completed && task.duration > 0 && remaining > 0 && (
                  <span>
                    {`${Math.floor(remaining / 60)}m ${remaining % 60}s`}
                  </span>
                )}
                {!task.completed && task.duration > 0 && remaining === 0 && (
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
          );
        })}
      </ul>
    </div>
  );
};

export default TodoList;





