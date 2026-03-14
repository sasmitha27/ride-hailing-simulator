import prisma from '../src/prismaClient';
import bcrypt from 'bcrypt';

async function main() {
  // Clear existing data
  await prisma.package.deleteMany();
  await prisma.location.deleteMany();
  await prisma.adminUser.deleteMany();

  // Create locations
  const colombo = await prisma.location.create({ data: {
    name: 'Colombo',
    country: 'Sri Lanka',
    continent: 'Asia',
    description: 'The commercial capital offering vibrant markets, colonial architecture and coastal views.',
    imageUrl: '/uploads/colombo1.jpg',
    featured: true
  }});

  const kandy = await prisma.location.create({ data: {
    name: 'Kandy',
    country: 'Sri Lanka',
    continent: 'Asia',
    description: 'Hill city home to the Temple of the Tooth and scenic lake views.',
    imageUrl: '/uploads/temple2.jpg',
    featured: true
  }});

  const sigiriya = await prisma.location.create({ data: {
    name: 'Sigiriya',
    country: 'Sri Lanka',
    continent: 'Asia',
    description: 'Ancient rock fortress with stunning views and historical significance.',
    imageUrl: '/uploads/temple3.jpg',
    featured: true
  }});

  const galle = await prisma.location.create({ data: {
    name: 'Galle',
    country: 'Sri Lanka',
    continent: 'Asia',
    description: 'Historic fortified city on the southwest coast, with charming streets and beaches.',
    imageUrl: '/uploads/beach.jpg',
    featured: true
  }});

  const nuwara = await prisma.location.create({ data: {
    name: 'Nuwara Eliya',
    country: 'Sri Lanka',
    continent: 'Asia',
    description: 'Cool highland town amid tea plantations, waterfalls and colonial-era architecture.',
    imageUrl: '/uploads/hillcountry.jpg',
    featured: true
  }});

  // Create packages (Sri Lanka-focused)
  await prisma.package.create({ data: {
    title: 'Colombo City Highlights',
    destination: 'Colombo, Sri Lanka',
    locationId: colombo.id,
    duration: 2,
    price: 220.0,
    description: 'Discover Colombo’s markets, museums and coastal promenade with a local guide.',
    imageUrl: '/uploads/colombo1.jpg',
    includes: [ '2 Nights Hotel', 'City Tour', 'Breakfast' ],
    featured: true
  }});

  await prisma.package.create({ data: {
    title: 'Kandy Cultural Retreat',
    destination: 'Kandy, Sri Lanka',
    locationId: kandy.id,
    duration: 3,
    price: 330.0,
    description: 'Visit the Temple of the Tooth, botanical gardens and enjoy cultural performances.',
    imageUrl: '/uploads/temple2.jpg',
    includes: [ 'Hotel', 'Temple Visit', 'Guide', 'Breakfast' ],
    featured: true
  }});

  await prisma.package.create({ data: {
    title: 'Sigiriya & Cultural Triangle',
    destination: 'Sigiriya / Cultural Triangle, Sri Lanka',
    locationId: sigiriya.id,
    duration: 4,
    price: 520.0,
    description: 'Climb Sigiriya Rock, explore Polonnaruwa and nearby ancient sites.',
    imageUrl: '/uploads/temple3.jpg',
    includes: [ '3 Nights Accommodation', 'Entrance Fees', 'Guide', 'Breakfast' ],
    featured: true
  }});

  await prisma.package.create({ data: {
    title: 'Galle & Southern Beaches',
    destination: 'Galle, Sri Lanka',
    locationId: galle.id,
    duration: 3,
    price: 410.0,
    description: 'Explore Galle Fort, coastal villages and relax on pristine beaches.',
    imageUrl: '/uploads/beach.jpg',
    includes: [ 'Hotel', 'Fort Walking Tour', 'Breakfast' ],
    featured: true
  }});

  await prisma.package.create({ data: {
    title: 'Tea Country Escape (Nuwara Eliya)',
    destination: 'Nuwara Eliya, Sri Lanka',
    locationId: nuwara.id,
    duration: 3,
    price: 380.0,
    description: 'Wander tea plantations, visit a factory and enjoy cool highland scenery.',
    imageUrl: '/uploads/hillcountry.jpg',
    includes: [ 'Hotel', 'Tea Factory Visit', 'Breakfast' ],
    featured: true
  }});

  // Create admin user
  const hashed = await bcrypt.hash('admin123', 10);
  await prisma.adminUser.create({ data: { username: 'admin', password: hashed } });

  console.log('Seed complete');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
