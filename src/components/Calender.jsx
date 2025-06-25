import React, { useState, useEffect } from 'react';

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const shortWeekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function Calendar() {
  const [nav, setNav] = useState(0);
  const [clicked, setClicked] = useState(null);
  const [events, setEvents] = useState(localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : []);
  const [eventTitle, setEventTitle] = useState('');

  const eventForDate = events.find(e => e.date === clicked);

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const openModal = (date) => {
    setClicked(date);
  };

  const closeModal = () => {
    setClicked(null);
    setEventTitle('');
  };

  const saveEvent = () => {
    if (eventTitle) {
      setEvents([...events, { date: clicked, title: eventTitle }]);
      closeModal();
    }
  };

  const deleteEvent = () => {
    setEvents(events.filter(e => e.date !== clicked));
    closeModal();
  };

  const loadCalendar = () => {
    const dt = new Date();

    if (nav !== 0) {
      dt.setMonth(new Date().getMonth() + nav);
    }

    const day = dt.getDate();
    const month = dt.getMonth();
    const year = dt.getFullYear();

    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
      weekday: 'long',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
    const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

    const daysArr = [];

    for(let i = 1; i <= paddingDays + daysInMonth; i++) {
      const dayString = `${month + 1}/${i - paddingDays}/${year}`;

      if (i > paddingDays) {
        const eventForDay = events.find(e => e.date === dayString);

        daysArr.push({
          value: i - paddingDays,
          event: eventForDay ? eventForDay.title : null,
          isCurrentDay: i - paddingDays === day && nav === 0,
          date: dayString,
        });
      } else {
        daysArr.push({
          value: 'padding',
          event: null,
          isCurrentDay: false,
          date: '',
        });
      }
    }
    return daysArr;
  };

  const days = loadCalendar();

  return (
    <div className="text-white rounded-lg w-full max-w-md mx-auto h-full flex flex-col">
      <div id="header" className="flex justify-between items-center mb-4">
        <div id="monthDisplay" className="text-xl font-bold">
          {new Date(new Date().setMonth(new Date().getMonth() + nav)).toLocaleDateString('en-us', { month: 'long', year: 'numeric' })}
        </div>
        <div className="flex gap-2">
          <button onClick={() => setNav(nav - 1)} id="backButton" className="px-3 py-1 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30">Back</button>
          <button onClick={() => setNav(nav + 1)} id="nextButton" className="px-3 py-1 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30">Next</button>
        </div>
      </div>

      <div id="weekdays" className="grid grid-cols-7 gap-2 text-center text-sm mb-2">
        {shortWeekdays.map(wd => <div key={wd}>{wd}</div>)}
      </div>

      <div id="calendar" className="grid grid-cols-7 gap-2 flex-grow">
        {days.map((day, index) => (
          <div
            key={index}
            className={`day h-12 flex items-center justify-center rounded-lg cursor-pointer transition-colors
              ${day.value === 'padding' ? 'opacity-0' : 'hover:bg-white hover:bg-opacity-10'}
              ${day.isCurrentDay ? 'bg-pink-500' : ''}
              ${day.event ? 'bg-blue-500 bg-opacity-50' : ''}`}
            onClick={() => day.value !== 'padding' && openModal(day.date)}
          >
            {day.value !== 'padding' ? day.value : ''}
            {day.event && <div className="event absolute text-xs mt-6 p-1 bg-blue-600 rounded-md">{day.event}</div>}
          </div>
        ))}
      </div>

      {clicked && (
        <>
          <div id="modalBackDrop" className="fixed inset-0 bg-black bg-opacity-50 z-10" onClick={closeModal}></div>
          <div id="eventModal" className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 glass-effect p-6 rounded-lg z-20 w-80">
            {eventForDate ? (
              <>
                <h2 className="text-xl font-bold mb-4">Event Details</h2>
                <p id="eventText" className="mb-4">{eventForDate.title}</p>
                <div className="flex justify-end gap-2">
                  <button id="deleteButton" onClick={deleteEvent} className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600">Delete</button>
                  <button id="closeButton" onClick={closeModal} className="px-4 py-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30">Close</button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-4">New Event</h2>
                <input
                  id="eventTitleInput"
                  placeholder="Event Title"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full p-2 mb-4 rounded-lg bg-transparent border border-gray-400 focus:outline-none focus:border-white"
                />
                <div className="flex justify-end gap-2">
                  <button id="saveButton" onClick={saveEvent} className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600">Save</button>
                  <button id="cancelButton" onClick={closeModal} className="px-4 py-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30">Cancel</button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Calendar;


