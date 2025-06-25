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
      <h2 className="text-2xl font-bold mb-4">Analog Clock (IST)</h2>

      <div className="relative w-64 h-64 rounded-full border-4 border-white bg-gray-900 shadow-md">
        {/* Clock Numbers */}
        {[...Array(12)].map((_, i) => {
          const angle = (i + 1) * 30;
          return (
            <div
              key={i}
              className="absolute top-1/2 left-1/2"
              style={{
                transform: `
                  rotate(${angle}deg)
                  translate(0, -110px)
                  rotate(-${angle}deg)
                `,
                transformOrigin: "center",
              }}
            >
              <span className="text-white text-sm font-semibold">{i + 1}</span>
            </div>
          );
        })}

        {/* Hour Hand */}
        <div
          ref={hourRef}
          className="absolute w-2 h-20 bg-white top-1/2 left-1/2 origin-bottom transform -translate-x-1/2 -translate-y-full transition-transform duration-300 ease-in-out"
        ></div>

        {/* Minute Hand */}
        <div
          ref={minuteRef}
          className="absolute w-[3px] h-28 bg-white top-1/2 left-1/2 origin-bottom transform -translate-x-1/2 -translate-y-full transition-transform duration-300 ease-in-out"
        ></div>

        {/* Second Hand */}
        <div
          ref={secondRef}
          className="absolute w-px h-32 bg-red-500 top-1/2 left-1/2 origin-bottom transform -translate-x-1/2 -translate-y-full transition-transform duration-100 ease-linear"
        ></div>

        {/* Center Circle */}
        <div className="absolute w-4 h-4 bg-white rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"></div>
      </div>
    </div>
  );
};

export default AnalogClock;

