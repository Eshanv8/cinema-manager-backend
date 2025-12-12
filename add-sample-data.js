const axios = require('axios');

const BASE_URL = 'http://localhost:8081/api';

// Admin credentials
const ADMIN_EMAIL = 'admin@cinema.com';
const ADMIN_PASSWORD = 'admin123';

let adminToken = '';

// Login as admin
async function loginAdmin() {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });
    adminToken = response.data.token;
    console.log('✅ Admin logged in successfully');
    return true;
  } catch (error) {
    console.error('❌ Admin login failed:', error.response?.data || error.message);
    return false;
  }
}

// Get all movies
async function getMovies() {
  try {
    const response = await axios.get(`${BASE_URL}/movies`);
    console.log(`✅ Found ${response.data.length} movies`);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to get movies:', error.response?.data || error.message);
    return [];
  }
}

// Add showtimes for movies
async function addShowtimes(movies) {
  if (movies.length === 0) {
    console.log('⚠️ No movies found. Please add movies first.');
    return;
  }

  const times = ['10:30', '14:30', '18:00', '21:00'];
  const formats = ['2D', '3D', 'IMAX'];
  const screens = [1, 2, 3, 4];
  
  // Get dates for next 7 days
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }

  let successCount = 0;
  let failCount = 0;

  // Add showtimes for each movie
  for (const movie of movies.slice(0, 5)) { // First 5 movies
    for (const date of dates.slice(0, 3)) { // Next 3 days
      for (const time of times.slice(0, 2)) { // 2 times per day
        const format = formats[Math.floor(Math.random() * formats.length)];
        const screen = screens[Math.floor(Math.random() * screens.length)];
        const basePrice = format === 'IMAX' ? 18 : format === '3D' ? 15 : 12;

        const showtimeData = {
          movieId: movie.id,
          date: date,
          time: time,
          screen: screen,
          price: basePrice,
          format: format,
          availableSeats: 100
        };

        try {
          await axios.post(`${BASE_URL}/showtimes`, showtimeData, {
            headers: { Authorization: `Bearer ${adminToken}` }
          });
          successCount++;
          console.log(`✅ Added showtime: ${movie.title} - ${date} ${time} (${format})`);
        } catch (error) {
          failCount++;
          console.error(`❌ Failed to add showtime for ${movie.title}:`, error.response?.data || error.message);
        }
      }
    }
  }

  console.log(`\n📊 Showtimes Summary: ${successCount} added, ${failCount} failed`);
}

// Add food items
async function addFoodItems() {
  const foodItems = [
    { name: 'Large Popcorn', description: 'Freshly popped buttery popcorn', price: 8.99, category: 'Snacks', imageUrl: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=400', available: true },
    { name: 'Medium Popcorn', description: 'Classic movie popcorn', price: 6.99, category: 'Snacks', imageUrl: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400', available: true },
    { name: 'Nachos with Cheese', description: 'Crispy nachos with warm cheese sauce', price: 7.49, category: 'Snacks', imageUrl: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400', available: true },
    { name: 'Hot Dog', description: 'Classic hot dog with toppings', price: 5.99, category: 'Snacks', imageUrl: 'https://images.unsplash.com/photo-1612392062798-2dbaa27a0f7f?w=400', available: true },
    { name: 'Candy Mix', description: 'Assorted theater candies', price: 4.99, category: 'Candy', imageUrl: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400', available: true },
    { name: 'Coca Cola Large', description: 'Large fountain drink', price: 5.99, category: 'Beverages', imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400', available: true },
    { name: 'Coca Cola Medium', description: 'Medium fountain drink', price: 4.99, category: 'Beverages', imageUrl: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400', available: true },
    { name: 'Bottled Water', description: 'Refreshing bottled water', price: 3.99, category: 'Beverages', imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400', available: true },
    { name: 'Pretzel Bites', description: 'Warm soft pretzel bites with cheese', price: 6.49, category: 'Snacks', imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400', available: true },
    { name: 'Ice Cream Cup', description: 'Premium vanilla ice cream', price: 5.49, category: 'Desserts', imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400', available: true }
  ];

  let successCount = 0;
  let failCount = 0;

  for (const food of foodItems) {
    try {
      await axios.post(`${BASE_URL}/food`, food, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      successCount++;
      console.log(`✅ Added food item: ${food.name}`);
    } catch (error) {
      failCount++;
      console.error(`❌ Failed to add ${food.name}:`, error.response?.data || error.message);
    }
  }

  console.log(`\n📊 Food Items Summary: ${successCount} added, ${failCount} failed`);
}

// Add merchandise items
async function addMerchandise() {
  const merchandise = [
    { name: 'Movie Theater T-Shirt', description: 'Premium cotton theater branded t-shirt', price: 24.99, category: 'Apparel', imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', stock: 50, available: true },
    { name: 'Cinema Hoodie', description: 'Comfortable hoodie with cinema logo', price: 39.99, category: 'Apparel', imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400', stock: 30, available: true },
    { name: 'Popcorn Bucket Collector', description: 'Limited edition collectible popcorn bucket', price: 15.99, category: 'Collectibles', imageUrl: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400', stock: 100, available: true },
    { name: 'Movie Poster - Vintage', description: 'Classic movie poster reproduction', price: 19.99, category: 'Posters', imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400', stock: 25, available: true },
    { name: 'Cinema Cap', description: 'Adjustable baseball cap with logo', price: 18.99, category: 'Apparel', imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400', stock: 40, available: true },
    { name: 'Movie Night Gift Set', description: 'Includes t-shirt, popcorn bucket, and poster', price: 54.99, category: 'Gift Sets', imageUrl: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400', stock: 20, available: true },
    { name: 'Reusable Cup', description: 'Eco-friendly reusable movie cup', price: 12.99, category: 'Accessories', imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400', stock: 60, available: true },
    { name: 'Cinema Keychain', description: 'Metal keychain with theater charm', price: 7.99, category: 'Accessories', imageUrl: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=400', stock: 100, available: true },
    { name: 'Film Reel Decoration', description: 'Vintage style film reel wall art', price: 29.99, category: 'Collectibles', imageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400', stock: 15, available: true },
    { name: 'Movie Trivia Book', description: 'Cinema history and trivia book', price: 16.99, category: 'Books', imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400', stock: 35, available: true }
  ];

  let successCount = 0;
  let failCount = 0;

  for (const merch of merchandise) {
    try {
      await axios.post(`${BASE_URL}/merchandise`, merch, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      successCount++;
      console.log(`✅ Added merchandise: ${merch.name}`);
    } catch (error) {
      failCount++;
      console.error(`❌ Failed to add ${merch.name}:`, error.response?.data || error.message);
    }
  }

  console.log(`\n📊 Merchandise Summary: ${successCount} added, ${failCount} failed`);
}

// Main execution
async function main() {
  console.log('🎬 Starting Cinema Management System Data Population\n');

  // Login
  const loginSuccess = await loginAdmin();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without admin access');
    return;
  }

  // Get movies
  const movies = await getMovies();
  
  // Add data
  console.log('\n📅 Adding Showtimes...');
  await addShowtimes(movies);
  
  console.log('\n🍿 Adding Food Items...');
  await addFoodItems();
  
  console.log('\n🎁 Adding Merchandise...');
  await addMerchandise();

  console.log('\n✅ Data population completed!');
  console.log('\n💡 You can now view:');
  console.log('   - Showtimes for movies');
  console.log('   - Food items in the concession stand');
  console.log('   - Merchandise in the store');
}

main().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
