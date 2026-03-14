import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppData, Location, Package } from '../types';
import { loadData } from '../utils/storage';

interface AppContextType {
  data: AppData;
  updateLocations: (locations: Location[]) => void;
  updatePackages: (packages: Package[]) => void;
  addLocation: (location: Location) => Promise<void>;
  updateLocation: (location: Location) => Promise<void>;
  deleteLocation: (id: string) => Promise<void>;
  addPackage: (pkg: Package) => Promise<void>;
  updatePackage: (pkg: Package) => Promise<void>;
  deletePackage: (id: string) => Promise<void>;
  isAdmin: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData>(() => {
    return loadData();
  });
  const [isAdmin, setIsAdmin] = useState(false);

  // Load locations and packages from backend on mount
  useEffect(() => {
    const API_BASE = 'http://localhost:4000';
    (async () => {
      try {
        const [locRes, pkgRes] = await Promise.all([
          fetch(`${API_BASE}/api/locations`),
          fetch(`${API_BASE}/api/packages`),
        ]);
        if (locRes.ok && pkgRes.ok) {
          const locs = await locRes.json();
          const pkgs = await pkgRes.json();
          // normalize ids to strings and ensure imageUrl is absolute
          const locations: Location[] = locs.map((l: any) => ({
            ...l,
            id: String(l.id),
            imageUrl: typeof l.imageUrl === 'string' && l.imageUrl.startsWith('/') ? `${API_BASE}${l.imageUrl}` : l.imageUrl
          }));
          const packages: Package[] = pkgs.map((p: any) => ({
            ...p,
            id: String(p.id),
            locationId: p.locationId !== undefined && p.locationId !== null ? String(p.locationId) : undefined,
            imageUrl: typeof p.imageUrl === 'string' && p.imageUrl.startsWith('/') ? `${API_BASE}${p.imageUrl}` : p.imageUrl
          }));
          setData(prev => ({ ...prev, locations, packages }));
        }
      } catch (err) {
        console.error('Failed to load data from API', err);
      }
    })();
  }, []);

  const updateLocations = (locations: Location[]) => {
    setData(prev => ({ ...prev, locations }));
  };

  const updatePackages = (packages: Package[]) => {
    setData(prev => ({ ...prev, packages }));
  };

  const addLocation = async (location: Location) => {
    const API_BASE = 'http://localhost:4000';
    try {
      const { id, ...payload } = location as any;
      const resp = await fetch(`${API_BASE}/api/locations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) throw new Error('Failed to create location');
      const created = await resp.json();
      const loc: Location = { ...created, id: String(created.id) } as any;
      setData(prev => ({ ...prev, locations: [...prev.locations, loc] }));
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const updateLocation = async (location: Location) => {
    const API_BASE = 'http://localhost:4000';
    try {
      const id = Number(location.id);
      const { id: _id, ...payload } = location as any;
      const resp = await fetch(`${API_BASE}/api/locations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) throw new Error('Failed to update location');
      const updated = await resp.json();
      const loc: Location = { ...updated, id: String(updated.id) } as any;
      setData(prev => ({ ...prev, locations: prev.locations.map(l => (l.id === String(loc.id) ? loc : l)) }));
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const deleteLocation = async (id: string) => {
    const API_BASE = 'http://localhost:4000';
    try {
      const resp = await fetch(`${API_BASE}/api/locations/${Number(id)}`, { method: 'DELETE' });
      if (!resp.ok) throw new Error('Failed to delete location');
      setData(prev => ({ ...prev, locations: prev.locations.filter(loc => loc.id !== id) }));
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const addPackage = async (pkg: Package) => {
    const API_BASE = 'http://localhost:4000';
    try {
      const { id, ...payload } = pkg as any;
      // ensure locationId is number if provided
      if (payload.locationId !== undefined && payload.locationId !== '') {
        payload.locationId = Number(payload.locationId);
      } else {
        delete payload.locationId;
      }
      const resp = await fetch(`${API_BASE}/api/packages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) throw new Error('Failed to create package');
      const created = await resp.json();
      // ensure imageUrl is absolute when returned as relative path
      if (created && typeof created.imageUrl === 'string' && created.imageUrl.startsWith('/')) {
        created.imageUrl = `${API_BASE}${created.imageUrl}`;
      }
      const createdPkg: Package = {
        ...created,
        id: String(created.id),
        ...(created.locationId !== undefined ? { locationId: String(created.locationId) } : {})
      } as any;
      setData(prev => ({ ...prev, packages: [...prev.packages, createdPkg] }));
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const updatePackage = async (pkg: Package) => {
    const API_BASE = 'http://localhost:4000';
    try {
      const id = Number(pkg.id);
      const { id: _id, ...payload } = pkg as any;
      if (payload.locationId !== undefined && payload.locationId !== '') {
        payload.locationId = Number(payload.locationId);
      } else {
        delete payload.locationId;
      }
      const resp = await fetch(`${API_BASE}/api/packages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) throw new Error('Failed to update package');
      const updated = await resp.json();
      if (updated && typeof updated.imageUrl === 'string' && updated.imageUrl.startsWith('/')) {
        updated.imageUrl = `${API_BASE}${updated.imageUrl}`;
      }
      const updatedPkg: Package = {
        ...updated,
        id: String(updated.id),
        ...(updated.locationId !== undefined ? { locationId: String(updated.locationId) } : {})
      } as any;
      setData(prev => ({ ...prev, packages: prev.packages.map(p => (p.id === String(updatedPkg.id) ? updatedPkg : p)) }));
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const deletePackage = async (id: string) => {
    const API_BASE = 'http://localhost:4000';
    try {
      const resp = await fetch(`${API_BASE}/api/packages/${Number(id)}`, { method: 'DELETE' });
      if (!resp.ok) throw new Error('Failed to delete package');
      setData(prev => ({ ...prev, packages: prev.packages.filter(p => p.id !== id) }));
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const login = (username: string, password: string): boolean => {
    if (username === data.adminUser.username && password === data.adminUser.password) {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
  };

  const value: AppContextType = {
    data,
    updateLocations,
    updatePackages,
    addLocation,
    updateLocation,
    deleteLocation,
    addPackage,
    updatePackage,
    deletePackage,
    isAdmin,
    login,
    logout
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
