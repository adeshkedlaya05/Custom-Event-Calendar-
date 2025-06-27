import React, { useEffect, useState, useRef } from 'react';
import moment from 'moment';
import EventForm from './Eventform';
import { enableDrag } from '../utils/drag';
import { genrateReccuringEvents } from '../utils/reccurance';

const MonthlyView = ({ events, setEvents }) => {
  const [modifiedInstances, setModifiedInstances] = useState(() => {
    const saved = localStorage.getItem('modifiedInstances');
    return saved ? JSON.parse(saved) : [];
  });
  useEffect(() => {
    localStorage.setItem('modifiedInstances', JSON.stringify(modifiedInstances));
  }, [modifiedInstances]);

  const [CurrentMonth, SetCurrentMonth] = useState(moment());
  const [deletedInstanceIds, setDeletedInstanceIds] = useState(() => {
    const saved = localStorage.getItem('deletedInstanceIds');
    return saved ? JSON.parse(saved) : [];
  });

  const [previewEvent, setPreviewEvent] = useState(null); 

  useEffect(() => {
    enableDrag(setEvents, events, CurrentMonth, setModifiedInstances, modifiedInstances);
  }, [events, CurrentMonth, modifiedInstances]);

  const allEvents = events
    .flatMap(e => genrateReccuringEvents(e))
    .filter(e => !deletedInstanceIds.includes(e.id))
    .map(e => {
      const modified = modifiedInstances.find(m => m.id === e.id);
      return modified ? modified : e;
    });

  const [selectedDate, setSelectedDate] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showConflictDialog, setShowConflictDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    localStorage.setItem('calenderEvents', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('deletedInstanceIds', JSON.stringify(deletedInstanceIds));
  }, [deletedInstanceIds]);

  const Start = CurrentMonth.clone().startOf('month');
  const Calenderstart = Start.clone().startOf('week');
  const days = [];
  let day = Calenderstart.clone();

  for (let i = 0; i < 42; i++) {
    days.push(day.clone());
    day.add(1, 'day');
  }

  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const Today = (date) => moment().isSame(date, 'day');

  // Handles save/edit/update logic with conflict detection and 
  const handleSaveEvent = (event) => {
    const newEvents = genrateReccuringEvents(event);
    const hasConflict = newEvents.some(newEvent =>
      events.some(existing =>
        existing.date === newEvent.date &&
        existing.time === newEvent.time &&
        existing.id !== newEvent.id
      )
    );

    if (hasConflict) {
      setShowConflictDialog(true);
      return;
    }

    const conflict = events.find(
      (e) => e.date === event.date && e.time === event.time && e.id !== event.id
    );

    if (conflict) {
      setShowConflictDialog(true);
      return;
    }

    if (editingEvent && String(editingEvent.id).includes('-')) {
      setModifiedInstances(prev => {
        const filtered = prev.filter(e => e.id !== event.id);
        return [...filtered, event];
      });
    } else if (editingEvent) {
      setEvents(events.map(e => (e.id === editingEvent.id ? event : e)));
      setEditingEvent(null);
    } else {
      setEvents([...events, event]);
    }
  };
// Delete function 
  const handleDeleteEvent = (id) => {
    if (!id) return;
    const stringId = String(id);
    if (stringId.includes('-')) {
      setDeletedInstanceIds(prev => [...prev, stringId]);
    } else {
      const updatedEvents = events.filter(event => event.id !== id);
      setEvents(updatedEvents);
    }
  };

  const getCategoryColor = (category = '') => {
    switch (category?.toLowerCase().trim()) {
      case 'personal': return 'danger';
      case 'work': return 'primary';
      case 'health': return 'success';
      default: return 'danger';
    }
  };

  return (
    <div className="container-fluid mt-4" style={{ maxWidth: '95%', width: '100vw' }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button
          className="btn btn-outline-primary"
          onClick={() => SetCurrentMonth(CurrentMonth.clone().subtract(1, 'month'))}
        >
          <i className="bi bi-arrow-left-circle"></i>
        </button>
        <h3 className="mb-0">{CurrentMonth.format('MMMM YYYY')}</h3>
        <button
          className="btn btn-outline-primary"
          onClick={() => SetCurrentMonth(CurrentMonth.clone().add(1, 'month'))}
        >
          <i className="bi bi-arrow-right-circle"></i>
        </button>
      </div>

      <div className="row text-center fw-bold pb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
          <div className="col border border-dark bg-light py-2" style={{ flex: 1 }} key={i}>
            {day}
          </div>
        ))}
      </div>
       {/* Calendar grid */}
      {weeks.map((week, i) => (
        <div className="row text-center py-2" key={i}>
          {week.map((date) => {
            const isCurrentMonth = date.month() === CurrentMonth.month();
            return (
              <div
                key={date.format('YYYY-MM-DD')}
                data-date={date.format('YYYY-MM-DD')}
                onDoubleClick={() => {
                  setSelectedDate(date);
                  setShowForm(true);
                }}
                className="calender-cell col border border-dark p-2 d-flex flex-column align-items-start justify-content-start position-relative"
                style={{ minHeight: '100px', padding: '6px', flex: 1 }}
              >
                {isCurrentMonth ? (
                  <span
                    className={`px-2 py-1 rounded ${Today(date) ? 'bg-warning text-white fw-bold' : isCurrentMonth ? 'text-dark' : 'text-muted'}`}
                    style={{ border: 'none', boxShadow: 'none' }}
                  >
                    {date.date()}
                  </span>
                ) : ('')}

                <div className="w-100 mt-2 overflow-auto" style={{ maxHeight: '60px' }}>
                  {allEvents
                    .filter((event) => event.date === date.format('YYYY-MM-DD'))
                    .map((event) => (
                      <div
                        key={event.id}
                        className={`small draggable-event d-flex justify-content-between align-items-center mb-1 px-1 py-1 rounded text-white bg-${getCategoryColor(event.category)}`}
                        data-id={event.id}
                        data-date={date.format('YYYY-MM-DD')}
                        onClick={(e) => {
                          e.stopPropagation();
                          const rect = e.currentTarget.getBoundingClientRect();
                          setPreviewEvent({
                            ...event,
                            position: {
                              top: rect.top + window.scrollY + 35,
                              left: rect.left + window.scrollX
                            }
                          });
                        }}
                      >
                        <span className="text-truncate" style={{ maxWidth: '75%' }}>
                          {event.title}
                        </span>
                        <span>
                          <i
                            className="bi bi-pencil me-1"
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              setEditingEvent(event);
                              setSelectedDate(moment(event.date));
                              setShowForm(true);
                            }}
                          ></i>
                          <i
                            className="bi bi-trash me-1"
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleDeleteEvent(event.id)}
                          ></i>
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            );
          })}
        </div>
      ))}
      {/* Event preview popup on single click */}
      {previewEvent && (
        <div
          className="position-absolute bg-light border rounded shadow p-2"
          style={{
            top: previewEvent.position.top,
            left: previewEvent.position.left,
            zIndex: 999,
            minWidth: '250px'
          }}
          onMouseLeave={() => setPreviewEvent(null)}
        >
          <h6 className="mb-1">{previewEvent.title}</h6>
          <div><strong>Date:</strong> {previewEvent.date}</div>
          <div><strong>Time:</strong> {previewEvent.time || 'N/A'}</div>
          <div><strong>Description:</strong> {previewEvent.description || 'None'}</div>
          <div><strong>Recurrence:</strong> {previewEvent.recurrence || 'None'}</div>
          <div><strong>Category:</strong> {previewEvent.category}</div>
        </div>
      )}
       {/* Conflict popup modal */}
      {showConflictDialog && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Event Conflict</h5>
              </div>
              <div className="modal-body">
                <p>Another event is already scheduled at the same time.</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setShowConflictDialog(false)}>
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Event creation/editing form */}
      {showForm && selectedDate && (
        <div
          className="position-absolute bg-white border rounded shadow p-3"
          style={{ top: '100px', left: '50%', transform: 'translate(50%,1000%)', zIndex: 999 }}
          onMouseLeave={() => {
            setShowForm(false);
            setEditingEvent(null);
          }}
        >
          <EventForm
            selectedDate={selectedDate}
            onSave={handleSaveEvent}
            onclose={() => {
              setShowForm(false);
              setEditingEvent(null);
            }}
            editingEvent={editingEvent}
          />
        </div>
      )}
    </div>
  );
};

export default MonthlyView;
