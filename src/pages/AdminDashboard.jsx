import React, { useEffect, useState } from 'react';
import movieService from '../services/movieService';
import merchandiseService from '../services/merchandiseService';
import foodService from '../services/foodService';
import ShowtimeManagement from '../components/ShowtimeManagement';
import './AdminDashboard.css';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('movies');
  const [movies, setMovies] = useState([]);
  const [merchandise, setMerchandise] = useState([]);
  const [foods, setFoods] = useState([]);
  
  // Movie Form State
  const [showAddMovie, setShowAddMovie] = useState(false);
  const [newMovie, setNewMovie] = useState({
    title: '',
    description: '',
    genre: '',
    duration: '',
    rating: '',
    releaseDate: '',
    posterUrl: '',
    trailerUrl: '',
    nowShowing: true,
    comingSoon: false
  });

  // Merchandise Form State
  const [showAddMerchandise, setShowAddMerchandise] = useState(false);
  const [newMerchandise, setNewMerchandise] = useState({
    name: '',
    description: '',
    price: '',
    category: 'POSTERS',
    imageUrl: '',
    stock: '',
    bundle: false,
    bundleMovieId: '',
    active: true
  });

  // Food Form State
  const [showAddFood, setShowAddFood] = useState(false);
  const [newFood, setNewFood] = useState({
    name: '',
    description: '',
    price: '',
    category: 'POPCORN',
    imageUrl: '',
    size: 'MEDIUM',
    combo: false,
    seatDelivery: true,
    active: true
  });

  useEffect(() => {
    loadMovies();
    loadMerchandise();
    loadFoods();
  }, []);

  const loadMovies = async () => {
    try {
      const response = await movieService.getAllMovies();
      setMovies(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error loading movies:', error);
      setMovies([]);
    }
  };

  const loadMerchandise = async () => {
    try {
      const response = await merchandiseService.getAllMerchandiseAdmin();
      setMerchandise(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error loading merchandise:', error);
      setMerchandise([]);
    }
  };

  const loadFoods = async () => {
    try {
      const response = await foodService.getAllFoodsAdmin();
      setFoods(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error loading foods:', error);
      setFoods([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewMovie({
      ...newMovie,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleAddMovie = async (e) => {
    e.preventDefault();
    try {
      // Convert duration to integer and format releaseDate properly
      const movieData = {
        ...newMovie,
        duration: parseInt(newMovie.duration) || 0,
        releaseDate: newMovie.releaseDate ? new Date(newMovie.releaseDate).toISOString() : new Date().toISOString()
      };
      
      await movieService.createMovie(movieData);
      alert('Movie added successfully!');
      setShowAddMovie(false);
      setNewMovie({
        title: '',
        description: '',
        genre: '',
        duration: '',
        rating: '',
        releaseDate: '',
        posterUrl: '',
        trailerUrl: '',
        nowShowing: true,
        comingSoon: false
      });
      loadMovies();
    } catch (error) {
      console.error('Full error:', error);
      alert('Error adding movie: ' + (error.response?.data?.message || error.message || 'Unknown error'));
    }
  };

  const handleDeleteMovie = async (id) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        await movieService.deleteMovie(id);
        alert('Movie deleted successfully!');
        loadMovies();
      } catch (error) {
        alert('Error deleting movie: ' + (error.response?.data?.message || 'Unknown error'));
      }
    }
  };

  // Merchandise Handlers
  const handleMerchandiseInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewMerchandise({
      ...newMerchandise,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleAddMerchandise = async (e) => {
    e.preventDefault();
    try {
      // Convert numeric fields
      const merchandiseData = {
        ...newMerchandise,
        price: parseFloat(newMerchandise.price) || 0,
        stock: parseInt(newMerchandise.stock) || 0
      };
      
      await merchandiseService.createMerchandise(merchandiseData);
      alert('Merchandise added successfully!');
      setShowAddMerchandise(false);
      setNewMerchandise({
        name: '',
        description: '',
        price: '',
        category: 'POSTERS',
        imageUrl: '',
        stock: '',
        bundle: false,
        bundleMovieId: '',
        active: true
      });
      loadMerchandise();
    } catch (error) {
      console.error('Full error:', error);
      alert('Error adding merchandise: ' + (error.response?.data?.message || error.message || 'Unknown error'));
    }
  };

  const handleDeleteMerchandise = async (id) => {
    if (window.confirm('Are you sure you want to delete this merchandise?')) {
      try {
        await merchandiseService.deleteMerchandise(id);
        alert('Merchandise deleted successfully!');
        loadMerchandise();
      } catch (error) {
        alert('Error deleting merchandise: ' + (error.response?.data?.message || 'Unknown error'));
      }
    }
  };

  // Food Handlers
  const handleFoodInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewFood({
      ...newFood,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleAddFood = async (e) => {
    e.preventDefault();
    try {
      // Convert numeric fields
      const foodData = {
        ...newFood,
        price: parseFloat(newFood.price) || 0
      };
      
      await foodService.createFood(foodData);
      alert('Food item added successfully!');
      setShowAddFood(false);
      setNewFood({
        name: '',
        description: '',
        price: '',
        category: 'POPCORN',
        imageUrl: '',
        size: 'MEDIUM',
        combo: false,
        seatDelivery: true,
        active: true
      });
      loadFoods();
    } catch (error) {
      console.error('Full error:', error);
      alert('Error adding food: ' + (error.response?.data?.message || error.message || 'Unknown error'));
    }
  };

  const handleDeleteFood = async (id) => {
    if (window.confirm('Are you sure you want to delete this food item?')) {
      try {
        await foodService.deleteFood(id);
        alert('Food item deleted successfully!');
        loadFoods();
      } catch (error) {
        alert('Error deleting food: ' + (error.response?.data?.message || 'Unknown error'));
      }
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-container">
        <h1>🎬 Admin Dashboard</h1>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Movies</h3>
            <p className="stat-value">{movies.length}</p>
          </div>
          <div className="stat-card">
            <h3>Merchandise Items</h3>
            <p className="stat-value">{merchandise.length}</p>
          </div>
          <div className="stat-card">
            <h3>Food Items</h3>
            <p className="stat-value">{foods.length}</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'movies' ? 'active' : ''}`}
            onClick={() => setActiveTab('movies')}
          >
            🎬 Movies
          </button>
          <button 
            className={`tab-btn ${activeTab === 'merchandise' ? 'active' : ''}`}
            onClick={() => setActiveTab('merchandise')}
          >
            🛍️ Merchandise
          </button>
          <button 
            className={`tab-btn ${activeTab === 'foods' ? 'active' : ''}`}
            onClick={() => setActiveTab('foods')}
          >
            🍿 Foods
          </button>
          <button 
            className={`tab-btn ${activeTab === 'showtimes' ? 'active' : ''}`}
            onClick={() => setActiveTab('showtimes')}
          >
            🎞️ Showtimes
          </button>
        </div>

        {/* Movies Tab */}
        {activeTab === 'movies' && (
          <div className="tab-content">
            <div className="actions-bar">
              <button className="add-movie-btn" onClick={() => setShowAddMovie(!showAddMovie)}>
                {showAddMovie ? 'Cancel' : '+ Add New Movie'}
              </button>
            </div>

            {showAddMovie && (
              <div className="add-movie-form">
                <h2>Add New Movie</h2>
                <form onSubmit={handleAddMovie}>
                  <div className="form-grid">
                    <input
                      type="text"
                      name="title"
                      placeholder="Movie Title"
                      value={newMovie.title}
                      onChange={handleInputChange}
                      required
                    />
                    <input
                      type="text"
                      name="genre"
                      placeholder="Genre"
                      value={newMovie.genre}
                      onChange={handleInputChange}
                      required
                    />
                    <input
                      type="number"
                      name="duration"
                      placeholder="Duration (minutes)"
                      value={newMovie.duration}
                      onChange={handleInputChange}
                      required
                    />
                    <input
                      type="number"
                      step="0.1"
                      name="rating"
                      placeholder="Rating (0-10)"
                      value={newMovie.rating}
                      onChange={handleInputChange}
                      required
                    />
                    <input
                      type="date"
                      name="releaseDate"
                      value={newMovie.releaseDate}
                      onChange={handleInputChange}
                      required
                    />
                    <input
                      type="url"
                      name="posterUrl"
                      placeholder="Poster URL"
                      value={newMovie.posterUrl}
                      onChange={handleInputChange}
                    />
                    <input
                      type="url"
                      name="trailerUrl"
                      placeholder="Trailer URL"
                      value={newMovie.trailerUrl}
                      onChange={handleInputChange}
                    />
                  </div>
                  <textarea
                    name="description"
                    placeholder="Movie Description"
                    value={newMovie.description}
                    onChange={handleInputChange}
                    rows="4"
                    required
                  />
                  <div className="checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        name="nowShowing"
                        checked={newMovie.nowShowing}
                        onChange={handleInputChange}
                      />
                      Now Showing
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        name="comingSoon"
                        checked={newMovie.comingSoon}
                        onChange={handleInputChange}
                      />
                      Coming Soon
                    </label>
                  </div>
                  <button type="submit" className="submit-btn">Add Movie</button>
                </form>
              </div>
            )}

            <div className="movies-table">
              <h2>All Movies</h2>
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Genre</th>
                    <th>Duration</th>
                    <th>Rating</th>
                    <th>Trailer</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {movies.map(movie => (
                    <tr key={movie.id}>
                      <td>{movie.title}</td>
                      <td>{movie.genre}</td>
                      <td>{movie.duration} min</td>
                      <td>⭐ {movie.rating}</td>
                      <td>
                        {movie.trailerUrl && (
                          <a href={movie.trailerUrl} target="_blank" rel="noopener noreferrer" className="trailer-link">
                            Watch
                          </a>
                        )}
                      </td>
                      <td>
                        <span className={`status ${movie.nowShowing ? 'showing' : 'upcoming'}`}>
                          {movie.nowShowing ? 'Now Showing' : 'Coming Soon'}
                        </span>
                      </td>
                      <td>
                        <button className="delete-btn-small" onClick={() => handleDeleteMovie(movie.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Merchandise Tab */}
        {activeTab === 'merchandise' && (
          <div className="tab-content">
            <div className="actions-bar">
              <button className="add-movie-btn" onClick={() => setShowAddMerchandise(!showAddMerchandise)}>
                {showAddMerchandise ? 'Cancel' : '+ Add New Merchandise'}
              </button>
            </div>

            {showAddMerchandise && (
              <div className="add-movie-form">
                <h2>Add New Merchandise</h2>
                <form onSubmit={handleAddMerchandise}>
                  <div className="form-grid">
                    <input
                      type="text"
                      name="name"
                      placeholder="Product Name"
                      value={newMerchandise.name}
                      onChange={handleMerchandiseInputChange}
                      required
                    />
                    <select
                      name="category"
                      value={newMerchandise.category}
                      onChange={handleMerchandiseInputChange}
                      required
                    >
                      <option value="POSTERS">Posters</option>
                      <option value="T-SHIRTS">T-Shirts</option>
                      <option value="MUGS">Mugs</option>
                      <option value="COLLECTIBLES">Collectibles</option>
                    </select>
                    <input
                      type="number"
                      step="0.01"
                      name="price"
                      placeholder="Price"
                      value={newMerchandise.price}
                      onChange={handleMerchandiseInputChange}
                      required
                    />
                    <input
                      type="number"
                      name="stock"
                      placeholder="Stock Quantity"
                      value={newMerchandise.stock}
                      onChange={handleMerchandiseInputChange}
                      required
                    />
                    <input
                      type="url"
                      name="imageUrl"
                      placeholder="Image URL"
                      value={newMerchandise.imageUrl}
                      onChange={handleMerchandiseInputChange}
                    />
                    <input
                      type="text"
                      name="bundleMovieId"
                      placeholder="Bundle Movie ID (optional)"
                      value={newMerchandise.bundleMovieId}
                      onChange={handleMerchandiseInputChange}
                    />
                  </div>
                  <textarea
                    name="description"
                    placeholder="Product Description"
                    value={newMerchandise.description}
                    onChange={handleMerchandiseInputChange}
                    rows="4"
                    required
                  />
                  <div className="checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        name="bundle"
                        checked={newMerchandise.bundle}
                        onChange={handleMerchandiseInputChange}
                      />
                      Bundle Item
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        name="active"
                        checked={newMerchandise.active}
                        onChange={handleMerchandiseInputChange}
                      />
                      Active
                    </label>
                  </div>
                  <button type="submit" className="submit-btn">Add Merchandise</button>
                </form>
              </div>
            )}

            <div className="movies-table">
              <h2>All Merchandise</h2>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Sales</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {merchandise.map(item => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.category}</td>
                      <td>${item.price}</td>
                      <td>{item.stock}</td>
                      <td>{item.salesCount}</td>
                      <td>
                        <span className={`status ${item.active ? 'showing' : 'upcoming'}`}>
                          {item.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <button className="delete-btn-small" onClick={() => handleDeleteMerchandise(item.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Foods Tab */}
        {activeTab === 'foods' && (
          <div className="tab-content">
            <div className="actions-bar">
              <button className="add-movie-btn" onClick={() => setShowAddFood(!showAddFood)}>
                {showAddFood ? 'Cancel' : '+ Add New Food Item'}
              </button>
            </div>

            {showAddFood && (
              <div className="add-movie-form">
                <h2>Add New Food Item</h2>
                <form onSubmit={handleAddFood}>
                  <div className="form-grid">
                    <input
                      type="text"
                      name="name"
                      placeholder="Food Name"
                      value={newFood.name}
                      onChange={handleFoodInputChange}
                      required
                    />
                    <select
                      name="category"
                      value={newFood.category}
                      onChange={handleFoodInputChange}
                      required
                    >
                      <option value="POPCORN">Popcorn</option>
                      <option value="DRINKS">Drinks</option>
                      <option value="SNACKS">Snacks</option>
                      <option value="COMBOS">Combos</option>
                    </select>
                    <select
                      name="size"
                      value={newFood.size}
                      onChange={handleFoodInputChange}
                      required
                    >
                      <option value="SMALL">Small</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="LARGE">Large</option>
                    </select>
                    <input
                      type="number"
                      step="0.01"
                      name="price"
                      placeholder="Price"
                      value={newFood.price}
                      onChange={handleFoodInputChange}
                      required
                    />
                    <input
                      type="url"
                      name="imageUrl"
                      placeholder="Image URL"
                      value={newFood.imageUrl}
                      onChange={handleFoodInputChange}
                    />
                  </div>
                  <textarea
                    name="description"
                    placeholder="Food Description"
                    value={newFood.description}
                    onChange={handleFoodInputChange}
                    rows="4"
                    required
                  />
                  <div className="checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        name="combo"
                        checked={newFood.combo}
                        onChange={handleFoodInputChange}
                      />
                      Combo Deal
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        name="seatDelivery"
                        checked={newFood.seatDelivery}
                        onChange={handleFoodInputChange}
                      />
                      Seat Delivery
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        name="active"
                        checked={newFood.active}
                        onChange={handleFoodInputChange}
                      />
                      Active
                    </label>
                  </div>
                  <button type="submit" className="submit-btn">Add Food Item</button>
                </form>
              </div>
            )}

            <div className="movies-table">
              <h2>All Food Items</h2>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Size</th>
                    <th>Price</th>
                    <th>Sales</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {foods.map(item => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.category}</td>
                      <td>{item.size}</td>
                      <td>${item.price}</td>
                      <td>{item.salesCount}</td>
                      <td>
                        <span className={`status ${item.active ? 'showing' : 'upcoming'}`}>
                          {item.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <button className="delete-btn-small" onClick={() => handleDeleteFood(item.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'showtimes' && (
          <ShowtimeManagement />
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
