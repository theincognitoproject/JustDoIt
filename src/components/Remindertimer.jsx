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
    } else {
      alert("Please enter a valid time limit (at least 1 minute).");
    }
  };

  return (
    <div className="bg-gradient-to-b from-[rgba(32,1,34,0.5)] to-[rgba(111,0,0,0.5)] rounded-lg shadow-lg p-5 w-full md:w-[calc(20%-20px)] mb-5">
      <div className="mt-4 text-center">
        <h2 className="text-2xl font-josefin text-center mb-4 text-white">Reminder</h2>
        
        {/* Timer settings */}
        <div className="mb-6">
          <label htmlFor="custom-minutes" className="mr-2 text-lg">Set Reminder Time:</label>
          <input 
            type="number" 
            id="custom-minutes" 
            className="w-20 p-2 bg-[rgba(32,1,34,0.25)] text-white rounded mb-2 focus:outline-none focus:ring-2 focus:ring-white/30"
            min="1" 
            value={minutesInput}
            onChange={(e) => setMinutesInput(parseInt(e.target.value))}
          />
          <button 
            className="ml-2 bg-[rgba(32,1,34,0.5)] hover:bg-[#200122] text-white border-none py-2 px-4 cursor-pointer rounded transition-colors"
            onClick={applyCustomTime}
          >
            Apply
          </button>
        </div>
        
        {/* Clock display */}
        <div className="relative w-44 h-44 mx-auto mb-8">
          {/* Circle background */}
          <div className="absolute w-full h-full border-2 border-white/30 rounded-full"></div>
          
          {/* Timer display */}
          <div className="absolute w-full h-full flex items-center justify-center">
            <div className="flex items-center text-5xl font-bold">
              <div>
                {time.minutes < 10 ? `0${time.minutes}` : time.minutes}
              </div>
              <div className="mx-1">:</div>
              <div>
                {time.seconds < 10 ? `0${time.seconds}` : time.seconds}
              </div>
            </div>
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex justify-center space-x-4 mt-16">
          <button 
            className="bg-green-600/70 hover:bg-green-700 text-white border-none py-2 px-6 cursor-pointer rounded transition-colors"
            onClick={startTimer}
          >
            Start
          </button>
          <button 
            className="bg-red-600/70 hover:bg-red-700 text-white border-none py-2 px-6 cursor-pointer rounded transition-colors"
            onClick={stopTimer}
          >
            Stop
          </button>
          <button 
            className="bg-red-600/70 hover:bg-red-700 text-white border-none py-2 px-6 cursor-pointer rounded transition-colors"
            onClick={resetTimer}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Alarm sound */}
      <audio ref={alarmRef} src="https://www.soundjay.com/button/beep-07.wav" preload="auto" />
    </div>
  );
}

export default ReminderTimer;
