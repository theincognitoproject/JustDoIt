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
    <div className="bg-gradient-to-b from-[rgba(32,1,34,0.5)] to-[rgba(111,0,0,0.5)] rounded-lg shadow-lg p-5 w-full md:w-[calc(20%-20px)] mb-5">
      <section>
        <div>
          <h2 className="text-2xl font-josefin text-center mb-4 text-white">Pomodoro</h2>
          
          {/* Work/Break Panel */}
          <div className="grid grid-cols-2 text-center w-20 mx-auto my-5 p-1 rounded-full shadow-[0px_0px_15px_10px_rgba(0,0,0,0.3)]">
            <p className={`opacity-50 transition-opacity ${timerState === 'work' ? 'opacity-100 text-[#ff6b6b]' : ''}`}>work</p>
            <p className={`opacity-50 transition-opacity ${timerState === 'break' ? 'opacity-100 text-[#ff6b6b]' : ''}`}>break</p>
          </div>
          
          {/* Timer Circle */}
          <div className="flex justify-center items-center w-20 h-20 mx-auto shadow-[0px_0px_15px_10px_rgba(0,0,0,0.3)] rounded-full">
            <div className="flex justify-center items-center w-15 h-15 rounded-full bg-[#ff6b6b] relative">
              <div className="absolute w-[95%] h-[95%] rounded-full bg-[rgba(32,1,34,0.5)]"></div>
              <div className="relative flex flex-row text-3xl">
                <p>{minutes < 10 ? `0${minutes}` : minutes}</p>
                <p className="relative top-[-0.5rem] mx-1">:</p>
                <p>{seconds < 10 ? `0${seconds}` : seconds}</p>
              </div>
            </div>
          </div>
          
          {/* Controls */}
          <div className="mt-3 text-center">
            {!isActive ? (
              <button 
                className="border-none bg-transparent cursor-pointer text-white"
                onClick={startTimer}
              >
                <i className="fa-solid fa-play text-3xl"></i>
              </button>
            ) : (
              <button 
                className="border-none bg-transparent cursor-pointer text-white"
                onClick={resetTimer}
              >
                <i className="fa-solid fa-arrow-rotate-left text-3xl"></i>
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default PomodoroTimer;