import React, { useState, useEffect } from 'react';
import { bookingAPI } from '../services/api';
import './BookingModal.css';

function BookingModal({ event, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    userName: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Blocca lo scroll del body quando la modale è aperta
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Gestione della chiusura con ESC
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

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
      const bookingData = {
        eventId: event.id,
        userName: formData.userName,
        email: formData.email
      };

      await bookingAPI.create(bookingData);
      alert('🎉 Booking successful!');
      onSuccess();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create booking';
      setError(errorMsg);
      console.error(err);
    } finally {
      setLoading(false);
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

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🎫 Book Event</h2>
          <button 
            className="close-btn" 
            onClick={onClose}
            aria-label="Close booking modal"
          >
            &times;
          </button>
        </div>

        <div className="modal-body">
          <div className="event-info">
            <h3>📋 {event.title}</h3>
            <p>
              <span className="icon">📅</span>
              <strong>Date:</strong> {formatDate(event.date)}
            </p>
            <p>
              <span className="icon">📍</span>
              <strong>Location:</strong> {event.location}
            </p>
            <p>
              <span className="icon">💺</span>
              <strong>Available Seats:</strong> {event.availableSeats}
            </p>
            <p>
              <span className="icon">ℹ️</span>
              <strong>Note:</strong> You'll receive a confirmation email shortly.
            </p>
          </div>

          {error && (
            <div className="error-message">
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="userName">Your Full Name</label>
              <input
                type="text"
                id="userName"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter your full name"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Your Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="your.email@example.com"
                disabled={loading}
              />
            </div>

            <div className="modal-actions">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className={`btn btn-primary ${loading ? 'btn-loading' : ''}`}
                disabled={loading}
              >
                {loading ? '🎪 Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BookingModal;