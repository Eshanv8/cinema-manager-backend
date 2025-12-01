const axios = require('axios');

const API_URL = 'http://localhost:8081/api';

// Generate showtimes for the next 7 days
function generateShowtimes() {
  const showtimes = [];
  const today = new Date();
  const formats = ['2D', '3D', 'IMAX'];
  const basePrice = 12.00;
  
  // Times: 10 AM, 1 PM, 4 PM, 7 PM, 10 PM
  const times = [10, 13, 16, 19, 22];
  
  // Generate for next 7 days
  for (let day = 0; day < 7; day++) {
    const date = new Date(today);
    date.setDate(date.getDate() + day);
    
    times.forEach(hour => {
      const showDateTime = new Date(date);
      showDateTime.setHours(hour, 0, 0, 0);
      
      formats.forEach((format, idx) => {
        const priceMultiplier = format === 'IMAX' ? 1.5 : format === '3D' ? 1.3 : 1.0;
        showtimes.push({
          showDateTime: showDateTime.toISOString(),
          screenNumber: `Screen ${(idx % 3) + 1}`,
          format: format,
          price: basePrice * priceMultiplier,
          totalSeats: 100,
          availableSeats: 100,
          active: true
        });
      });
    });
  }
  
  return showtimes;
}

async function addShowtimesForMovies() {
  try {
    console.log('Logging in as admin...');
    
    // Login as admin
    const loginResponse = await axios.post(`${API_URL}/auth/admin/login`, {
      email: 'admin@cinema.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✓ Logged in successfully\n');
    
    // Get all movies
    console.log('Fetching movies...');
    const moviesResponse = await axios.get(`${API_URL}/movies`);
    const movies = moviesResponse.data;
    console.log(`✓ Found ${movies.length} movies\n`);
    
    if (movies.length === 0) {
      console.log('No movies found. Please add movies first.');
      return;
    }
    
    let totalShowtimes = 0;
    
    // Add showtimes for each movie
    for (const movie of movies) {
      console.log(`Adding showtimes for: ${movie.title}`);
      const showtimes = generateShowtimes();
      
      let successCount = 0;
      for (const showtime of showtimes) {
        try {
          await axios.post(`${API_URL}/showtimes`, {
            ...showtime,
            movieId: movie.id
          }, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          successCount++;
        } catch (error) {
          console.error(`  ✗ Failed to add showtime: ${error.response?.data?.message || error.message}`);
        }
      }
      
      console.log(`  ✓ Added ${successCount} showtimes`);
      totalShowtimes += successCount;
    }
    
    console.log(`\n=== Summary ===`);
    console.log(`Total showtimes added: ${totalShowtimes}`);
    console.log(`Showtimes per movie: ${totalShowtimes / movies.length}`);
    console.log(`\nShowtimes include:`);
    console.log(`- Next 7 days`);
    console.log(`- 5 times per day: 10 AM, 1 PM, 4 PM, 7 PM, 10 PM`);
    console.log(`- 3 formats: 2D ($12), 3D ($15.60), IMAX ($18)`);
    console.log(`- 3 screens`);
    console.log(`\nRefresh your booking page to see the showtimes!`);
    
  } catch (error) {
    console.error('Error:', error.response?.data?.message || error.message);
    console.log('\nMake sure:');
    console.log('1. Backend is running on port 8081');
    console.log('2. Admin account exists (email: admin@cinema.com, password: admin123)');
    console.log('3. MongoDB is connected');
  }
}

addShowtimesForMovies();
