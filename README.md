<<<<<<< HEAD
# Ceylon Travo - Modern Tour Website

A dynamic, modern tour website built with React, TypeScript, and Vite. This application allows users to browse travel destinations and packages, while administrators can manage all content through an admin panel.

## Features

### User Features
- **Home Page**: Hero section with featured destinations
- **Packages**: Browse tour packages with advanced filters (destination, duration, price)
- **Locations**: Explore destinations by continent with search functionality
- **About Us**: Company information and why choose us
- **Contact Us**: Contact form and company contact information
- **WhatsApp Integration**: Floating WhatsApp button for instant communication

### Admin Features
- **Admin Authentication**: Secure login system
- **Dashboard**: Manage all website content
- **Location Management**: Add, edit, delete locations
- **Package Management**: Add, edit, delete tour packages
- **Featured Content**: Select which items appear on the home page
- **Local Storage**: All data persists in browser localStorage

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **React Router DOM** - Client-side routing
- **Vite** - Build tool and dev server
- **CSS3** - Modern styling with gradients and animations
- **LocalStorage** - Data persistence

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository or navigate to the project directory:
```bash
cd ceylontravo
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Admin Access

To access the admin panel:

1. Navigate to `/admin`
2. Use the default credentials:
   - **Username**: `admin`
   - **Password**: `admin123`

### Admin Features

- **Home Page Tab**: Select which locations appear as featured on the home page
- **Packages Tab**: Create, edit, and delete tour packages
- **Locations Tab**: Create, edit, and delete travel destinations

All changes are automatically saved to browser localStorage.

## Project Structure

```
ceylontravo/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── WhatsAppButton.tsx
│   ├── pages/              # Page components
│   │   ├── Home.tsx
│   │   ├── Packages.tsx
│   │   ├── Locations.tsx
│   │   ├── About.tsx
│   │   ├── Contact.tsx
│   │   ├── AdminLogin.tsx
│   │   └── AdminDashboard.tsx
│   ├── context/            # React Context
│   │   └── AppContext.tsx
│   ├── types/              # TypeScript types
│   │   └── index.ts
│   ├── utils/              # Utility functions
│   │   └── storage.ts
│   ├── App.tsx             # Main App component
│   ├── main.tsx            # Entry point
│   └── App.css             # Global styles
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Features Breakdown

### Data Persistence
All data is stored in browser localStorage using a centralized storage utility. The application initializes with default data on first load.

### Responsive Design
The website is fully responsive and works seamlessly on:
- Desktop (1400px+)
- Tablet (768px - 1399px)
- Mobile (< 768px)

### Modern UI/UX
- Gradient backgrounds
- Smooth animations and transitions
- Hover effects on cards
- Clean, modern design
- Intuitive navigation
- Accessibility considerations

## Customization

### Changing Default Admin Credentials

Edit the default admin credentials in `src/utils/storage.ts`:

```typescript
adminUser: {
  username: 'your-username',
  password: 'your-password'
}
```

### Changing Contact Information

Update contact details in `src/utils/storage.ts`:

```typescript
contactInfo: {
  email: 'your-email@example.com',
  phone: 'your-phone-number',
  address: 'your-address'
}
```

### Adding Sample Data

Sample locations and packages are pre-loaded in `src/utils/storage.ts`. You can modify these or add more through the admin panel.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Code splitting with React Router
- Optimized images with lazy loading
- Efficient state management with Context API
- Fast builds with Vite

## Future Enhancements

Potential improvements for future versions:
- Backend API integration
- User authentication and bookings
- Payment gateway integration
- Email notifications
- Image upload functionality
- Multi-language support
- SEO optimization
- Analytics integration

## License

This project is available for educational and commercial use.

## Support

For support or questions, contact: info@ceylontravo.com

---

**Built with ❤️ using React + TypeScript + Vite**
=======
# Ride-Hailing Driver Matching Simulator

A web-based simulation that demonstrates how ride-hailing apps match passengers to nearby drivers using classic data structures and algorithms.

## Tech Stack

- Language: TypeScript
- Backend: Node.js + Express + Socket.io
- Database: PostgreSQL
- ORM: Prisma
- Frontend: React + TypeScript + Vite
- Styling: TailwindCSS
- Map Visualization: Leaflet + OpenStreetMap
- Real-time Updates: Socket.io

## Project Structure

```text
ride-hailing-simulator
├── backend
│   ├── src
│   │   ├── controllers
│   │   ├── services
│   │   ├── algorithms
│   │   ├── queue
│   │   ├── routes
│   │   └── data
│   └── prisma
├── frontend
│   └── src
│       ├── components
│       ├── map
│       ├── simulation
│       └── pages
└── README.md
```

## Data Structures and Algorithms Demonstrated

1. Queue (FIFO)
- File: `backend/src/queue/Queue.ts`
- Methods implemented: `enqueue`, `dequeue`, `peek`
- Used for normal ride requests.

2. Priority Queue
- File: `backend/src/queue/PriorityQueue.ts`
- Priority requests are dequeued before normal requests.

3. Graph (City Road Network)
- File: `backend/src/algorithms/Graph.ts`
- Nodes = city points, edges = roads weighted by distance.

4. Shortest Path (Dijkstra)
- File: `backend/src/algorithms/dijkstra.ts`
- Computes the shortest weighted route from driver node to passenger node.

5. Greedy Matching
- File: `backend/src/services/MatchingService.ts`
- Driver score:

```text
driver_score = distance_to_passenger + estimated_arrival_time
```

- Chooses driver with minimum score.

6. ETA Formula

```text
ETA = distance / average_speed
```

(implemented as minutes in `backend/src/algorithms/geo.ts`)

7. Spatial Filtering
- `MatchingService.findNearbyDrivers`
- Haversine distance to filter drivers within configurable radius (default 5 km).

## Simulation Flow

1. Passenger submits ride request.
2. Request enters queue (priority requests go first).
3. System finds nearby available drivers.
4. Dijkstra computes route distance.
5. Greedy matcher selects best driver.
6. Driver assigned and status becomes `busy`.
7. Driver movement is emitted in real time over Socket.io.
8. Pickup event occurs.
9. Ride completes; driver becomes `available` again.

## Database Schema (PostgreSQL + Prisma)

Defined in `backend/prisma/schema.prisma` with:

- `Driver`
  - id, name, latitude, longitude, status, rating
- `RideRequest`
  - id, passengerLat, passengerLng, destinationLat, destinationLng, priority, status
- `Ride`
  - id, driverId, requestId, startTime, endTime, distance, status

SQL version of schema and seed data:
- `backend/prisma/init.sql`

## API Routes

Base URL: `http://localhost:4000`

- `GET /health`
- `GET /drivers`
- `POST /drivers`
- `GET /requests`
- `POST /requests`
- `GET /simulation/state`
- `POST /simulation/process`

### Sample Request Bodies

Add driver:

```json
{
  "name": "New Driver",
  "latitude": 6.9271,
  "longitude": 79.8612,
  "rating": 4.7
}
```

Add ride request:

```json
{
  "passengerLat": 6.9260,
  "passengerLng": 79.8581,
  "destinationLat": 6.9440,
  "destinationLng": 79.8751,
  "priority": true
}
```

## Setup Instructions

### Prerequisites

- Node.js 18+
- PostgreSQL 14+

### 1. Install Dependencies

From project root:

```bash
npm run install:all
```

### 2. Configure Backend Environment

```bash
cd backend
cp .env.example .env
```

Update `DATABASE_URL` in `.env`.

### 3. Create Database Schema

Option A (Prisma):

```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
```

Option B (Raw SQL):

Run `backend/prisma/init.sql` in PostgreSQL.

### 4. Seed Example Data

```bash
npm run prisma:seed
```

### 5. Run Backend

```bash
npm run dev:backend
```

### 6. Run Frontend

In another terminal from root:

```bash
npm run dev:frontend
```

Open `http://localhost:5173`.

## Real-Time Event Channels (Socket.io)

- `simulation:state`
- `queue:updated`
- `ride:assigned`
- `driver:moved`
- `ride:picked_up`
- `ride:completed`

## Visual Legend

- Blue circular car icon: Driver
- Green marker: Passenger pickup
- Red marker: Destination

## Example Dataset

- JSON dataset: `backend/src/data/example-dataset.json`
- Prisma seed script: `backend/src/data/seed.ts`

## Academic Presentation Notes

This project can be demonstrated as:

- Queueing behavior under normal and VIP load
- Graph shortest path effect on ETA
- Greedy driver selection tradeoffs
- Real-time simulation of system state transitions

To highlight algorithmic behavior, submit multiple normal requests, then add a VIP request and observe immediate queue precedence and assignment.
>>>>>>> cd3e93e (first commit)
