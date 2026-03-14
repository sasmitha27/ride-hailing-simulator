import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <span className="logo-icon">🏔️</span>
          <span className="logo-text">Ceylon Travo</span>
        </Link>
        
        <nav className="nav">
          <Link to="/" className={`nav-link ${isActive('/')}`}>
            Home
          </Link>
          <Link to="/packages" className={`nav-link ${isActive('/packages')}`}>
            Packages
          </Link>
          <Link to="/locations" className={`nav-link ${isActive('/locations')}`}>
            Locations
          </Link>
          <Link to="/about" className={`nav-link ${isActive('/about')}`}>
            About Us
          </Link>
          <Link to="/contact" className={`nav-link ${isActive('/contact')}`}>
            Contact Us
          </Link>
        </nav>

        <Link to="/contact" className="btn btn-primary btn-small">
          Inquire
        </Link>
      </div>
    </header>
  );
};

export default Header;
