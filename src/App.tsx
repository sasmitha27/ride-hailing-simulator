import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import Home from './pages/Home';
import Packages from './pages/Packages';
import Locations from './pages/Locations';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="app">
          <Routes>
            {/* Admin routes (without header/footer) */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            {/* Public routes (with header/footer) */}
            <Route
              path="/*"
              element={
                <>
                  <Header />
                  <main className="main-content">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/packages" element={<Packages />} />
                      <Route path="/locations" element={<Locations />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                    </Routes>
                  </main>
                  <Footer />
                  <WhatsAppButton />
                </>
              }
            />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
