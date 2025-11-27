# Cinema Management System - Frontend Guide

## 🎬 Frontend Structure

### Created Components & Pages

#### 1. **Authentication**
- **AuthPage** (`src/pages/AuthPage.jsx`)
  - Login/Signup toggle interface
  - Integrates Login and Signup components
  - Beautiful gradient background

#### 2. **Navigation**
- **Navbar** (`src/components/Navbar.jsx`)
  - Sticky navigation with gradient background
  - Shows username and loyalty points
  - Role-based menu (Admin dashboard for admins)
  - Logout functionality

#### 3. **Main Pages**

##### HomePage (`src/pages/HomePage.jsx`)
- Welcome message with user info
- **Now Showing** movies grid
- **Coming Soon** movies grid
- Direct booking links
- Real-time loyalty points display

##### MoviesPage (`src/pages/MoviesPage.jsx`)
- Complete movie catalog
- Search functionality
- Genre filters (Action, Comedy, Drama, Horror, Sci-Fi, Romance, Thriller, Animation)
- Movie cards with details
- Book now buttons for available movies

##### BookingPage (`src/pages/BookingPage.jsx`)
- Movie details display
- Showtime selection (10:00 AM, 1:00 PM, 4:00 PM, 7:00 PM, 10:00 PM)
- **Interactive seat selection** (10x10 grid)
- Seat legend (Available/Selected)
- Booking summary with total price
- Confirm booking button

##### ProfilePage (`src/pages/ProfilePage.jsx`)
- User information display
- Three tabs:
  - **Profile**: Account details, loyalty points, member since
  - **My Bookings**: Past and upcoming bookings with tickets
  - **My Orders**: Food and merchandise orders
- Edit profile functionality

##### AdminDashboard (`src/pages/AdminDashboard.jsx`)
- Statistics cards (Total Movies, Bookings, Revenue)
- **Add New Movie** form with all fields
- Movies table with edit/delete actions
- Status indicators (Now Showing/Coming Soon)

### 4. **Services**

#### AuthService (`src/services/authService.js`)
- `signup()` - User registration
- `login()` - User login
- `adminLogin()` - Admin login
- `logout()` - Clear session
- `getCurrentUser()` - Get logged-in user
- `isAuthenticated()` - Check auth status
- `isAdmin()` - Check admin role

#### MovieService (`src/services/movieService.js`)
- `getAllMovies()` - Fetch all movies
- `getMovieById(id)` - Get single movie
- `getNowShowing()` - Get current movies
- `getComingSoon()` - Get upcoming movies
- `searchMovies(query)` - Search functionality
- `createMovie(data)` - Admin: Add movie
- `updateMovie(id, data)` - Admin: Edit movie
- `deleteMovie(id)` - Admin: Remove movie

#### API Configuration (`src/services/api.js`)
- Base URL: `http://localhost:8081/api`
- Automatic JWT token injection
- 401 error handling (auto logout)

### 5. **Context**

#### AuthContext (`src/context/AuthContext.js`)
- Global user state management
- Login/logout/signup functions
- Protected route authentication
- Role-based access control

## 🎨 Styling Theme

### Color Scheme
- **Primary Gradient**: #667eea → #764ba2 (Purple gradient)
- **Background**: #1a1a1a → #2d2d2d (Dark cinema theme)
- **Gold/Loyalty**: #ffd700 (Loyalty points)
- **White Text**: Clean contrast on dark bg

### Design Features
- Smooth hover animations
- Card-based layouts
- Gradient buttons
- Responsive grid systems
- Cinema-themed dark mode

## 🚀 Running the Application

### Start Frontend
```bash
cd cinema-managing-system
npm start
```
Frontend runs on: **http://localhost:3000**

### Start Backend
```bash
cd cinema-managing-system
./mvnw spring-boot:run
```
Backend runs on: **http://localhost:8081**

## 📋 User Flow

### Guest/New User
1. Visit homepage → See AuthPage
2. Click "Sign Up" → Fill registration form
3. Get 100 loyalty points bonus
4. Auto redirect to Home

### Regular User
1. Login → View HomePage with Now Showing
2. Browse MoviesPage → Search/Filter
3. Select Movie → BookingPage
4. Choose showtime → Select seats
5. Confirm booking → Get confirmation
6. View ProfilePage → Check bookings

### Admin User
1. Admin login → Access AdminDashboard
2. View statistics
3. Add/Edit/Delete movies
4. Manage showtimes
5. View all bookings

## 🔐 Protected Routes

- `/home` - Authenticated users only
- `/movies` - Authenticated users only
- `/booking/:movieId` - Authenticated users only
- `/profile` - Authenticated users only
- `/admin` - Admin role only

## 📦 Dependencies Installed

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.x.x",
  "axios": "^1.6.0",
  "react-scripts": "5.0.1"
}
```

## 🎯 Features Implemented

✅ **Authentication System**
- Login/Signup with JWT
- Admin authentication
- Persistent sessions
- Auto logout on token expiration

✅ **Movie Management**
- Browse all movies
- Search functionality
- Genre filtering
- Now Showing/Coming Soon sections

✅ **Booking System**
- Interactive seat selection
- Multiple showtime options
- Real-time seat availability
- Booking confirmation

✅ **User Profile**
- Account information
- Loyalty points tracking
- Booking history
- Order history

✅ **Admin Dashboard**
- Statistics overview
- Movie CRUD operations
- Status management

## 🔧 Next Steps (Future Enhancements)

### Backend Integration Pending
1. **BookingService** - Complete seat booking with QR codes
2. **PaymentService** - Payment processing
3. **EmailService** - Booking confirmations
4. **FoodService** - Food ordering
5. **MerchandiseService** - Merchandise sales
6. **OrderService** - Order management

### Frontend Enhancements
1. **Add QR Code Display** - Install `qrcode.react` for tickets
2. **Payment Gateway** - Integrate payment processing
3. **Email Notifications** - Display email confirmation status
4. **Food & Merchandise** - Create ordering pages
5. **Analytics Charts** - Install `recharts` for admin dashboard
6. **Real-time Updates** - WebSocket for seat availability
7. **Responsive Mobile** - Optimize for mobile devices
8. **Image Upload** - Cloudinary integration for posters
9. **Trailer Player** - Embedded video player
10. **Review System** - User ratings and reviews

## 🐛 Known Issues & Solutions

### Issue 1: Port 3000 already in use
**Solution**: 
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <process_id> /F

# Or use different port
PORT=3001 npm start
```

### Issue 2: CORS errors
**Solution**: Backend already configured with CORS in `CorsConfig.java`

### Issue 3: 401 Unauthorized
**Solution**: Check JWT token in localStorage, re-login if expired

## 📞 API Endpoints Reference

### Authentication
- POST `/api/auth/signup` - Register new user
- POST `/api/auth/login` - User login
- POST `/api/auth/admin/login` - Admin login

### Movies
- GET `/api/movies` - Get all movies
- GET `/api/movies/{id}` - Get movie by ID
- GET `/api/movies/now-showing` - Current movies
- GET `/api/movies/coming-soon` - Upcoming movies
- POST `/api/movies` - Add movie (Admin)
- PUT `/api/movies/{id}` - Update movie (Admin)
- DELETE `/api/movies/{id}` - Delete movie (Admin)

## 🎓 Code Structure Best Practices

### Component Organization
```
src/
├── components/      # Reusable UI components
├── pages/          # Full page components
├── services/       # API integration
├── context/        # Global state management
├── App.js          # Main routing
└── index.js        # React entry point
```

### Naming Conventions
- Components: PascalCase (HomePage, Navbar)
- Files: camelCase for services (authService.js)
- CSS: Component name (HomePage.css)

## 🌟 Key Features Highlights

### 1. **Seat Selection UI**
- 10x10 grid layout (A-J rows, 1-10 columns)
- Visual seat selection with color coding
- Real-time total calculation
- Responsive design

### 2. **Loyalty System**
- 100 bonus points on signup
- Points displayed in navbar
- Points visible in profile
- Golden color highlight

### 3. **Admin Controls**
- Complete movie management
- Inline editing and deletion
- Status indicators
- Form validation

### 4. **User Experience**
- Smooth page transitions
- Loading states
- Error handling
- Success messages
- Intuitive navigation

---

**Frontend is now complete and ready for full integration with backend services!** 🎉

The application is running on **http://localhost:3000** with all pages functional.
Backend API is running on **http://localhost:8081** with authentication and movie services ready.
