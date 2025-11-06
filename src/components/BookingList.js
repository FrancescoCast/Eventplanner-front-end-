import React, { useState, useEffect } from 'react';
import { bookingAPI, eventAPI } from '../services/api';
import './BookingList.css';

function BookingList({ onBookingChange }) {
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookingsAndEvents();
  }, []);

  const fetchBookingsAndEvents = async () => {
    try {
      setLoading(true);
      const [bookingsRes, eventsRes] = await Promise.all([
        bookingAPI.getAll(),
        eventAPI.getAll()
      ]);

      setBookings(bookingsRes.data);
      
      const eventsMap = {};
      eventsRes.data.forEach(event => {
        eventsMap[event.id] = event;
      });
      setEvents(eventsMap);
      setError(null);
    } catch (err) {
      setError('Failed to load bookings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await bookingAPI.delete(id);
        fetchBookingsAndEvents();
        onBookingChange();
      } catch (err) {
        alert('Failed to cancel booking');
        console.error(err);
      }
    }
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

  if (loading) return <div className="loading">Loading bookings...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="booking-list">
      <h2>All Bookings</h2>
      {bookings.length === 0 ? (
        <div className="no-bookings">
          <div className="empty-state-icon">📋</div>
          <h3>No bookings yet</h3>
          <p>When bookings are made, they will appear here.</p>
        </div>
      ) : (
        <div className="bookings-table-container">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Event</th>
                <th>User Name</th>
                <th>Email</th>
                <th>Event Date</th>
                <th>Booked At</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => {
                const event = events[booking.eventId];
                return (
                  <tr key={booking.id} className="slide-in">
                    <td>#{booking.id}</td>
                    <td className="event-cell">
                      <span className="event-title">
                        {event ? event.title : 'Unknown Event'}
                      </span>
                    </td>
                    <td>{booking.userName}</td>
                    <td>{booking.email}</td>
                    <td>{event ? formatDate(event.date) : 'N/A'}</td>
                    <td>{formatDate(booking.createdAt)}</td>
                    <td>
                      <span className="status-badge status-confirmed">
                        Confirmed
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(booking.id)}
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default BookingList;