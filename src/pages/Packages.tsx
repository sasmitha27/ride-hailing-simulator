import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { FilterDuration, FilterPrice } from '../types';
import './Packages.css';

const Packages: React.FC = () => {
  const { data } = useApp();
  const [selectedDestination, setSelectedDestination] = useState<string>('all');
  const [selectedDuration, setSelectedDuration] = useState<FilterDuration>('any');
  const [selectedPrice, setSelectedPrice] = useState<FilterPrice>('any');

  // Get unique destinations
  const destinations = ['all', ...new Set(data.packages.map(pkg => pkg.destination))];

  // Filter packages
  const filteredPackages = data.packages.filter(pkg => {
    // Destination filter
    if (selectedDestination !== 'all' && pkg.destination !== selectedDestination) {
      return false;
    }

    // Duration filter
    if (selectedDuration !== 'any') {
      if (selectedDuration === '1-3' && (pkg.duration < 1 || pkg.duration > 3)) return false;
      if (selectedDuration === '4-7' && (pkg.duration < 4 || pkg.duration > 7)) return false;
      if (selectedDuration === '8-14' && (pkg.duration < 8 || pkg.duration > 14)) return false;
      if (selectedDuration === '15+' && pkg.duration < 15) return false;
    }

    // Price filter
    if (selectedPrice !== 'any') {
      if (selectedPrice === '0-1000' && (pkg.price < 0 || pkg.price > 1000)) return false;
      if (selectedPrice === '1000-2500' && (pkg.price < 1000 || pkg.price > 2500)) return false;
      if (selectedPrice === '2500-5000' && (pkg.price < 2500 || pkg.price > 5000)) return false;
      if (selectedPrice === '5000+' && pkg.price < 5000) return false;
    }

    return true;
  });

  return (
    <div className="packages-page">
      {/* Header Section */}
      <section className="packages-header">
        <h1 className="page-title">
          Our <span className="highlight">Tour Packages</span>
        </h1>
        <p className="page-subtitle">
          Discover amazing destinations with our carefully curated travel packages
        </p>
      </section>

      {/* Filters */}
      <section className="filters-section">
        <div className="filters-container">
          <div className="filter-group">
            <select
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Destinations</option>
              {destinations.slice(1).map(dest => (
                <option key={dest} value={dest}>{dest}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value as FilterDuration)}
              className="filter-select"
            >
              <option value="any">Any Duration</option>
              <option value="1-3">1-3 Days</option>
              <option value="4-7">4-7 Days</option>
              <option value="8-14">8-14 Days</option>
              <option value="15+">15+ Days</option>
            </select>
          </div>

          <div className="filter-group">
            <select
              value={selectedPrice}
              onChange={(e) => setSelectedPrice(e.target.value as FilterPrice)}
              className="filter-select"
            >
              <option value="any">Any Price</option>
              <option value="0-1000">$0 - $1000</option>
              <option value="1000-2500">$1000 - $2500</option>
              <option value="2500-5000">$2500 - $5000</option>
              <option value="5000+">$5000+</option>
            </select>
          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="packages-grid-section">
        {filteredPackages.length === 0 ? (
          <div className="no-results">
            <p>No packages found matching your criteria.</p>
            <p>Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="packages-grid">
            {filteredPackages.map(pkg => (
              <div key={pkg.id} className="package-card">
                <div className="package-image">
                  <img src={pkg.imageUrl} alt={pkg.title} />
                  {pkg.featured && <span className="featured-badge">Featured</span>}
                </div>
                <div className="package-content">
                  <h3 className="package-title">{pkg.title}</h3>
                  <p className="package-destination">📍 {pkg.destination}</p>
                  <p className="package-description">{pkg.description}</p>
                  
                  <div className="package-details">
                    <span className="package-duration">
                      🕒 {pkg.duration} {pkg.duration === 1 ? 'Day' : 'Days'}
                    </span>
                    <span className="package-price">${pkg.price}</span>
                  </div>

                  <div className="package-includes">
                    <p className="includes-title">Includes:</p>
                    <ul>
                      {pkg.includes.slice(0, 3).map((item, index) => (
                        <li key={index}>✓ {item}</li>
                      ))}
                    </ul>
                  </div>

                  <Link to="/contact" className="btn btn-primary btn-block">
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="packages-cta">
        <div className="cta-box">
          <h2>Can't Find What You're Looking For?</h2>
          <p>Let us create a custom package tailored to your preferences</p>
          <Link to="/contact" className="btn btn-light btn-large">
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Packages;
