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
    <div>
      <h2>Todo List</h2>
      <input
        type="text"
        id="taskInput"
        placeholder="Add a new task"
        value={taskInput}
        onChange={(e) => setTaskInput(e.target.value)}
      />
      <input
        type="number"
        id="taskTimer"
        placeholder="Timer in minutes (optional)"
        value={taskTimerInput}
        onChange={(e) => setTaskTimerInput(e.target.value)}
      />
      <button onClick={handleAddTask}>Add Task</button>
      <ul id="taskList">
        {tasks.map((task, index) => (
          <li key={index}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleToggleComplete(index)}
            />
            <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
              {task.text}
            </span>
            {!task.completed && task.timer > 0 && (
              <span>
                {` ${Math.floor(task.timer / 60)} min ${task.timer % 60} sec`}
              </span>
            )}
             {!task.completed && task.timer === 0 && task.timerInterval === null && (
                <span>Time's up!</span>
            )}
            <button onClick={() => handleDeleteTask(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;