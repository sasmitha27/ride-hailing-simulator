import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Location, Package } from '../types';
import './AdminDashboard.css';

type TabType = 'packages' | 'locations';

const AdminDashboard: React.FC = () => {
  const API_BASE = 'http://localhost:4000';
  const { data, isAdmin, logout, addLocation, updateLocation, deleteLocation, addPackage, updatePackage, deletePackage } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('packages');

  // Editing states
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [showPackageForm, setShowPackageForm] = useState(false);

  // Form states
  const [locationForm, setLocationForm] = useState<Partial<Location>>({
    name: '',
    country: '',
    continent: 'Asia',
    description: '',
    imageUrl: '',
    featured: false
  });

  const [packageForm, setPackageForm] = useState<Partial<Package>>({
    title: '',
    destination: '',
    duration: 1,
    price: 0,
    description: '',
    imageUrl: '',
    includes: [''],
    featured: false
  });

  React.useEffect(() => {
    if (!isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  // Location handlers
  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    (async () => {
      let imageUrl = (locationForm as any).imageUrl;
      const imageFile = (locationForm as any).imageFile as File | undefined;
      if (imageFile) {
        try {
          const form = new FormData();
          form.append('file', imageFile);
          const resp = await fetch(`${API_BASE}/api/upload`, { method: 'POST', body: form });
          const body = await resp.json();
          if (resp.ok && body.url) imageUrl = `${body.url}`;
        } catch (err) {
          console.error('Upload failed', err);
        }
      }

      if (editingLocation) {
        await updateLocation({ ...editingLocation, ...locationForm, imageUrl } as Location);
        setEditingLocation(null);
      } else {
        const payload = {
          ...(locationForm as Omit<Location, 'id'>),
          imageUrl: imageUrl || ''
        } as any;
        await addLocation(payload as Location);
      }
    })();
    setLocationForm({
      name: '',
      country: '',
      continent: 'Asia',
      description: '',
      imageUrl: '',
      featured: false
    });
    setShowLocationForm(false);
  };

  const handleEditLocation = (location: Location) => {
    setEditingLocation(location);
    setLocationForm(location);
    setShowLocationForm(true);
  };

  const handleDeleteLocation = (id: string) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      (async () => {
        try {
          await deleteLocation(id);
        } catch (err) {
          console.error('Delete failed', err);
        }
      })();
    }
  };

  // Package handlers
  const handlePackageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = (packageForm as any).imageUrl;
      const imageFile = (packageForm as any).imageFile as File | undefined;
      if (imageFile) {
        try {
          const form = new FormData();
          form.append('file', imageFile);
          const resp = await fetch(`${API_BASE}/api/upload`, { method: 'POST', body: form });
          const body = await resp.json();
          if (resp.ok && body.url) imageUrl = `${body.url}`;
        } catch (err) {
          console.error('Upload failed', err);
          throw err;
        }
      }

      if (editingPackage) {
        const updatedObj: any = { ...editingPackage, ...packageForm, imageUrl };
        if (updatedObj.destinations && Array.isArray(updatedObj.destinations)) {
          updatedObj.destination = updatedObj.destinations.join(', ');
          delete updatedObj.destinations;
        }
        // remove runtime-only fields
        delete updatedObj.imageFile;
        await updatePackage(updatedObj as Package);
        setEditingPackage(null);
      } else {
        const payload: any = {
          ...(packageForm as any),
          imageUrl: imageUrl || ''
        };
        if (payload.destinations && Array.isArray(payload.destinations)) {
          payload.destination = payload.destinations.join(', ');
          delete payload.destinations;
        }
        // remove runtime-only fields that can't be JSON-stringified
        delete payload.imageFile;
        await addPackage(payload as Package);
      }

      // reset only after successful save
      setPackageForm({
        title: '',
        destination: '',
        duration: 1,
        price: 0,
        description: '',
        imageUrl: '',
        includes: [''],
        featured: false
      });
      setShowPackageForm(false);
    } catch (err) {
      console.error('Failed to save package', err);
      // let the admin know
      // eslint-disable-next-line no-alert
      alert('Failed to save package. Check console for details.');
    }
  };

  const handleEditPackage = (pkg: Package) => {
    setEditingPackage(pkg);
    setPackageForm({
      ...pkg,
      destinations: pkg.destination ? pkg.destination.split(',').map(s => s.trim()) : []
    } as any);
    setShowPackageForm(true);
  };

  const handleDeletePackage = (id: string) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      (async () => {
        try {
          await deletePackage(id);
        } catch (err) {
          console.error('Delete failed', err);
        }
      })();
    }
  };

  const handleToggleFeaturedLocation = (location: Location) => {
    (async () => {
      try {
        await updateLocation({ ...location, featured: !location.featured });
      } catch (err) {
        console.error('Failed to toggle featured for location', err);
      }
    })();
  };

  const handleToggleFeaturedPackage = (pkg: Package) => {
    (async () => {
      try {
        await updatePackage({ ...pkg, featured: !pkg.featured });
      } catch (err) {
        console.error('Failed to toggle featured for package', err);
      }
    })();
  };

  return (
    <div className="admin-dashboard">
      {/* Admin Header */}
      <div className="admin-header">
        <div className="admin-header-content">
          <h1>Admin Panel</h1>
          <p>Manage page images (saved locally in your browser)</p>
        </div>
        <div className="admin-nav-links">
          <a href="/">Home</a>
          <a href="/packages">Packages</a>
          <a href="/locations">Locations</a>
          <a href="/about">About Us</a>
          <a href="/contact">Contact Us</a>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="info-banner">
        Manage your website content. All changes are saved in browser localStorage.
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'packages' ? 'active' : ''}`}
          onClick={() => setActiveTab('packages')}
        >
          Packages Page
        </button>
        <button
          className={`tab-btn ${activeTab === 'locations' ? 'active' : ''}`}
          onClick={() => setActiveTab('locations')}
        >
          Locations Page
        </button>
      </div>

      {/* Content Area */}
      <div className="admin-content">
        {activeTab === 'packages' && (
          <div className="admin-section">
            <div className="section-header">
              <h2>Packages Management</h2>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setEditingPackage(null);
                  setPackageForm({
                    title: '',
                    destination: '',
                    duration: 1,
                    price: 0,
                    description: '',
                    imageUrl: '',
                    includes: [''],
                    featured: false
                  });
                  setShowPackageForm(true);
                }}
              >
                + Add Package
              </button>
            </div>

            {showPackageForm && (
              <div className="form-modal">
                <div className="form-modal-content">
                  <h3>{editingPackage ? 'Edit Package' : 'Add New Package'}</h3>
                  <form onSubmit={handlePackageSubmit} className="admin-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Title *</label>
                        <input
                          type="text"
                          value={packageForm.title}
                          onChange={(e) => setPackageForm({ ...packageForm, title: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Destination(s) *</label>
                        <input
                          type="text"
                          value={((packageForm as any).destinations || []).join(', ')}
                          onChange={(e) => {
                            const items = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                            setPackageForm({ ...packageForm, destinations: items } as any);
                          }}
                          placeholder="Enter one or more destinations, separated by commas"
                          required
                        />
                        <small className="muted">Enter destination names separated by commas (e.g. Sigiriya, Maldives).</small>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Duration (days) *</label>
                        <input
                          type="number"
                          value={packageForm.duration}
                          onChange={(e) => setPackageForm({ ...packageForm, duration: parseInt(e.target.value) })}
                          required
                          min="1"
                        />
                      </div>
                      <div className="form-group">
                        <label>Price ($) *</label>
                        <input
                          type="number"
                          value={packageForm.price}
                          onChange={(e) => setPackageForm({ ...packageForm, price: parseFloat(e.target.value) })}
                          required
                          min="0"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Description *</label>
                      <textarea
                        value={packageForm.description}
                        onChange={(e) => setPackageForm({ ...packageForm, description: e.target.value })}
                        required
                        rows={3}
                      />
                    </div>

                      <div className="form-group">
                        <label>Image File (optional, max 15MB)</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const f = e.target.files && e.target.files[0];
                            setPackageForm({ ...packageForm, imageFile: f } as any);
                          }}
                        />
                        <small className="muted">If you choose a file, it will be uploaded to the server.</small>
                      </div>

                    <div className="form-group">
                      <label>Includes (comma-separated) *</label>
                      <input
                        type="text"
                        value={packageForm.includes?.join(', ')}
                        onChange={(e) => setPackageForm({ ...packageForm, includes: e.target.value.split(',').map(s => s.trim()) })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={packageForm.featured}
                          onChange={(e) => setPackageForm({ ...packageForm, featured: e.target.checked })}
                        />
                        <span>Featured Package</span>
                      </label>
                    </div>

                    <div className="form-actions">
                      <button type="submit" className="btn btn-primary">
                        {editingPackage ? 'Update' : 'Add'} Package
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                          setShowPackageForm(false);
                          setEditingPackage(null);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="items-grid">
              {data.packages.map(pkg => (
                <div key={pkg.id} className="admin-card">
                  <img src={pkg.imageUrl} alt={pkg.title} />
                  <div className="admin-card-content">
                    <h4>{pkg.title}</h4>
                    <p>{pkg.destination} • {pkg.duration} days • ${pkg.price}</p>
                    {pkg.featured && <span className="featured-badge-small">Featured</span>}
                    <label className="featured-toggle admin-inline-toggle">
                      <input
                        type="checkbox"
                        checked={pkg.featured}
                        onChange={() => handleToggleFeaturedPackage(pkg)}
                      />
                      <span>Show on Home Page</span>
                    </label>
                    <div className="card-actions">
                      <button className="btn-small btn-edit" onClick={() => handleEditPackage(pkg)}>Edit</button>
                      <button className="btn-small btn-delete" onClick={() => handleDeletePackage(pkg.id)}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'locations' && (
          <div className="admin-section">
            <div className="section-header">
              <h2>Locations Management</h2>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setEditingLocation(null);
                  setLocationForm({
                    name: '',
                    country: '',
                    continent: 'Asia',
                    description: '',
                    imageUrl: '',
                    featured: false
                  });
                  setShowLocationForm(true);
                }}
              >
                + Add Location
              </button>
            </div>

            {showLocationForm && (
              <div className="form-modal">
                <div className="form-modal-content">
                  <h3>{editingLocation ? 'Edit Location' : 'Add New Location'}</h3>
                  <form onSubmit={handleLocationSubmit} className="admin-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Name *</label>
                        <input
                          type="text"
                          value={locationForm.name}
                          onChange={(e) => setLocationForm({ ...locationForm, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Country *</label>
                        <input
                          type="text"
                          value={locationForm.country}
                          onChange={(e) => setLocationForm({ ...locationForm, country: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Continent *</label>
                      <select
                        value={locationForm.continent}
                        onChange={(e) => setLocationForm({ ...locationForm, continent: e.target.value as any })}
                        required
                      >
                        <option value="Asia">Asia</option>
                        <option value="Europe">Europe</option>
                        <option value="Americas">Americas</option>
                        <option value="Africa">Africa</option>
                        <option value="Oceania">Oceania</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Description *</label>
                      <textarea
                        value={locationForm.description}
                        onChange={(e) => setLocationForm({ ...locationForm, description: e.target.value })}
                        required
                        rows={3}
                      />
                    </div>

                    <div className="form-group">
                      <label>Image File (optional, max 15MB)</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const f = e.target.files && e.target.files[0];
                          setLocationForm({ ...locationForm, imageFile: f } as any);
                        }}
                      />
                      <small className="muted">If you choose a file, it will be uploaded to the server.</small>
                    </div>

                    <div className="form-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={locationForm.featured}
                          onChange={(e) => setLocationForm({ ...locationForm, featured: e.target.checked })}
                        />
                        <span>Featured Location</span>
                      </label>
                    </div>

                    <div className="form-actions">
                      <button type="submit" className="btn btn-primary">
                        {editingLocation ? 'Update' : 'Add'} Location
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                          setShowLocationForm(false);
                          setEditingLocation(null);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="items-grid">
              {data.locations.map(location => (
                <div key={location.id} className="admin-card">
                  <img src={location.imageUrl} alt={location.name} />
                  <div className="admin-card-content">
                    <h4>{location.name}</h4>
                    <p>{location.country} • {location.continent}</p>
                        {location.featured && <span className="featured-badge-small">Featured</span>}
                        <label className="featured-toggle admin-inline-toggle">
                          <input
                            type="checkbox"
                            checked={location.featured}
                            onChange={() => handleToggleFeaturedLocation(location)}
                          />
                          <span>Show on Home Page</span>
                        </label>
                    <div className="card-actions">
                      <button className="btn-small btn-edit" onClick={() => handleEditLocation(location)}>Edit</button>
                      <button className="btn-small btn-delete" onClick={() => handleDeleteLocation(location.id)}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
