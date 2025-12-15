import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import movieService from '../services/movieService';
import merchandiseService from '../services/merchandiseService';
import foodService from '../services/foodService';
import systemConfigService from '../services/systemConfigService';
import userService from '../services/userService';
import ShowtimeManagement from '../components/ShowtimeManagement';
import './AdminDashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [movies, setMovies] = useState([]);
  const [merchandise, setMerchandise] = useState([]);
  const [foods, setFoods] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [foodCategories, setFoodCategories] = useState(['POPCORN', 'DRINKS', 'SNACKS', 'COMBOS']);
  const [merchandiseCategories, setMerchandiseCategories] = useState(['POSTERS', 'TOYS', 'CLOTHING']);
  
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
    category: 'TOYS',
    imageUrl: '',
    stock: '',
    bundle: false,
    bundleMovieId: '',
    relatedMovie: '',
    characterName: '',
    active: true
  });

  // Food Form State
  const [showAddFood, setShowAddFood] = useState(false);
  const [newFood, setNewFood] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
    size: 'MEDIUM',
    combo: false,
    seatDelivery: true,
    active: true
  });

  // Admin Form State
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    username: '',
    email: '',
    password: '',
    phone: ''
  });
  const [adminMessage, setAdminMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadMovies();
    loadMerchandise();
    loadFoods();
    loadSystemConfigs();
  }, []);

  useEffect(() => {
    if (activeTab === 'admins') {
      loadAdmins();
    }
  }, [activeTab]);

  const loadSystemConfigs = async () => {
    try {
      const foodCats = await systemConfigService.getConfigValue('FOOD_CATEGORIES');
      const merchCats = await systemConfigService.getConfigValue('MERCHANDISE_CATEGORIES');
      
      if (foodCats) {
        setFoodCategories(foodCats);
        setNewFood(prev => ({ ...prev, category: foodCats[0] || 'POPCORN' }));
      }
      if (merchCats) {
        setMerchandiseCategories(merchCats);
        setNewMerchandise(prev => ({ ...prev, category: merchCats[0] || 'POSTERS' }));
      }
    } catch (error) {
      console.error('Error loading system configs:', error);
    }
  };

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
      console.log('Loading foods...');
      console.log('User:', user);
      console.log('Token:', localStorage.getItem('token'));
      
      const response = await foodService.getAllFoodsAdmin();
      console.log('Food items response:', response);
      console.log('Is array?', Array.isArray(response));
      console.log('Response length:', response?.length);
      
      if (Array.isArray(response)) {
        setFoods(response);
        console.log('Set foods to:', response);
      } else {
        console.warn('Response is not an array:', response);
        setFoods([]);
      }
    } catch (error) {
      console.error('Error loading foods:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      console.error('Error message:', error.message);
      
      const errorMsg = `Failed to load food items. Status: ${error.response?.status}. ${error.response?.data?.message || error.message}`;
      alert(errorMsg);
      setFoods([]);
    }
  };

  const loadAdmins = async () => {
    try {
      const data = await userService.getAllAdmins();
      setAdmins(data);
    } catch (error) {
      console.error('Error loading admins:', error);
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
        category: 'TOYS',
        imageUrl: '',
        stock: '',
        bundle: false,
        bundleMovieId: '',
        relatedMovie: '',
        characterName: '',
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
      // Check if user is logged in
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in as admin to add food items.');
        navigate('/');
        return;
      }

      // Convert numeric fields
      const foodData = {
        ...newFood,
        price: parseFloat(newFood.price) || 0
      };
      
      console.log('Creating food with data:', foodData);
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
      console.error('Error response:', error.response);
      console.error('Error request:', error.request);
      
      if (error.response) {
        // Server responded with error
        alert('Error adding food: ' + (error.response?.data?.message || error.response?.data || 'Server error'));
      } else if (error.request) {
        // Request made but no response
        alert('Network Error: Cannot connect to server. Please ensure the backend is running on http://localhost:8081');
      } else {
        // Something else happened
        alert('Error adding food: ' + error.message);
      }
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

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/');
    }
  };

  // Admin User Creation Handlers
  const handleAdminChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setAdminMessage({ type: '', text: '' });

    // Validation
    if (!newAdmin.username || !newAdmin.email || !newAdmin.password) {
      setAdminMessage({ type: 'error', text: 'Please fill in all required fields' });
      return;
    }

    if (newAdmin.password.length < 6) {
      setAdminMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
      return;
    }

    if (!newAdmin.email.includes('@')) {
      setAdminMessage({ type: 'error', text: 'Please enter a valid email address' });
      return;
    }

    try {
      await userService.createAdminUser(newAdmin);
      setAdminMessage({ type: 'success', text: 'Admin user created successfully!' });
      
      // Reload admin list
      loadAdmins();
      
      // Reset form
      setNewAdmin({
        username: '',
        email: '',
        password: '',
        phone: ''
      });
      
      // Hide form after 2 seconds
      setTimeout(() => {
        setShowAddAdmin(false);
        setAdminMessage({ type: '', text: '' });
      }, 2000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create admin user';
      setAdminMessage({ type: 'error', text: errorMessage });
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="admin-panel">
      {/* Admin Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>CINEMA ADMIN</h2>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {isSidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <div className="admin-profile">
          <div className="admin-avatar">
            {user?.username?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="admin-info">
            <p className="admin-name">{user?.username || 'Admin'}</p>
            <span className="admin-role">Administrator</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-text">Overview</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'movies' ? 'active' : ''}`}
            onClick={() => setActiveTab('movies')}
          >
            <span className="nav-icon">🎬</span>
            <span className="nav-text">Movies</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'showtimes' ? 'active' : ''}`}
            onClick={() => setActiveTab('showtimes')}
          >
            <span className="nav-icon">🎞️</span>
            <span className="nav-text">Showtimes</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'merchandise' ? 'active' : ''}`}
            onClick={() => setActiveTab('merchandise')}
          >
            <span className="nav-icon">🛍️</span>
            <span className="nav-text">Merchandise</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'foods' ? 'active' : ''}`}
            onClick={() => setActiveTab('foods')}
          >
            <span className="nav-icon">🍿</span>
            <span className="nav-text">Food & Drinks</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'offers' ? 'active' : ''}`}
            onClick={() => setActiveTab('offers')}
          >
            <span className="nav-icon">🎁</span>
            <span className="nav-text">Offers & Deals</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'admins' ? 'active' : ''}`}
            onClick={() => setActiveTab('admins')}
          >
            <span className="nav-icon">👥</span>
            <span className="nav-text">Admin Users</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            <span className="nav-text">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-content">
        <div className="content-header">
          <h1 className="page-title">
            {activeTab === 'overview' && '📊 Dashboard Overview'}
            {activeTab === 'movies' && '🎬 Movie Management'}
            {activeTab === 'showtimes' && '🎞️ Showtime Management'}
            {activeTab === 'merchandise' && '🛍️ Merchandise Management'}
            {activeTab === 'foods' && '🍿 Food & Beverage Management'}
            {activeTab === 'offers' && '🎁 Offers & Promotions'}
            {activeTab === 'admins' && '👥 Admin User Management'}
          </h1>
          <div className="header-actions">
            <span className="timestamp">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="dashboard-overview">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">🎬</div>
                <div className="stat-details">
                  <h3>Total Movies</h3>
                  <p className="stat-value">{movies.length}</p>
                  <span className="stat-label">Now Showing: {movies.filter(m => m.nowShowing).length}</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🛍️</div>
                <div className="stat-details">
                  <h3>Merchandise</h3>
                  <p className="stat-value">{merchandise.length}</p>
                  <span className="stat-label">Active Items</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🍿</div>
                <div className="stat-details">
                  <h3>Food Items</h3>
                  <p className="stat-value">{foods.length}</p>
                  <span className="stat-label">Available</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-details">
                  <h3>Revenue</h3>
                  <p className="stat-value">$0</p>
                  <span className="stat-label">This Month</span>
                </div>
              </div>
            </div>

            <div className="quick-actions">
              <h2>Quick Actions</h2>
              <div className="action-buttons">
                <button className="action-card" onClick={() => setActiveTab('movies')}>
                  <span className="action-icon">➕</span>
                  <span>Add New Movie</span>
                </button>
                <button className="action-card" onClick={() => setActiveTab('showtimes')}>
                  <span className="action-icon">🎞️</span>
                  <span>Manage Showtimes</span>
                </button>
                <button className="action-card" onClick={() => setActiveTab('merchandise')}>
                  <span className="action-icon">🛍️</span>
                  <span>Add Merchandise</span>
                </button>
                <button className="action-card" onClick={() => setActiveTab('offers')}>
                  <span className="action-icon">🎁</span>
                  <span>Create Offer</span>
                </button>
              </div>
            </div>

            <div className="recent-activity">
              <h2>Recent Movies</h2>
              <div className="activity-list">
                {movies.slice(0, 5).map(movie => (
                  <div key={movie.id} className="activity-item">
                    <img src={movie.posterUrl || 'https://via.placeholder.com/60x90'} alt={movie.title} />
                    <div className="activity-info">
                      <h4>{movie.title}</h4>
                      <p>{movie.genre} • {movie.duration} min</p>
                      <span className={`badge ${movie.nowShowing ? 'active' : 'inactive'}`}>
                        {movie.nowShowing ? 'Now Showing' : 'Coming Soon'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

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
                      {merchandiseCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      step="1"
                      name="price"
                      placeholder="Price (LKR)"
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
                      name="relatedMovie"
                      placeholder="Related Movie (e.g., The Dark Knight)"
                      value={newMerchandise.relatedMovie}
                      onChange={handleMerchandiseInputChange}
                    />
                    <input
                      type="text"
                      name="characterName"
                      placeholder="Character Name (e.g., Batman)"
                      value={newMerchandise.characterName}
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
                      <td>Rs. {item.price}</td>
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
              <button className="add-movie-btn" onClick={loadFoods} style={{marginLeft: '10px'}}>
                🔄 Refresh Food Items
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
                      {foodCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
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
                      step="1"
                      name="price"
                      placeholder="Price (LKR)"
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
              {foods.length === 0 ? (
                <p>No food items found. Add your first food item above.</p>
              ) : (
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
                      <tr key={item.id || item._id}>
                        <td>{item.name}</td>
                        <td>{item.category}</td>
                        <td>{item.size}</td>
                        <td>Rs. {item.price}</td>
                        <td>{item.salesCount || 0}</td>
                        <td>
                          <span className={`status ${item.active ? 'showing' : 'upcoming'}`}>
                            {item.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <button className="delete-btn-small" onClick={() => handleDeleteFood(item.id || item._id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {activeTab === 'showtimes' && (
          <div className="tab-content">
            <ShowtimeManagement />
          </div>
        )}

        {/* Offers Tab */}
        {activeTab === 'offers' && (
          <div className="tab-content">
            <div className="offers-section">
              <div className="section-header-with-action">
                <h2>Manage Offers & Promotions</h2>
                <button className="btn-primary">+ Create New Offer</button>
              </div>
              <div className="empty-state">
                <div className="empty-icon">🎁</div>
                <h3>No Offers Yet</h3>
                <p>Create special offers and promotions to attract more customers</p>
                <button className="btn-secondary">Create First Offer</button>
              </div>
            </div>
          </div>
        )}

        {/* Admin User Management */}
        {activeTab === 'admins' && (
          <div className="tab-content">
            <div className="admin-users-section">
              <div className="section-header-with-action">
                <h2>Manage Admin Users</h2>
                <button 
                  className="btn-primary"
                  onClick={() => setShowAddAdmin(!showAddAdmin)}
                >
                  {showAddAdmin ? '✕ Cancel' : '+ Create New Admin'}
                </button>
              </div>

              {/* Existing Admins List */}
              {admins.length > 0 && !showAddAdmin && (
                <div className="admins-list-container">
                  <h3>Current Admin Users ({admins.length})</h3>
                  <div className="admins-grid">
                    {admins.map((admin) => (
                      <div key={admin.id} className="admin-card">
                        <div className="admin-card-header">
                          <div className="admin-avatar">
                            {admin.username?.charAt(0).toUpperCase() || 'A'}
                          </div>
                          <div className="admin-info">
                            <h4>{admin.username}</h4>
                            <span className="admin-role-badge">ADMIN</span>
                          </div>
                        </div>
                        <div className="admin-card-body">
                          <div className="info-row">
                            <span className="info-label">📧 Email:</span>
                            <span className="info-value">{admin.email}</span>
                          </div>
                          {admin.phone && (
                            <div className="info-row">
                              <span className="info-label">📱 Phone:</span>
                              <span className="info-value">{admin.phone}</span>
                            </div>
                          )}
                          <div className="info-row">
                            <span className="info-label">📅 Created:</span>
                            <span className="info-value">
                              {new Date(admin.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="info-row">
                            <span className="info-label">Status:</span>
                            <span className={`status-badge ${admin.active ? 'active' : 'inactive'}`}>
                              {admin.active ? '✓ Active' : '✗ Inactive'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Admin Creation Form */}
              {showAddAdmin && (
                <div className="form-container">
                  <h3>Create New Admin Account</h3>
                  <p className="form-subtitle">Add a new administrator to manage the cinema system</p>
                  
                  {adminMessage.text && (
                    <div className={`message ${adminMessage.type}`}>
                      {adminMessage.text}
                    </div>
                  )}

                  <form onSubmit={handleCreateAdmin} className="admin-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Username *</label>
                        <input
                          type="text"
                          name="username"
                          value={newAdmin.username}
                          onChange={handleAdminChange}
                          placeholder="Enter username"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Email *</label>
                        <input
                          type="email"
                          name="email"
                          value={newAdmin.email}
                          onChange={handleAdminChange}
                          placeholder="Enter email address"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Password *</label>
                        <input
                          type="password"
                          name="password"
                          value={newAdmin.password}
                          onChange={handleAdminChange}
                          placeholder="Enter password (min 6 characters)"
                          minLength="6"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={newAdmin.phone}
                          onChange={handleAdminChange}
                          placeholder="Enter phone number (optional)"
                        />
                      </div>
                    </div>

                    <div className="form-actions">
                      <button type="submit" className="btn-primary">
                        Create Admin User
                      </button>
                      <button 
                        type="button" 
                        className="btn-secondary"
                        onClick={() => {
                          setShowAddAdmin(false);
                          setAdminMessage({ type: '', text: '' });
                          setNewAdmin({
                            username: '',
                            email: '',
                            password: '',
                            phone: ''
                          });
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Admin Users Info */}
              {!showAddAdmin && (
                <div className="info-card">
                  <div className="info-icon">👥</div>
                  <h3>Admin User Management</h3>
                  <p>Create and manage administrator accounts for your cinema system.</p>
                  <ul className="info-list">
                    <li>✅ Admin users have full access to all management features</li>
                    <li>✅ Each admin can manage movies, showtimes, merchandise, and food items</li>
                    <li>✅ Admins can create other admin accounts</li>
                    <li>✅ Secure password encryption for all accounts</li>
                  </ul>
                  <button 
                    className="btn-primary"
                    onClick={() => setShowAddAdmin(true)}
                  >
                    Create Your First Admin
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
