import { prisma } from "../prisma";

async function run(): Promise<void> {
  await prisma.ride.deleteMany();
  await prisma.rideRequest.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.customer?.deleteMany?.();

  await prisma.driver.createMany({
    data: [
      { name: "Nimal", latitude: 6.9275, longitude: 79.8616, rating: 4.8, status: "available" },
      { name: "Kasun", latitude: 6.9341, longitude: 79.8501, rating: 4.6, status: "available" },
      { name: "Ayesha", latitude: 6.9157, longitude: 79.8574, rating: 4.9, status: "available" },
      { name: "Ruwan", latitude: 6.9437, longitude: 79.8602, rating: 4.4, status: "available" },
      { name: "Tharushi", latitude: 6.9015, longitude: 79.8541, rating: 4.7, status: "available" },
      { name: "Dilshan", latitude: 6.9280, longitude: 79.8620, rating: 4.5, status: "available" },
      { name: "Kamal", latitude: 6.9202, longitude: 79.8548, rating: 4.6, status: "available" },
      { name: "Priya", latitude: 6.9311, longitude: 79.8605, rating: 4.9, status: "available" },
      { name: "Saman", latitude: 6.9184, longitude: 79.8682, rating: 4.3, status: "available" },
      { name: "Chathura", latitude: 6.9390, longitude: 79.8550, rating: 4.6, status: "available" }
    ]
  });

  // create 20 seeded customers with Sri Lankan names and coordinates on land (Colombo)
  const seededCustomers = [
    { name: "Supun", latitude: 6.927200, longitude: 79.857500 },
    { name: "Rashmi", latitude: 6.934000, longitude: 79.850000 },
    { name: "Dinuka", latitude: 6.915500, longitude: 79.857000 },
    { name: "Madhushanka", latitude: 6.943000, longitude: 79.860000 },
    { name: "Amal", latitude: 6.901500, longitude: 79.854000 },
    { name: "Sanduni", latitude: 6.935000, longitude: 79.865000 },
    { name: "Nadeesha", latitude: 6.920000, longitude: 79.870000 },
    { name: "Shani", latitude: 6.930000, longitude: 79.845000 },
    { name: "Kumudini", latitude: 6.940000, longitude: 79.855000 },
    { name: "Thushara", latitude: 6.925000, longitude: 79.875000 },
    { name: "Isuru", latitude: 6.912400, longitude: 79.868500 },
    { name: "Hasini", latitude: 6.946200, longitude: 79.848900 },
    { name: "Yohan", latitude: 6.919300, longitude: 79.842700 },
    { name: "Piumi", latitude: 6.907800, longitude: 79.861300 },
    { name: "Sachintha", latitude: 6.938600, longitude: 79.872100 },
    { name: "Navodi", latitude: 6.923700, longitude: 79.853600 },
    { name: "Kavindu", latitude: 6.932800, longitude: 79.878200 },
    { name: "Mihiri", latitude: 6.917000, longitude: 79.876400 },
    { name: "Roshan", latitude: 6.944900, longitude: 79.865700 },
    { name: "Vihangi", latitude: 6.909900, longitude: 79.846300 }
  ];

  // recreate customers (safe if model exists)
  try {
    await prisma.customer.deleteMany();
    await prisma.customer.createMany({ data: seededCustomers });
  } catch (err) {
    // if migrations haven't been applied yet, ignore here
  }

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
