const axios = require('axios');

const API_URL = 'http://localhost:8081/api';

// You'll need to replace this with an actual admin token from your application
const ADMIN_TOKEN = 'YOUR_ADMIN_TOKEN_HERE'; // Get this by logging in as admin

const sampleMerchandise = [
  {
    name: 'Batman Dark Knight Action Figure',
    description: 'Highly detailed 12-inch action figure of Batman from The Dark Knight trilogy. Features multiple points of articulation and comes with batarangs and grappling gun accessories.',
    price: 49.99,
    category: 'ACTION_FIGURES',
    imageUrl: 'https://m.media-amazon.com/images/I/71PNzZLLPCL._AC_SL1500_.jpg',
    stock: 25,
    relatedMovie: 'The Dark Knight',
    characterName: 'Batman',
    active: true
  },
  {
    name: 'Spider-Man Web Shooter Toy',
    description: 'Interactive web shooter toy that shoots foam webs! Perfect for young Spider-Man fans. Includes web fluid refills.',
    price: 34.99,
    category: 'TOYS',
    imageUrl: 'https://m.media-amazon.com/images/I/71fG7VZnZHL._AC_SL1500_.jpg',
    stock: 50,
    relatedMovie: 'Spider-Man: No Way Home',
    characterName: 'Spider-Man',
    active: true
  },
  {
    name: 'Iron Man Mark 50 Collectible Figure',
    description: 'Premium die-cast collectible figure from Avengers: Infinity War. Features LED light-up arc reactor and repulsor effects.',
    price: 299.99,
    category: 'COLLECTIBLES',
    imageUrl: 'https://m.media-amazon.com/images/I/71qZS0oJvCL._AC_SL1500_.jpg',
    stock: 10,
    relatedMovie: 'Avengers: Infinity War',
    characterName: 'Iron Man',
    active: true
  },
  {
    name: 'Grogu (Baby Yoda) Plush Toy',
    description: 'Adorable 11-inch plush of everyone\'s favorite character from The Mandalorian. Super soft and huggable!',
    price: 24.99,
    category: 'PLUSHIES',
    imageUrl: 'https://m.media-amazon.com/images/I/71KLjqBZ8oL._AC_SL1500_.jpg',
    stock: 75,
    relatedMovie: 'The Mandalorian',
    characterName: 'Grogu',
    active: true
  },
  {
    name: 'Joker Why So Serious T-Shirt',
    description: 'Premium quality cotton t-shirt featuring the iconic Joker quote "Why So Serious?" Available in multiple sizes.',
    price: 19.99,
    category: 'T-SHIRTS',
    imageUrl: 'https://m.media-amazon.com/images/I/61fY7yK1AFL._AC_SY741_.jpg',
    stock: 100,
    relatedMovie: 'The Dark Knight',
    characterName: 'Joker',
    active: true
  },
  {
    name: 'Avengers Movie Poster (27x40)',
    description: 'Official theatrical poster from Avengers: Endgame. High-quality print on premium paper.',
    price: 14.99,
    category: 'POSTERS',
    imageUrl: 'https://m.media-amazon.com/images/I/81ai6zx6eXL._AC_SL1304_.jpg',
    stock: 60,
    relatedMovie: 'Avengers: Endgame',
    characterName: 'Avengers',
    active: true
  },
  {
    name: 'Star Wars Lightsaber Toy',
    description: 'Electronic lightsaber with authentic sound effects and glowing blade. Choose your side of the Force!',
    price: 44.99,
    category: 'TOYS',
    imageUrl: 'https://m.media-amazon.com/images/I/71VTZvJ4XyL._AC_SL1500_.jpg',
    stock: 40,
    relatedMovie: 'Star Wars',
    characterName: 'Jedi',
    active: true
  },
  {
    name: 'Harry Potter Wand Replica',
    description: 'Authentic replica of Harry Potter\'s wand. Made from resin with detailed finish. Comes with display box.',
    price: 39.99,
    category: 'COLLECTIBLES',
    imageUrl: 'https://m.media-amazon.com/images/I/71YaFJv4YDL._AC_SL1500_.jpg',
    stock: 30,
    relatedMovie: 'Harry Potter',
    characterName: 'Harry Potter',
    active: true
  },
  {
    name: 'Captain America Shield',
    description: 'Full-size Captain America shield replica. Made from durable plastic with authentic design and straps.',
    price: 59.99,
    category: 'TOYS',
    imageUrl: 'https://m.media-amazon.com/images/I/71z+4hR5D0L._AC_SL1500_.jpg',
    stock: 35,
    relatedMovie: 'Captain America',
    characterName: 'Captain America',
    active: true
  },
  {
    name: 'Minions Coffee Mug',
    description: 'Ceramic coffee mug featuring the lovable Minions. Dishwasher and microwave safe. 12oz capacity.',
    price: 12.99,
    category: 'MUGS',
    imageUrl: 'https://m.media-amazon.com/images/I/71Y8kNvh3EL._AC_SL1500_.jpg',
    stock: 80,
    relatedMovie: 'Despicable Me',
    characterName: 'Minions',
    active: true
  },
  {
    name: 'Thor Mjolnir Hammer Toy',
    description: 'Electronic Thor hammer with authentic sound effects. Light-up feature included. Perfect for cosplay!',
    price: 54.99,
    category: 'TOYS',
    imageUrl: 'https://m.media-amazon.com/images/I/71v8Q8MFBSL._AC_SL1500_.jpg',
    stock: 28,
    relatedMovie: 'Thor',
    characterName: 'Thor',
    active: true
  },
  {
    name: 'Superman Logo T-Shirt',
    description: 'Classic Superman logo t-shirt. Premium cotton blend, comfortable fit. Available in multiple sizes.',
    price: 18.99,
    category: 'T-SHIRTS',
    imageUrl: 'https://m.media-amazon.com/images/I/71QGa3qQFZL._AC_SX679_.jpg',
    stock: 90,
    relatedMovie: 'Superman',
    characterName: 'Superman',
    active: true
  }
];

async function addMerchandise() {
  console.log('Starting to add merchandise items...\n');
  
  let successCount = 0;
  let failCount = 0;

  for (const item of sampleMerchandise) {
    try {
      const response = await axios.post(
        `${API_URL}/merchandise`,
        item,
        {
          headers: {
            'Authorization': `Bearer ${ADMIN_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log(`✓ Added: ${item.name}`);
      successCount++;
    } catch (error) {
      console.error(`✗ Failed to add ${item.name}:`, error.response?.data?.message || error.message);
      failCount++;
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`Successfully added: ${successCount} items`);
  console.log(`Failed: ${failCount} items`);
}

// Instructions
console.log('=================================');
console.log('Merchandise Data Loader');
console.log('=================================\n');
console.log('INSTRUCTIONS:');
console.log('1. Make sure your backend is running on http://localhost:8081');
console.log('2. Log in as admin in your application');
console.log('3. Open browser console and get your JWT token from localStorage');
console.log('4. Replace ADMIN_TOKEN variable in this script with your token');
console.log('5. Run: node add-merchandise-data.js\n');

if (ADMIN_TOKEN === 'YOUR_ADMIN_TOKEN_HERE') {
  console.log('⚠️  Please set the ADMIN_TOKEN before running this script!\n');
} else {
  addMerchandise();
}
