import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import './Contact.css';

const Contact: React.FC = () => {
  const { data } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would send the data to a server
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="contact-page">
      {/* Header Section */}
      <section className="contact-header">
        <h1 className="page-title">
          Get In <span className="highlight">Touch</span>
        </h1>
        <p className="page-subtitle">
          We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
      </section>

      {/* Contact Content */}
      <section className="contact-content">
        <div className="contact-container">
          {/* Contact Info */}
          <div className="contact-info-section">
            <h2>Contact Information</h2>
            <p className="info-intro">
              Reach out to us through any of the following channels or fill out the form.
            </p>

            <div className="contact-details">
              <div className="contact-detail-item">
                <div className="detail-icon">📧</div>
                <div className="detail-content">
                  <h3>Email</h3>
                  <p>{data.contactInfo.email}</p>
                </div>
              </div>

              <div className="contact-detail-item">
                <div className="detail-icon">📞</div>
                <div className="detail-content">
                  <h3>Phone</h3>
                  <p>{data.contactInfo.phone}</p>
                </div>
              </div>

              <div className="contact-detail-item">
                <div className="detail-icon">📍</div>
                <div className="detail-content">
                  <h3>Address</h3>
                  <p>{data.contactInfo.address}</p>
                </div>
              </div>
            </div>

            <div className="social-section">
              <h3>Follow Us</h3>
              <div className="social-links-contact">
                <a href={data.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="social-link">
                  Facebook
                </a>
                <a href={data.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="social-link">
                  Instagram
                </a>
                <a href={data.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="social-link">
                  Twitter
                </a>
                <a href={data.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="social-link">
                  YouTube
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-section">
            <form onSubmit={handleSubmit} className="contact-form">
              <h2>Send Us a Message</h2>
              
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="Tell us about your dream vacation..."
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block btn-large">
                {submitted ? '✓ Message Sent!' : 'Send Message'}
              </button>

              {submitted && (
                <div className="success-message">
                  Thank you for contacting us! We'll get back to you soon.
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Map or Additional CTA */}
      <section className="contact-cta">
        <h2>Ready to Plan Your Next Adventure?</h2>
        <p>Let us help you create memories that will last a lifetime</p>
      </section>
    </div>
  );
};

export default Contact;
