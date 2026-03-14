-- CreateEnum
CREATE TYPE "DriverStatus" AS ENUM ('available', 'busy');

-- CreateEnum
CREATE TYPE "RideRequestStatus" AS ENUM ('waiting', 'matched', 'picked_up', 'completed', 'cancelled');

-- CreateTable
CREATE TABLE "Driver" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "status" "DriverStatus" NOT NULL DEFAULT 'available',
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 4.5,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RideRequest" (
    "id" SERIAL NOT NULL,
    "passengerLat" DOUBLE PRECISION NOT NULL,
    "passengerLng" DOUBLE PRECISION NOT NULL,
    "destinationLat" DOUBLE PRECISION NOT NULL,
    "destinationLng" DOUBLE PRECISION NOT NULL,
    "priority" BOOLEAN NOT NULL DEFAULT false,
    "status" "RideRequestStatus" NOT NULL DEFAULT 'waiting',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RideRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ride" (
    "id" SERIAL NOT NULL,
    "driverId" INTEGER NOT NULL,
    "requestId" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),
    "distance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'assigned',

    CONSTRAINT "Ride_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ride_requestId_key" ON "Ride"("requestId");

-- AddForeignKey
ALTER TABLE "Ride" ADD CONSTRAINT "Ride_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ride" ADD CONSTRAINT "Ride_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "RideRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
