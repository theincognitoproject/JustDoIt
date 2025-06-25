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

      if (secondRef.current) secondRef.current.style.transform = `rotate(${secondDeg}deg)`;
      if (minuteRef.current) minuteRef.current.style.transform = `rotate(${minuteDeg}deg)`;
      if (hourRef.current) hourRef.current.style.transform = `rotate(${hourDeg}deg)`;
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center mt-10 mb-12">
      <h2 className="text-2xl font-bold text-white mb-6">Analog Clock (IST)</h2>

      <div className="relative w-64 h-64 bg-black border-[6px] border-white rounded-full shadow-xl">
        {/* Clock Numbers */}
        {[...Array(12)].map((_, i) => {
          const angle = (i + 1) * 30;
          return (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 text-white text-sm font-semibold"
              style={{
                transform: `
                  rotate(${angle}deg)
                  translate(0, -110px)
                  rotate(-${angle}deg)
                `,
                transformOrigin: "center",
              }}
            >
              {i + 1}
            </div>
          );
        })}

        {/* Hands */}
        <div
          ref={hourRef}
          className="absolute top-1/2 left-1/2 w-[6px] h-20 bg-white origin-bottom z-20"
          style={{ transform: "rotate(0deg)", transformOrigin: "bottom" }}
        ></div>

        <div
          ref={minuteRef}
          className="absolute top-1/2 left-1/2 w-[3px] h-28 bg-white origin-bottom z-20"
          style={{ transform: "rotate(0deg)", transformOrigin: "bottom" }}
        ></div>

        <div
          ref={secondRef}
          className="absolute top-1/2 left-1/2 w-[2px] h-32 bg-red-500 origin-bottom z-30"
          style={{ transform: "rotate(0deg)", transformOrigin: "bottom" }}
        ></div>

        {/* Center Circle */}
        <div className="absolute w-4 h-4 bg-white rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40"></div>
      </div>
    </div>
  );
};

export default AnalogClock;




