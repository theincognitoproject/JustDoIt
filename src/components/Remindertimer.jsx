// src/components/ReminderTimer.jsx
import React, { useState, useEffect, useRef } from 'react';

function ReminderTimer() {
  const [minutesInput, setMinutesInput] = useState(25);
  const [time, setTime] = useState({ minutes: 25, seconds: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const alarmRef = useRef(null);

  useEffect(() => {
    let interval = null;

    if (isRunning) {
      interval = setInterval(() => {
        if (time.seconds > 0) {
          setTime(prevTime => ({
            ...prevTime,
            seconds: prevTime.seconds - 1
          }));
        } else if (time.minutes > 0) {
          setTime(prevTime => ({
            minutes: prevTime.minutes - 1,
            seconds: 59
          }));
        } else {
          clearInterval(interval);
          setIsRunning(false);
          if (alarmRef.current) {
            alarmRef.current.play();
          }
          alert("Time's up! Have you completed the task?");
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, time]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTime({ minutes: minutesInput, seconds: 0 });
  };

  const applyCustomTime = () => {
    if (minutesInput >= 1) {
      setTime({ minutes: minutesInput, seconds: 0 });
      setIsRunning(false);
    } else {
      alert("Please enter a valid time limit (at least 1 minute).");
    }
  };

  return (
    <div className="text-white rounded-lg flex flex-col items-center justify-center h-full">
      <h2 className="text-2xl font-bold mb-4">Reminder</h2>
      
      {/* Timer settings */}
      <div className="flex gap-2 items-center mb-4">
        <input 
          type="number" 
          id="custom-minutes" 
          className="w-24 p-2 rounded-lg bg-transparent border border-gray-400 focus:outline-none focus:border-white text-center"
          min="1" 
          value={minutesInput}
          onChange={(e) => setMinutesInput(parseInt(e.target.value))}
        />
        <button 
          className="px-4 py-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors"
          onClick={applyCustomTime}
        >
          Set Time
        </button>
      </div>
      
      {/* Clock display */}
      <div className="w-48 h-48 rounded-full border-4 border-white border-opacity-30 flex items-center justify-center mb-4">
        <p className="text-5xl font-mono">
          {time.minutes < 10 ? `0${time.minutes}` : time.minutes}:{time.seconds < 10 ? `0${time.seconds}` : time.seconds}
        </p>
      </div>
      
      {/* Controls */}
      <div className="flex justify-center space-x-4">
        <button 
          className="px-6 py-2 rounded-lg bg-green-500 hover:bg-green-600 transition-colors text-white font-bold disabled:bg-gray-500"
          onClick={startTimer}
          disabled={isRunning}
        >
          Start
        </button>
        <button 
          className="px-6 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 transition-colors text-white font-bold disabled:bg-gray-500"
          onClick={stopTimer}
          disabled={!isRunning}
        >
          Stop
        </button>
        <button 
          className="px-6 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition-colors text-white font-bold"
          onClick={resetTimer}
        >
          Reset
        </button>
      </div>

      {/* Alarm sound */}
      <audio ref={alarmRef} src="https://www.soundjay.com/button/beep-07.wav" preload="auto" />
    </div>
  );
}

export default ReminderTimer;
