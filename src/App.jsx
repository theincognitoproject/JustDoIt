import React from 'react';
import Header from './components/Header';
import TodoList from './components/TodoList';
import PomodoroTimer from './components/PomodoroTimer';
import { AnalogClock, DigitalClock } from './components/Clock';
import ReminderTimer from './components/ReminderTimer';
import Calendar from './components/Calendar';
import MusicPlayer from './components/MusicPlayer';
import GoalList from './components/GoalList';
import WeatherWidget from './components/WeatherWidget';
import AboutSection from './components/AboutSection';

function App() {
  return (
    <div className="App">
      <Header />
      
      <div className="container-wrapper">
        <TodoList />
        <PomodoroTimer />
        
        <div className="container">
          <AnalogClock />
          <DigitalClock />
          <WeatherWidget />
        </div>
        
        <ReminderTimer />
      </div>
      
      <div className="con-wrapper">
        <Calendar />
        <MusicPlayer />
        <GoalList />
      </div>
      
      <AboutSection />
    </div>
  );
}

export default App;