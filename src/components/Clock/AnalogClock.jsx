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

      if (hourRef.current) hourRef.current.style.transform = `rotate(${hourDeg}deg)`;
      if (minuteRef.current) minuteRef.current.style.transform = `rotate(${minuteDeg}deg)`;
      if (secondRef.current) secondRef.current.style.transform = `rotate(${secondDeg}deg)`;
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center mt-10">
      <h2 className="text-3xl font-bold text-white mb-6">Analog Clock (IST)</h2>

      <div className="relative w-80 h-80 bg-black border-4 border-white rounded-full shadow-lg">
        {/* Numbers */}
        {[...Array(12)].map((_, i) => {
          const angle = (i + 1) * 30;
          return (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 text-white text-sm font-bold"
              style={{
                transform: `rotate(${angle}deg) translate(0, -110px) rotate(-${angle}deg)`,
                transformOrigin: "center",
              }}
            >
              {i + 1}
            </div>
          );
        })}

        {/* Hour Hand */}
        <div
          ref={hourRef}
          className="absolute top-1/2 left-1/2 w-[8px] h-24 bg-white rounded-sm z-30"
          style={{
            transform: "rotate(0deg) translate(-50%, -100%)",
            transformOrigin: "bottom center",
          }}
        ></div>

        {/* Minute Hand */}
        <div
          ref={minuteRef}
          className="absolute top-1/2 left-1/2 w-[6px] h-28 bg-white rounded-sm z-40"
          style={{
            transform: "rotate(0deg) translate(-50%, -100%)",
            transformOrigin: "bottom center",
          }}
        ></div>

        {/* Second Hand */}
        <div
          ref={secondRef}
          className="absolute top-1/2 left-1/2 w-[2px] h-32 bg-red-500 z-50"
          style={{
            transform: "rotate(0deg) translate(-50%, -100%)",
            transformOrigin: "bottom center",
          }}
        ></div>

        {/* Center Dot */}
        <div className="absolute w-4 h-4 bg-white rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"></div>
      </div>
    </div>
  );
};

export default AnalogClock;









