export interface Location {
  id: string;
  name: string;
  country: string;
  continent: 'Asia' | 'Europe' | 'Americas' | 'Africa' | 'Oceania';
  description: string;
  imageUrl: string;
  featured: boolean;
}

export interface Package {
  id: string;
  title: string;
  destination: string;
  locationId?: string;
  duration: number; // in days
  price: number;
  description: string;
  imageUrl: string;
  includes: string[];
  featured: boolean;
}

export interface AdminUser {
  username: string;
  password: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
}

export interface SocialLinks {
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
}

export interface AppData {
  locations: Location[];
  packages: Package[];
  contactInfo: ContactInfo;
  socialLinks: SocialLinks;
  adminUser: AdminUser;
}

export type FilterDuration = 'any' | '1-3' | '4-7' | '8-14' | '15+';
export type FilterPrice = 'any' | '0-1000' | '1000-2500' | '2500-5000' | '5000+';
