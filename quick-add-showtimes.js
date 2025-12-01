const axios = require('axios');

const BASE_URL = 'http://localhost:8081/api';

async function addShowtimes() {
  try {
    console.log('Logging in as admin...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@cinema.com',
      password: 'admin123'
    });

    const token = loginResponse.data.token;
    console.log('✓ Login successful!\n');

    // Get all movies
    const moviesResponse = await axios.get(`${BASE_URL}/movies`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const movies = moviesResponse.data;
    console.log(`Found ${movies.length} movies\n`);

    // Create showtimes for next 3 days, 3 times per day
    const times = ['10:00', '15:00', '20:00'];
    const formats = ['2D', '3D', 'IMAX'];
    const today = new Date();
    
    let count = 0;

    for (let movie of movies.slice(0, 5)) {
      console.log(`Adding showtimes for: ${movie.title}`);
      
      for (let day = 0; day < 3; day++) {
        const date = new Date(today);
        date.setDate(today.getDate() + day);
        const dateStr = date.toISOString().split('T')[0];

        for (let i = 0; i < 3; i++) {
          try {
            await axios.post(`${BASE_URL}/showtimes`, {
              movieId: movie.id,
              date: dateStr,
              time: times[i],
              screen: (i % 3) + 1,
              price: 15,
              format: formats[i],
              availableSeats: 100
            }, {
              headers: { Authorization: `Bearer ${token}` }
            });
            count++;
            process.stdout.write('.');
          } catch (err) {
            process.stdout.write('x');
          }
        }
      }
      console.log(' Done!');
    }

    console.log(`\n✅ Added ${count} showtimes successfully!`);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

addShowtimes();
