import React, { useState, useEffect } from 'react';
import { eventAPI } from '../services/api';
import BookingModal from './BookingModal';
import './EventList.css';

function EventList({ isAdmin, onEventChange }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventAPI.getAll();
      setEvents(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load events');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventAPI.delete(id);
        fetchEvents();
        onEventChange();
      } catch (err) {
        alert('Failed to delete event');
        console.error(err);
      }
    }
  };

  const handleBookNow = (event) => {
    setSelectedEvent(event);
    setShowBookingModal(true);
  };

  const handleBookingSuccess = () => {
    setShowBookingModal(false);
    fetchEvents();
    onEventChange();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('it-IT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <div className="loading">Loading events...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="event-list">
      <h2>Available Events</h2>
      {events.length === 0 ? (
        <div className="no-events">
          <div className="empty-state-icon">📅</div>
          <h3>No events available</h3>
          <p>Check back later for new events or create one in admin mode.</p>
        </div>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <div key={event.id} className="event-card fade-in">
              <div className="event-header">
                <h3>{event.title}</h3>
                {event.availableSeats === 0 ? (
                  <span className="sold-out-badge">SOLD OUT</span>
                ) : (
                  <span className="available-badge">{event.availableSeats} SEATS LEFT</span>
                )}
              </div>
              
              <div className="event-details">
                <div className="event-detail-item">
                  <span className="icon">📅</span>
                  <strong>Date:</strong> 
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="event-detail-item">
                  <span className="icon">📍</span>
                  <strong>Location:</strong> 
                  <span>{event.location}</span>
                </div>
                <div className="event-detail-item">
                  <span className="icon">💺</span>
                  <strong>Seats:</strong> 
                  <span>{event.availableSeats} / {event.seats} available</span>
                </div>
              </div>

              {/* Progress bar per i posti */}
              <div className="seats-progress">
                <div className="progress-label">
                  <span>Availability: {Math.round((event.availableSeats / event.seats) * 100)}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${(event.availableSeats / event.seats) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="event-actions">
                {!isAdmin && event.availableSeats > 0 && (
                  <button
                    className="btn btn-primary"
                    onClick={() => handleBookNow(event)}
                  >
                    🎫 Book Now
                  </button>
                )}
                {isAdmin && (
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(event.id)}
                  >
                    🗑️ Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showBookingModal && (
        <BookingModal
          event={selectedEvent}
          onClose={() => setShowBookingModal(false)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
}

export default EventList;