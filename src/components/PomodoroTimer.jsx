// src/components/PomodoroTimer.jsx
import React, { useState, useEffect } from 'react';

function PomodoroTimer() {
  const [timerState, setTimerState] = useState('work'); // 'work' or 'break'
  const [minutes, setMinutes] = useState(50);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [breakCount, setBreakCount] = useState(0);

  const workTime = 50;
  const breakTime = 10;

  useEffect(() => {
    let interval = null;
    
    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Timer finished, toggle between work and break
            const audio = document.getElementById('audioAlert');
            if (audio) audio.play();
            
            if (timerState === 'work') {
              setTimerState('break');
              setMinutes(breakTime - 1);
              setBreakCount(prevCount => prevCount + 1);
            } else {
              setTimerState('work');
              setMinutes(workTime - 1);
              setBreakCount(prevCount => prevCount + 1);
            }
            setSeconds(59);
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, timerState]);

  const startTimer = () => {
    setIsActive(true);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimerState('work');
    setMinutes(workTime);
    setSeconds(0);
    setBreakCount(0);
  };

  return (
    <div className="text-white rounded-lg flex flex-col items-center justify-center h-full">
      <h2 className="text-2xl font-bold mb-4">Pomodoro</h2>
      
      {/* Work/Break Toggles */}
      <div className="flex gap-4 mb-4">
        <button 
          onClick={() => setTimerState('work')}
          className={`px-4 py-1 rounded-full transition-colors ${timerState === 'work' ? 'bg-white text-black' : 'bg-white bg-opacity-20'}`}
        >
          Work
        </button>
        <button 
          onClick={() => setTimerState('break')}
          className={`px-4 py-1 rounded-full transition-colors ${timerState === 'break' ? 'bg-white text-black' : 'bg-white bg-opacity-20'}`}
        >
          Break
        </button>
      </div>
      
      {/* Timer Display */}
      <div className="w-48 h-48 rounded-full border-4 border-white border-opacity-30 flex items-center justify-center mb-4">
        <p className="text-5xl font-mono">
          {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </p>
      </div>
      
      {/* Controls */}
      <div className="flex gap-4">
        {!isActive ? (
          <button 
            className="px-6 py-2 rounded-lg bg-green-500 hover:bg-green-600 transition-colors text-white font-bold"
            onClick={startTimer}
          >
            Start
          </button>
        ) : (
          <button 
            className="px-6 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition-colors text-white font-bold"
            onClick={() => setIsActive(false)} // Just pause, not reset
          >
            Pause
          </button>
        )}
        <button 
          className="px-6 py-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors text-white"
          onClick={resetTimer}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default PomodoroTimer;