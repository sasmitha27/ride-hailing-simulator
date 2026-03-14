import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Home.css';

const Home: React.FC = () => {
  const { data } = useApp();
  const featuredLocations = data.locations.filter(loc => loc.featured).slice(0, 4);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <p className="hero-subtitle">🏠 → 😊 Explore world</p>
          <h1 className="hero-title">
            Make Your <span className="highlight">Summer Vacation</span>
            <br />
            Unforgettable!
          </h1>
          <p className="hero-description">
            Get your dream trip planned with expert-guided destinations,
            <br />
            booking, transport & more — all in one
          </p>
          <Link to="/packages" className="btn btn-primary btn-large">
            Start Planning →
          </Link>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="popular-destinations">
        <h2 className="section-title">Popular Destinations</h2>
        
        <div className="destinations-grid">
          {featuredLocations.map(location => (
            <div key={location.id} className="destination-card">
              <div className="destination-image">
                <img src={location.imageUrl} alt={location.name} />
                <div className="destination-overlay">
                  <Link to={`/locations`} className="btn btn-light btn-small">
                    Explore
                  </Link>
                </div>
              </div>
              <div className="destination-info">
                <h3>{location.name}</h3>
                <p className="destination-country">{location.country}</p>
                <p className="destination-description">{location.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="view-all-container">
          <Link to="/locations" className="btn btn-secondary">
            View All Destinations
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Start Your Adventure?</h2>
          <p className="cta-description">
            Join thousands of travelers who trust Ceylon Travo for their perfect vacation
          </p>
          <Link to="/contact" className="btn btn-light btn-large">
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
