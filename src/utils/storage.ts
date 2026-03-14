import { AppData } from '../types';

const STORAGE_KEY = 'ceylon-travo-data';

// Default data
const defaultData: AppData = {
  locations: [
    {
      id: '1',
      name: 'Sigiriya',
      country: 'Sri Lanka',
      continent: 'Asia',
      description: 'Ancient rock fortress with stunning views and historical significance',
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      featured: true
    },
    {
      id: '2',
      name: 'Maldives',
      country: 'Maldives',
      continent: 'Asia',
      description: 'Paradise islands with crystal clear waters and luxury resorts',
      imageUrl: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800',
      featured: true
    },
    {
      id: '3',
      name: 'Bali',
      country: 'Indonesia',
      continent: 'Asia',
      description: 'Tropical paradise known for beaches, temples, and rice terraces',
      imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
      featured: true
    },
    {
      id: '4',
      name: 'Dubai',
      country: 'UAE',
      continent: 'Asia',
      description: 'Modern city with iconic skyscrapers and luxury shopping',
      imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
      featured: true
    },
    {
      id: '5',
      name: 'Paris',
      country: 'France',
      continent: 'Europe',
      description: 'City of lights with romantic ambiance and rich culture',
      imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
      featured: false
    },
    {
      id: '6',
      name: 'Santorini',
      country: 'Greece',
      continent: 'Europe',
      description: 'Beautiful Greek island with white buildings and blue domes',
      imageUrl: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800',
      featured: false
    }
  ],
  packages: [
    {
      id: '1',
      title: 'Sigiriya Heritage Tour',
      destination: 'Sigiriya, Sri Lanka',
      locationId: '1',
      duration: 3,
      price: 450,
      description: 'Explore the ancient rock fortress and surrounding cultural sites',
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      includes: ['Hotel Accommodation', 'Tour Guide', 'Entrance Fees', 'Breakfast'],
      featured: true
    },
    {
      id: '2',
      title: 'Maldives Paradise Escape',
      destination: 'Maldives',
      locationId: '2',
      duration: 7,
      price: 3500,
      description: 'Luxury beachfront villa with water sports and spa treatments',
      imageUrl: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800',
      includes: ['5-Star Resort', 'All Meals', 'Water Sports', 'Spa Access', 'Transfers'],
      featured: true
    },
    {
      id: '3',
      title: 'Bali Cultural Experience',
      destination: 'Bali, Indonesia',
      locationId: '3',
      duration: 5,
      price: 1200,
      description: 'Immerse yourself in Balinese culture, temples, and beautiful beaches',
      imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
      includes: ['Boutique Hotel', 'Temple Tours', 'Cultural Shows', 'Daily Breakfast'],
      featured: true
    },
    {
      id: '4',
      title: 'Dubai Luxury Experience',
      destination: 'Dubai, UAE',
      locationId: '4',
      duration: 4,
      price: 2200,
      description: 'Experience the luxury and modern wonders of Dubai',
      imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
      includes: ['5-Star Hotel', 'Desert Safari', 'Burj Khalifa', 'Dubai Mall', 'Transfers'],
      featured: true
    }
  ],
  contactInfo: {
    email: 'info@ceylontravo.com',
    phone: '+1 (555) 123-4567',
    address: '123 Travel St, Adventure City'
  },
  socialLinks: {
    facebook: 'https://facebook.com/ceylontravo',
    instagram: 'https://instagram.com/ceylontravo',
    twitter: 'https://twitter.com/ceylontravo',
    youtube: 'https://youtube.com/ceylontravo'
  },
  adminUser: {
    username: 'admin',
    password: 'admin123'
  }
};

export const loadData = (): AppData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
  }
  return defaultData;
};

export const saveData = (data: AppData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
  }
};

export const initializeData = (): void => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    saveData(defaultData);
  }
};
