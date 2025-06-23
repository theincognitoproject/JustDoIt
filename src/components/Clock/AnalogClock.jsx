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
    <div className="text-center mt-10">
      <h2 className="text-2xl font-semibold text-white mb-4">Analog Clock (IST)</h2>
      <div className="relative w-40 h-40 mx-auto rounded-full border-4 border-white bg-black shadow-inner">
        {/* Hour Hand */}
        <div
          ref={hourRef}
          className="absolute w-1 h-16 bg-white top-1/2 left-1/2 origin-bottom transform -translate-x-1/2 -translate-y-full"
        ></div>
        {/* Minute Hand */}
        <div
          ref={minuteRef}
          className="absolute w-0.5 h-20 bg-white top-1/2 left-1/2 origin-bottom transform -translate-x-1/2 -translate-y-full"
        ></div>
        {/* Second Hand */}
        <div
          ref={secondRef}
          className="absolute w-px h-24 bg-red-500 top-1/2 left-1/2 origin-bottom transform -translate-x-1/2 -translate-y-full"
        ></div>
        {/* Center Circle */}
        <div className="absolute w-3 h-3 bg-gray-300 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"></div>
      </div>
    </div>
  );
};

export default AnalogClock;
