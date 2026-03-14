import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import './Locations.css';

type Continent = 'All' | 'Asia' | 'Europe' | 'Americas' | 'Africa' | 'Oceania';

const Locations: React.FC = () => {
  const { data } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContinent, setSelectedContinent] = useState<Continent>('All');

  const continents: Continent[] = ['All', 'Asia', 'Europe', 'Americas', 'Africa', 'Oceania'];

  // Filter locations
  const filteredLocations = data.locations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         location.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesContinent = selectedContinent === 'All' || location.continent === selectedContinent;
    return matchesSearch && matchesContinent;
  });

  return (
    <div className="locations-page">
      {/* Header Section */}
      <section className="locations-header">
        <h1 className="page-title">
          Explore <span className="highlight">Amazing Locations</span>
        </h1>
        <p className="page-subtitle">
          Discover breathtaking destinations around the world
        </p>
      </section>

      {/* Search Section */}
      <section className="search-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search destinations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button className="search-button">
            🔍 Search
          </button>
        </div>
      </section>

      {/* Continent Filter */}
      <section className="continent-section">
        <h2 className="section-subtitle">
          Browse by <span className="highlight">Location</span>
        </h2>
        <div className="continent-filters">
          {continents.map(continent => (
            <button
              key={continent}
              className={`continent-btn ${selectedContinent === continent ? 'active' : ''}`}
              onClick={() => setSelectedContinent(continent)}
            >
              {continent}
            </button>
          ))}
        </div>
      </section>

      {/* Locations Grid */}
      <section className="locations-grid-section">
        {filteredLocations.length === 0 ? (
          <div className="no-results">
            <p>No locations found.</p>
            <p>Try a different search or filter.</p>
          </div>
        ) : (
          <div className="locations-grid">
            {filteredLocations.map(location => (
              <div key={location.id} className="location-card">
                <div className="location-image">
                  <img src={location.imageUrl} alt={location.name} />
                  <div className="location-overlay">
                    <h3 className="location-name">{location.name}</h3>
                    <p className="location-country">{location.country}</p>
                  </div>
                </div>
                <div className="location-info">
                  <span className="location-continent">{location.continent}</span>
                  <p className="location-description">{location.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Locations;
