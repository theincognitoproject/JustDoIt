import React, { useState, useEffect } from 'react';

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

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
    <div id="calendarContainer">
      <div id="header">
        <div id="monthDisplay">{new Date(new Date().setMonth(new Date().getMonth() + nav)).toLocaleDateString('en-us', { month: 'long', year: 'numeric' })}</div>
        <div>
          <button onClick={() => setNav(nav - 1)} id="backButton">Back</button>
          <button onClick={() => setNav(nav + 1)} id="nextButton">Next</button>
        </div>
      </div>

      <div id="weekdays">
        {weekdays.map(wd => <div key={wd}>{wd}</div>)}
      </div>

      <div id="calendar">
        {days.map((day, index) => (
          <div
            key={index}
            className={`day ${day.value === 'padding' ? 'padding' : ''} ${day.isCurrentDay ? 'currentDay' : ''}`}
            onClick={() => day.value !== 'padding' && openModal(day.date)}
          >
            {day.value !== 'padding' ? day.value : ''}
            {day.event && <div className="event">{day.event}</div>}
          </div>
        ))}
      </div>

      {clicked && !eventForDate && (
        <div id="newEventModal" className="modal">
          <h2>New Event</h2>
          <input
            id="eventTitleInput"
            placeholder="Event Title"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
          />
          <button id="saveButton" onClick={saveEvent}>Save</button>
          <button id="cancelButton" onClick={closeModal}>Cancel</button>
        </div>
      )}

      {clicked && eventForDate && (
        <div id="deleteEventModal" className="modal">
          <h2>Event</h2>
          <p id="eventText">{eventForDate.title}</p>
          <button id="deleteButton" onClick={deleteEvent}>Delete</button>
          <button id="closeButton" onClick={closeModal}>Close</button>
        </div>
      )}

      {clicked && (
        <div id="modalBackDrop" className="backdrop" onClick={closeModal}></div>
      )}
    </div>
  );
}

export default Calendar;


