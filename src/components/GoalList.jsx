import React, { useState, useEffect } from "react";
import axios from "axios";

const GoalList = () => {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState("");

  // Fetch goals from server on load
  useEffect(() => {
    axios.get("/api/goals")
      .then(res => setGoals(res.data))
      .catch(err => console.error("Error fetching goals:", err));
  }, []);

  // Add goal to server
  const addGoal = async () => {
    if (!newGoal.trim()) return alert("Please enter a goal.");
    const res = await axios.post("/api/goals", { goal: newGoal });
    setGoals(res.data);
    setNewGoal("");
  };

  // Delete goal from server
  const deleteGoal = async (goalToDelete) => {
    const res = await axios.delete(`/api/goals/${encodeURIComponent(goalToDelete)}`);
    setGoals(res.data);
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 rounded-xl shadow-lg bg-gray-900 text-white">
      <h2 className="text-3xl font-bold mb-6 text-center">🎯 Goal List</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          placeholder="Type a new goal..."
          className="flex-1 px-4 py-2 rounded-md text-black focus:outline-none"
        />
        <button
          onClick={addGoal}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
        >
          Add
        </button>
      </div>

      <ul className="space-y-3">
        {goals.length === 0 ? (
          <li className="text-gray-400 italic text-center">No goals yet. Start adding!</li>
        ) : (
          goals.map((goal, index) => (
            <li
              key={index}
              className="flex justify-between items-center bg-gray-800 px-4 py-2 rounded-md shadow-sm"
            >
              <span>{goal}</span>
              <button
                onClick={() => deleteGoal(goal)}
                className="text-sm bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md"
              >
                Delete
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default GoalList;
