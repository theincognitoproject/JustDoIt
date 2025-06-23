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
    <div className="text-center mt-12">
      <h2 className="text-2xl font-bold text-white mb-3">🕒 Digital Clock (IST)</h2>
      <div className="bg-gray-900 text-green-400 text-4xl font-mono px-8 py-4 rounded-lg shadow-md inline-block">
        {time}
      </div>
    </div>
  );
};

export default DigitalClock;
