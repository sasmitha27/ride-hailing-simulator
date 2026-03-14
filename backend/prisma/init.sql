CREATE TYPE driver_status AS ENUM ('available', 'busy');
CREATE TYPE ride_request_status AS ENUM ('waiting', 'matched', 'picked_up', 'completed', 'cancelled');

CREATE TABLE IF NOT EXISTS drivers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  status driver_status NOT NULL DEFAULT 'available',
  rating DOUBLE PRECISION NOT NULL DEFAULT 4.5
);

CREATE TABLE IF NOT EXISTS ride_requests (
  id SERIAL PRIMARY KEY,
  passenger_lat DOUBLE PRECISION NOT NULL,
  passenger_lng DOUBLE PRECISION NOT NULL,
  destination_lat DOUBLE PRECISION NOT NULL,
  destination_lng DOUBLE PRECISION NOT NULL,
  priority BOOLEAN NOT NULL DEFAULT false,
  status ride_request_status NOT NULL DEFAULT 'waiting',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rides (
  id SERIAL PRIMARY KEY,
  driver_id INTEGER NOT NULL REFERENCES drivers(id),
  request_id INTEGER UNIQUE NOT NULL REFERENCES ride_requests(id),
  start_time TIMESTAMP NULL,
  end_time TIMESTAMP NULL,
  distance DOUBLE PRECISION NOT NULL DEFAULT 0,
  status VARCHAR(50) NOT NULL DEFAULT 'assigned'
);

INSERT INTO drivers (name, latitude, longitude, status, rating) VALUES
('Nimal', 6.9275, 79.8616, 'available', 4.8),
('Kasun', 6.9341, 79.8501, 'available', 4.6),
('Ayesha', 6.9157, 79.8574, 'available', 4.9),
('Ruwan', 6.9437, 79.8602, 'available', 4.4),
('Tharushi', 6.9015, 79.8541, 'available', 4.7)
ON CONFLICT DO NOTHING;

INSERT INTO ride_requests (
  passenger_lat, passenger_lng, destination_lat, destination_lng, priority, status
) VALUES
(6.9260, 79.8581, 6.9440, 79.8751, false, 'waiting'),
(6.9178, 79.8450, 6.9044, 79.8799, true, 'waiting'),
(6.9349, 79.8712, 6.9104, 79.8492, false, 'waiting')
ON CONFLICT DO NOTHING;
