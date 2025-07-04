import React, { useState, useEffect } from 'react';
import Clock from 'react-clock';
import 'react-clock/dist/Clock.css';

const AnalogClockComponent = () => {
  const [value, setValue] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setValue(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        minHeight: 300,
        minWidth: 300,
        background: 'none',
      }}
    >
      <div
        style={{
          background: 'transparent',
          borderRadius: '50%',
          width: 300,
          height: 300,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: 'none',
        }}
      >
        <Clock
          value={value}
          renderNumbers={true}
          hourHandWidth={5}
          minuteHandWidth={3}
          secondHandWidth={1}
          // Inline styles for the clock face
          clockProps={{
            style: {
              background: 'transparent',
              border: '2px solid #2e2e2e',
              boxShadow: 'none',
            }
          }}
          // Inline styles for the hour hand
          hourHandProps={{
            style: {
              stroke: '#ffffff'
            }
          }}
          // Inline styles for the minute hand
          minuteHandProps={{
            style: {
              stroke: '#FFFFFF'
            }
          }}
          // Inline styles for the second hand
          secondHandProps={{
            style: {
              stroke: '#d81c7a'
            }
          }}
        />
      </div>
    </div>
  );
};

export default AnalogClockComponent;