import React, { useState } from 'react';
import { eventAPI } from '../services/api';
import './EventForm.css';

function EventForm({ onEventAdded }) {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    seats: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Converti la data nel formato corretto per MySQL (ISO 8601)
      const dateObj = new Date(formData.date);
      const formattedDate = dateObj.toISOString();

      const eventData = {
        title: formData.title,
        date: formattedDate,
        location: formData.location,
        seats: parseInt(formData.seats),
        availableSeats: parseInt(formData.seats)
      };

      console.log('Sending event data:', eventData);

      const response = await eventAPI.create(eventData);
      console.log('Event created:', response.data);
      
      setSuccess(true);
      
      // Reset form
      setFormData({
        title: '',
        date: '',
        location: '',
        seats: ''
      });
      
      // Hide success message after 2 seconds
      setTimeout(() => {
        setSuccess(false);
        onEventAdded();
      }, 2000);
    } catch (err) {
      console.error('Error creating event:', err);
      const errorMsg = err.response?.data?.message || 'Failed to create event. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="event-form-container">
      <h2>➕ Add New Event</h2>
      
      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}
      
      {success && (
        <div className="success-message success-pulse">
          ✅ Event created successfully!
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="event-form">
        <div className="form-group">
          <label htmlFor="title" className="required">Event Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="form-input"
            placeholder="e.g., Tech Conference 2025"
          />
        </div>

        <div className="form-group">
          <label htmlFor="date" className="required">Date and Time</label>
          <input
            type="datetime-local"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="location" className="required">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="form-input"
            placeholder="e.g., Milano, Centro Congressi"
          />
        </div>

        <div className="form-group">
          <label htmlFor="seats" className="required">Total Seats</label>
          <input
            type="number"
            id="seats"
            name="seats"
            value={formData.seats}
            onChange={handleChange}
            required
            min="1"
            className="form-input"
            placeholder="e.g., 100"
          />
        </div>

        <button 
          type="submit" 
          className={`btn btn-primary ${loading ? 'btn-loading' : ''}`}
          disabled={loading}
        >
          {loading ? '🎪 Creating...' : '🚀 Create Event'}
        </button>
      </form>
    </div>
  );
}

export default EventForm;