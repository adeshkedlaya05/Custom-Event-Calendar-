import React, { useState, useEffect } from 'react';
import Navbar from './components/navbar';
import MonthlyView from './components/calender';

export default function CalendarPage() {
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('calenderEvents');
    return saved ? JSON.parse(saved) : [];
  });

  const [filteredEvents, setFilteredEvents] = useState(events);

  useEffect(() => {
    setFilteredEvents(events); // Reset filter when original events change
  }, [events]);

  const handleFilter = (filtered) => {
    setFilteredEvents(filtered);
  };

  return (
    <>
      <Navbar events={events} onFilter={handleFilter} />
      <MonthlyView events={filteredEvents} setEvents={setEvents} />

    </>
  );
}
