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
    const moviesResponse = await axios.get(`${BASE_URL}/movies`);
    const movies = moviesResponse.data;
    console.log(`Found ${movies.length} movies\n`);

    // Create showtimes for next 3 days
    const times = ['10:30', '14:30', '18:30', '21:00'];
    const formats = ['2D', '3D', 'IMAX', '2D'];
    const today = new Date();
    
    let successCount = 0;
    let failCount = 0;

    for (let movie of movies.slice(0, 5)) {
      console.log(`\nAdding showtimes for: ${movie.title}`);
      
      for (let day = 0; day < 3; day++) {
        const date = new Date(today);
        date.setDate(today.getDate() + day);
        const dateStr = date.toISOString().split('T')[0];

        for (let i = 0; i < 4; i++) {
          try {
            const showtimeData = {
              movieId: movie.id,
              date: dateStr,
              time: times[i],
              screen: (i % 5) + 1,
              price: 15.00,
              format: formats[i],
              availableSeats: 100
            };

            console.log(`  Creating: ${dateStr} ${times[i]} Screen ${showtimeData.screen} ${formats[i]}`);

            const response = await axios.post(`${BASE_URL}/showtimes`, showtimeData, {
              headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });

            if (response.status === 200 || response.status === 201) {
              successCount++;
              process.stdout.write('✓');
            }
          } catch (err) {
            failCount++;
            process.stdout.write('✗');
            if (err.response) {
              console.log(`\n  Error: ${err.response.status} - ${err.response.data.message || err.response.statusText}`);
            } else {
              console.log(`\n  Error: ${err.message}`);
            }
          }
        }
      }
      console.log(' Done!');
    }

    console.log(`\n\n✅ Summary:`);
    console.log(`   Success: ${successCount} showtimes`);
    console.log(`   Failed: ${failCount} showtimes`);
  } catch (error) {
    console.error('\n❌ Fatal Error:', error.response?.data || error.message);
  }
}

addShowtimes();
