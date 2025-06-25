import React from 'react';
import Header from './components/header';
import TodoList from './components/TodoList';
import PomodoroTimer from './components/PomodoroTimer';
import AnalogClock from "./components/Clock/AnalogClock";
import DigitalClock from "./components/Clock/DigitalClock";
import ReminderTimer from './components/Remindertimer';
import Calendar from './components/Calender';
import MusicPlayer from './components/MusicPlayer';
import WeatherWidget from './components/WeatherWidget';

function App() {
  return (
    <div className="App p-4 sm:p-6 md:p-8 text-left w-full">
      <Header />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-fr gap-4 mt-4">
        
        <div className="glass-effect p-4 lg:col-span-2 lg:row-span-2"><TodoList /></div>
        <div className="glass-effect p-4 lg:col-span-2 lg:row-span-2"><Calendar /></div>

        <div className="glass-effect p-4 lg:col-span-1 lg:row-span-1"><PomodoroTimer /></div>
        <div className="glass-effect p-4 lg:col-span-1 lg:row-span-1"><ReminderTimer /></div>
        <div className="glass-effect p-4 lg:col-span-1 lg:row-span-1"><WeatherWidget /></div>
        
        <div className="glass-effect p-4 flex flex-col gap-4">
          <div className="h-1/2"><AnalogClock /></div>
          <div className="h-1/2"><DigitalClock /></div>
        </div>

        <div className="glass-effect p-4 lg:col-span-4 lg:row-span-1"><MusicPlayer /></div>
        
      </div>
      
    </div>
  );
}

export default App;