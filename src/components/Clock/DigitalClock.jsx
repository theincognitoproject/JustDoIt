import React, { useState, useEffect } from "react";

const DigitalClock = () => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
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

      const pad = (num) => String(num).padStart(2, "0");
      setTime(`${pad(ISTHours)}:${pad(ISTMinutes)}:${pad(ISTSeconds)}`);
    };

    updateTime(); // Initial run
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-white p-4 rounded-lg flex flex-col items-center justify-center h-full">
      <h2 className="text-xl font-bold mb-2">Digital Clock</h2>
      <div className="text-5xl font-mono">
        {time}
      </div>
    </div>
  );
};

export default DigitalClock;
