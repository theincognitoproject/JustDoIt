import React, { useEffect, useRef } from "react";

const AnalogClock = () => {
  const hourRef = useRef();
  const minuteRef = useRef();
  const secondRef = useRef();

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();

      let ISTHours = now.getUTCHours() + 5;
      let ISTMinutes = now.getUTCMinutes() + 30;
      let ISTSeconds = now.getUTCSeconds();

      if (ISTMinutes >= 60) {
        ISTMinutes -= 60;
        ISTHours += 1;
      }
      if (ISTHours >= 24) {
        ISTHours -= 24;
      }

      const secondDeg = (ISTSeconds / 60) * 360;
      const minuteDeg = ((ISTMinutes + ISTSeconds / 60) / 60) * 360;
      const hourDeg = ((ISTHours % 12 + ISTMinutes / 60) / 12) * 360;

      secondRef.current.style.transform = `translate(-50%, -100%) rotate(${secondDeg}deg)`;
      minuteRef.current.style.transform = `translate(-50%, -100%) rotate(${minuteDeg}deg)`;
      hourRef.current.style.transform = `translate(-50%, -100%) rotate(${hourDeg}deg)`;
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-white p-4 rounded-lg flex flex-col items-center justify-center">
      <h2 className="text-xl font-bold mb-2">Analog Clock</h2>
      <div className="relative w-40 h-40">
        {/* Clock Face */}
        <div className="w-full h-full rounded-full border-2 border-white border-opacity-30"></div>
        
        {/* Numbers */}
        {[...Array(12)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-full h-full"
            style={{ transform: `rotate(${(i + 1) * 30}deg)` }}
          >
            <span 
              className="absolute top-1 left-1/2 -translate-x-1/2 text-xs"
              style={{ transform: `rotate(-${(i + 1) * 30}deg)` }}
            >
              {i + 1}
            </span>
          </div>
        ))}

        {/* Hour Hand */}
        <div
          ref={hourRef}
          className="absolute w-1 h-12 bg-white top-1/2 left-1/2 origin-bottom"
          style={{ transform: 'translate(-50%, -100%) rotate(0deg)' }}
        ></div>
        {/* Minute Hand */}
        <div
          ref={minuteRef}
          className="absolute w-0.5 h-16 bg-white top-1/2 left-1/2 origin-bottom"
          style={{ transform: 'translate(-50%, -100%) rotate(0deg)' }}
        ></div>
        {/* Second Hand */}
        <div
          ref={secondRef}
          className="absolute w-px h-20 bg-red-500 top-1/2 left-1/2 origin-bottom"
          style={{ transform: 'translate(-50%, -100%) rotate(0deg)' }}
        ></div>
        {/* Center Circle */}
        <div className="absolute w-2 h-2 bg-white rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>
    </div>
  );
};

export default AnalogClock;
