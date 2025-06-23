import React, { useEffect, useRef } from "react";
import "./AnalogClock.css"; // You’ll add styles separately

const AnalogClock = () => {
  const hourRef = useRef();
  const minuteRef = useRef();
  const secondRef = useRef();

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();

      // Convert UTC time to IST (UTC+5:30)
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
    <div className="analog-clock-container">
      <h2>Analog Clock (IST)</h2>
      <div className="clock">
        <div className="clock-face">
          <div className="hour-hand" ref={hourRef}></div>
          <div className="minute-hand" ref={minuteRef}></div>
          <div className="second-hand" ref={secondRef}></div>
          <div className="center-circle"></div>
        </div>
      </div>
    </div>
  );
};

export default AnalogClock;