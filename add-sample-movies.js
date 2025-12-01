const axios = require('axios');

// Real movies with actual IMDb data
const sampleMovies = [
  {
    title: "Oppenheimer",
    description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.",
    duration: 180,
    genre: "Biography, Drama, History",
    rating: "R",
    releaseDate: "2023-07-21T00:00:00.000Z",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODgtNzc2M2QyZGE5NTVjXkEyXkFqcGdeQXVyNzAwMjU2MTY@._V1_SX300.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=uYPbbksJxIg",
    imdbRating: 8.3,
    director: "Christopher Nolan",
    cast: ["Cillian Murphy", "Emily Blunt", "Matt Damon", "Robert Downey Jr."],
    language: "English",
    nowShowing: true,
    comingSoon: false,
    featured: true
  },
  {
    title: "Barbie",
    description: "Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land. However, when they get a chance to go to the real world, they soon discover the joys and perils of living among humans.",
    duration: 114,
    genre: "Adventure, Comedy, Fantasy",
    rating: "PG-13",
    releaseDate: "2023-07-21T00:00:00.000Z",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BNjU3N2QxNzYtMjk1NC00MTc4LTk1NTQtMmUxNTljM2I0NDA5XkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_SX300.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=pBk4NYhWNMM",
    imdbRating: 6.8,
    director: "Greta Gerwig",
    cast: ["Margot Robbie", "Ryan Gosling", "Issa Rae", "Kate McKinnon"],
    language: "English",
    nowShowing: true,
    comingSoon: false,
    featured: true
  },
  {
    title: "Dune: Part Two",
    description: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    duration: 166,
    genre: "Action, Adventure, Drama",
    rating: "PG-13",
    releaseDate: "2024-03-01T00:00:00.000Z",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BN2QyZGU4ZDctOWMzMy00NTc5LThlOGQtODhmNDI1NmY5YzAwXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_SX300.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=Way9Dexny3w",
    imdbRating: 8.5,
    director: "Denis Villeneuve",
    cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson", "Josh Brolin"],
    language: "English",
    nowShowing: true,
    comingSoon: false,
    featured: true
  },
  {
    title: "The Batman",
    description: "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption and question his family's involvement.",
    duration: 176,
    genre: "Action, Crime, Drama",
    rating: "PG-13",
    releaseDate: "2022-03-04T00:00:00.000Z",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BM2MyNTAwZGEtNTAxNC00ODVjLTgzZjUtYmU0YjAzNmQyNDAwXkEyXkFqcGdeQXVyNDc2NTg3NzA@._V1_SX300.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=mqqft2x_Aa4",
    imdbRating: 7.8,
    director: "Matt Reeves",
    cast: ["Robert Pattinson", "Zoë Kravitz", "Jeffrey Wright", "Colin Farrell"],
    language: "English",
    nowShowing: true,
    comingSoon: false,
    featured: false
  },
  {
    title: "Spider-Man: Across the Spider-Verse",
    description: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.",
    duration: 140,
    genre: "Animation, Action, Adventure",
    rating: "PG",
    releaseDate: "2023-06-02T00:00:00.000Z",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMzI0NmVkMjEtYmY4MS00ZDMxLTlkZmEtMzU4MDQxYTMzMjU2XkEyXkFqcGdeQXVyMzQ0MzA0NTM@._V1_SX300.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=cqGjhVJWtEg",
    imdbRating: 8.7,
    director: "Joaquim Dos Santos, Kemp Powers, Justin K. Thompson",
    cast: ["Shameik Moore", "Hailee Steinfeld", "Oscar Isaac", "Jake Johnson"],
    language: "English",
    nowShowing: true,
    comingSoon: false,
    featured: true
  },
  {
    title: "Guardians of the Galaxy Vol. 3",
    description: "Still reeling from the loss of Gamora, Peter Quill rallies his team to defend the universe and one of their own - a mission that could mean the end of the Guardians if not successful.",
    duration: 150,
    genre: "Action, Adventure, Comedy",
    rating: "PG-13",
    releaseDate: "2023-05-05T00:00:00.000Z",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMDgxOTdjMzYtZGQxMS00ZTAzLWI4Y2UtMTQzN2VlYjYyZWRiXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SX300.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=u3V5KDHRQvk",
    imdbRating: 7.9,
    director: "James Gunn",
    cast: ["Chris Pratt", "Zoe Saldana", "Dave Bautista", "Karen Gillan"],
    language: "English",
    nowShowing: true,
    comingSoon: false,
    featured: false
  },
  {
    title: "Inception",
    description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    duration: 148,
    genre: "Action, Sci-Fi, Thriller",
    rating: "PG-13",
    releaseDate: "2010-07-16T00:00:00.000Z",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=YoHD9XEInc0",
    imdbRating: 8.8,
    director: "Christopher Nolan",
    cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page", "Tom Hardy"],
    language: "English",
    nowShowing: true,
    comingSoon: false,
    featured: true
  },
  {
    title: "The Dark Knight",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    duration: 152,
    genre: "Action, Crime, Drama",
    rating: "PG-13",
    releaseDate: "2008-07-18T00:00:00.000Z",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=EXeTwQWrcwY",
    imdbRating: 9.0,
    director: "Christopher Nolan",
    cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart", "Michael Caine"],
    language: "English",
    nowShowing: true,
    comingSoon: false,
    featured: true
  },
  {
    title: "Interstellar",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    duration: 169,
    genre: "Adventure, Drama, Sci-Fi",
    rating: "PG-13",
    releaseDate: "2014-11-07T00:00:00.000Z",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
    imdbRating: 8.7,
    director: "Christopher Nolan",
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain", "Michael Caine"],
    language: "English",
    nowShowing: true,
    comingSoon: false,
    featured: false
  },
  {
    title: "Avatar: The Way of Water",
    description: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na'vi race to protect their home.",
    duration: 192,
    genre: "Action, Adventure, Fantasy",
    rating: "PG-13",
    releaseDate: "2022-12-16T00:00:00.000Z",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BYjhiNjBlODctY2ZiOC00YjVlLWFlNzAtNTVhNzM1YjI1NzMxXkEyXkFqcGdeQXVyMjQxNTE1MDA@._V1_SX300.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=d9MyW72ELq0",
    imdbRating: 7.6,
    director: "James Cameron",
    cast: ["Sam Worthington", "Zoe Saldana", "Sigourney Weaver", "Kate Winslet"],
    language: "English",
    nowShowing: false,
    comingSoon: true,
    featured: true
  }
];

const API_URL = 'http://localhost:8081/api';

// You'll need to login as admin first and get the token
async function addMovies() {
  try {
    console.log('Please login as admin first and paste your token:');
    console.log('Steps:');
    console.log('1. Open browser DevTools (F12)');
    console.log('2. Go to Console tab');
    console.log('3. Type: localStorage.getItem("token")');
    console.log('4. Copy the token (without quotes)');
    console.log('5. Edit this script and replace YOUR_ADMIN_TOKEN_HERE with your token');
    console.log('6. Run: node add-sample-movies.js');
    console.log('\nOr use the admin credentials to login:');
    
    // Login first
    const loginResponse = await axios.post(`${API_URL}/auth/admin/login`, {
      email: 'admin@cinema.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('\n✓ Logged in as admin successfully');
    
    // Add each movie
    let successCount = 0;
    let failCount = 0;
    
    for (const movie of sampleMovies) {
      try {
        await axios.post(`${API_URL}/movies`, movie, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log(`✓ Added: ${movie.title}`);
        successCount++;
      } catch (error) {
        console.error(`✗ Failed to add ${movie.title}:`, error.response?.data?.message || error.message);
        failCount++;
      }
    }
    
    console.log(`\n=== Summary ===`);
    console.log(`Successfully added: ${successCount} movies`);
    console.log(`Failed: ${failCount} movies`);
    console.log('\nRefresh your admin dashboard to see the new movies!');
    
  } catch (error) {
    console.error('Error:', error.response?.data?.message || error.message);
    console.log('\nMake sure:');
    console.log('1. Backend is running on port 8081');
    console.log('2. Admin account exists (email: admin@cinema.com, password: admin123)');
    console.log('3. MongoDB is connected');
  }
}

addMovies();
