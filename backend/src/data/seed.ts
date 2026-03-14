import { prisma } from "../prisma";

async function run(): Promise<void> {
  await prisma.ride.deleteMany();
  await prisma.rideRequest.deleteMany();
  await prisma.driver.deleteMany();

  await prisma.driver.createMany({
    data: [
      { name: "Nimal", latitude: 6.9275, longitude: 79.8616, rating: 4.8, status: "available" },
      { name: "Kasun", latitude: 6.9341, longitude: 79.8501, rating: 4.6, status: "available" },
      { name: "Ayesha", latitude: 6.9157, longitude: 79.8574, rating: 4.9, status: "available" },
      { name: "Ruwan", latitude: 6.9437, longitude: 79.8602, rating: 4.4, status: "available" },
      { name: "Tharushi", latitude: 6.9015, longitude: 79.8541, rating: 4.7, status: "available" }
    ]
  });

  await prisma.rideRequest.createMany({
    data: [
      {
        passengerLat: 6.9260,
        passengerLng: 79.8581,
        destinationLat: 6.9440,
        destinationLng: 79.8751,
        priority: false,
        status: "waiting"
      },
      {
        passengerLat: 6.9178,
        passengerLng: 79.8450,
        destinationLat: 6.9044,
        destinationLng: 79.8799,
        priority: true,
        status: "waiting"
      },
      {
        passengerLat: 6.9349,
        passengerLng: 79.8712,
        destinationLat: 6.9104,
        destinationLng: 79.8492,
        priority: false,
        status: "waiting"
      }
    ]
  });

  console.log("Seed data inserted.");
}

run()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
