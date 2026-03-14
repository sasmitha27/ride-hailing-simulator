import './About.css';

const About: React.FC = () => {
  return (
    <div className="about-page">
      {/* Header Section */}
      <section className="about-header">
        <h1 className="page-title">
          About <span className="highlight">Ceylon Travo</span>
        </h1>
        <p className="page-subtitle">
          Your trusted partner in creating unforgettable travel experiences
        </p>
      </section>

      {/* Story Section */}
      <section className="about-section">
        <div className="about-content">
          <div className="about-text">
            <h2>Our Story</h2>
            <p>
              Founded in 2020, Ceylon Travo has been dedicated to making travel dreams come true. 
              We believe that every journey should be an adventure, filled with memorable moments 
              and enriching experiences.
            </p>
            <p>
              With years of expertise in the travel industry, we have carefully curated destinations 
              and experiences that cater to all types of travelers. From luxury getaways to cultural 
              explorations, we have something for everyone.
            </p>
          </div>
          <div className="about-image">
            <img 
              src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800" 
              alt="Travel planning" 
            />
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-section">
        <div className="mission-grid">
          <div className="mission-card">
            <div className="mission-icon">🎯</div>
            <h3>Our Mission</h3>
            <p>
              To provide exceptional travel experiences that exceed expectations and create 
              lasting memories for our clients around the world.
            </p>
          </div>
          <div className="mission-card">
            <div className="mission-icon">👁️</div>
            <h3>Our Vision</h3>
            <p>
              To become the world's most trusted travel companion, connecting people with 
              amazing destinations and cultures.
            </p>
          </div>
          <div className="mission-card">
            <div className="mission-icon">💎</div>
            <h3>Our Values</h3>
            <p>
              Excellence, integrity, passion for travel, customer satisfaction, and sustainable 
              tourism practices.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-section">
        <h2 className="section-title">Why Choose Ceylon Travo?</h2>
        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon">✈️</div>
            <h3>Expert Guidance</h3>
            <p>Our experienced travel experts provide personalized recommendations</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">💰</div>
            <h3>Best Prices</h3>
            <p>Competitive pricing with no hidden fees or surprise charges</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🛡️</div>
            <h3>Secure Booking</h3>
            <p>Safe and secure payment processing for peace of mind</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🌟</div>
            <h3>24/7 Support</h3>
            <p>Round-the-clock customer support whenever you need us</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🎨</div>
            <h3>Custom Packages</h3>
            <p>Tailored itineraries designed specifically for your preferences</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">⭐</div>
            <h3>Quality Assurance</h3>
            <p>Carefully vetted partners and accommodations for the best experience</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">10,000+</div>
            <div className="stat-label">Happy Travelers</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">50+</div>
            <div className="stat-label">Destinations</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">200+</div>
            <div className="stat-label">Tour Packages</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">4.9/5</div>
            <div className="stat-label">Customer Rating</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
