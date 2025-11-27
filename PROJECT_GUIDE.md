# Cinema Management System - Full Stack Application

## 🎬 Project Overview
A comprehensive cinema management system with three user roles (Guest, User, Admin), featuring seat booking, food ordering, merchandise sales, loyalty points, QR tickets, and analytics dashboard.

## 📋 Features Completed

### Backend (Spring Boot + MongoDB)
- ✅ All Model Classes Created (10 entities)
  - User, Category, Movie, Showtime, Seat, Booking, Payment
  - Merchandise, Food, Order, LoyaltyTransaction
  
- ✅ All Repository Interfaces Created
  - Spring Data MongoDB repositories with custom query methods
  
- ✅ JWT Authentication Implemented
  - JwtTokenProvider, JwtAuthenticationFilter
  - CustomUserDetailsService
  - Role-based access control (GUEST, USER, ADMIN)
  
- ✅ Security Configuration
  - Stateless session management
  - Public endpoints for guest access
  - Protected endpoints for users and admins
  
- ✅ DTO Classes
  - LoginRequest, SignupRequest, JwtResponse, MessageResponse
  
- ✅ Updated Dependencies
  - JWT (jjwt 0.12.3)
  - Email support
  - QR Code generation (ZXing)
  - Lombok for clean code

## 🚀 Next Steps - Implementation Guide

### 1. Complete Service Layer

Create these service files in `src/main/java/com/example/cinema/managing/system/service/`:

#### MovieService.java
```java
@Service
public class MovieService {
    @Autowired private MovieRepository movieRepository;
    
    // Methods: getAllMovies, getMovieById, getNowShowing, 
    // getComingSoon, getFeatured, searchMovies, 
    // getMostPopular, incrementViewCount, etc.
}
```

#### BookingService.java
```java
@Service
public class BookingService {
    @Autowired private BookingRepository bookingRepository;
    @Autowired private SeatRepository seatRepository;
    @Autowired private ShowtimeRepository showtimeRepository;
    
    // Methods: createBooking, getUserBookings, generateQRCode,
    // cancelBooking, confirmBooking, etc.
}
```

#### EmailService.java
```java
@Service
public class EmailService {
    @Autowired private JavaMailSender mailSender;
    
    // Methods: sendBookingConfirmation, sendQRCode,
    // sendWelcomeEmail, etc.
}
```

### 2. Create REST Controllers

#### MovieController.java
```java
@RestController
@RequestMapping("/api/movies")
public class MovieController {
    // GET /api/movies - all movies
    // GET /api/movies/{id} - movie by ID
    // GET /api/movies/now-showing
    // GET /api/movies/coming-soon
    // GET /api/movies/popular
    // POST /api/movies/{id}/view - increment view count
}
```

#### BookingController.java
```java
@RestController
@RequestMapping("/api/bookings")
@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
public class BookingController {
    // POST /api/bookings/create
    // GET /api/bookings/user/{userId}
    // GET /api/bookings/{id}
    // PUT /api/bookings/{id}/cancel
    // GET /api/bookings/qr/{bookingCode}
}
```

#### AdminController.java
```java
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    // CRUD for movies, categories, showtimes
    // CRUD for merchandise, food
    // User management
    // Analytics endpoints
}
```

### 3. Frontend Setup with TailwindCSS

#### Install Dependencies
```bash
npm install -D tailwindcss postcss autoprefixer
npm install axios react-router-dom @heroicons/react
npm install recharts # for analytics charts
npm install qrcode.react # for QR code display
npx tailwindcss init -p
```

#### tailwind.config.js
```javascript
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'cinema-dark': '#0a0a0a',
        'cinema-gray': '#1a1a1a',
        'neon-pink': '#ff006e',
        'neon-blue': '#00f5ff',
        'neon-purple': '#8b00ff',
      },
      fontFamily: {
        'cinema': ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

#### src/index.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-cinema-dark text-white font-cinema;
  }
}

@layer components {
  .btn-primary {
    @apply bg-gradient-to-r from-neon-pink to-neon-purple 
           px-6 py-3 rounded-lg font-bold 
           hover:shadow-lg hover:shadow-neon-pink/50 
           transition-all duration-300;
  }
  
  .card-cinema {
    @apply bg-cinema-gray rounded-xl p-6 
           border border-gray-800 
           hover:border-neon-blue/50 
           transition-all duration-300;
  }
}
```

### 4. React Component Structure

```
src/
├── components/
│   ├── common/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Loader.jsx
│   │   └── ErrorBoundary.jsx
│   ├── auth/
│   │   ├── Login.jsx (update existing)
│   │   ├── Signup.jsx (update existing)
│   │   └── ProtectedRoute.jsx
│   ├── home/
│   │   ├── Hero.jsx
│   │   ├── FeaturedMovies.jsx
│   │   ├── PopularToday.jsx
│   │   └── Categories.jsx
│   ├── movies/
│   │   ├── MovieCard.jsx
│   │   ├── MovieDetail.jsx
│   │   ├── MovieList.jsx
│   │   └── TrailerPlayer.jsx
│   ├── booking/
│   │   ├── ShowtimeSelector.jsx
│   │   ├── SeatSelection.jsx
│   │   ├── BookingSummary.jsx
│   │   └── PaymentForm.jsx
│   ├── user/
│   │   ├── Profile.jsx
│   │   ├── BookingHistory.jsx
│   │   ├── OrderHistory.jsx
│   │   └── LoyaltyPoints.jsx
│   ├── admin/
│   │   ├── Dashboard.jsx
│   │   ├── MovieManagement.jsx
│   │   ├── BookingManagement.jsx
│   │   ├── UserManagement.jsx
│   │   └── Analytics.jsx
│   ├── food/
│   │   ├── FoodMenu.jsx
│   │   ├── FoodCart.jsx
│   │   └── FoodOrder.jsx
│   └── merchandise/
│       ├── MerchandiseList.jsx
│       ├── MerchandiseDetail.jsx
│       └── MerchandiseCart.jsx
├── context/
│   ├── AuthContext.jsx
│   ├── CartContext.jsx
│   └── ThemeContext.jsx
├── services/
│   ├── api.js
│   ├── authService.js
│   ├── movieService.js
│   ├── bookingService.js
│   └── adminService.js
├── utils/
│   ├── constants.js
│   ├── validators.js
│   └── helpers.js
└── pages/
    ├── HomePage.jsx
    ├── MoviesPage.jsx
    ├── MovieDetailPage.jsx
    ├── BookingPage.jsx
    ├── ProfilePage.jsx
    ├── AdminPage.jsx
    └── NotFoundPage.jsx
```

### 5. API Service Setup

#### src/services/api.js
```javascript
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8081/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
```

### 6. Key Features to Implement

#### Seat Selection Component
- Interactive grid layout (rows A-J, columns 1-10)
- Color coding: Available (green), Selected (blue), Booked (red), VIP (gold)
- Real-time seat availability
- Touch/click to select multiple seats

#### QR Code Ticket
- Generate QR on booking confirmation
- Display in booking details
- Email as attachment
- Scan at cinema entrance

#### Loyalty Points System
- Earn: 10 points per $1 spent
- Redeem: 100 points = $1 discount
- Display in user profile
- Transaction history

#### Admin Analytics Dashboard
- Total revenue chart (recharts)
- Most popular movies (bar chart)
- User growth (line chart)
- Food & merchandise revenue
- Recent bookings table
- System statistics

### 7. Sample Controller Implementations

Create these files next:

1. **CategoryController.java** - CRUD for categories
2. **ShowtimeController.java** - Showtime management
3. **MerchandiseController.java** - Merchandise operations
4. **FoodController.java** - Food menu operations
5. **OrderController.java** - Food/merchandise orders
6. **UserController.java** - User profile management
7. **AnalyticsController.java** - Admin analytics data

### 8. MongoDB Collections Structure

The system will create these collections:
- `users` - User accounts with roles
- `categories` - Movie categories
- `movies` - Movie information
- `showtimes` - Show schedules
- `seats` - Seat inventory
- `bookings` - Ticket bookings
- `payments` - Payment records
- `merchandise` - Merchandise items
- `foods` - Food menu items
- `orders` - Food/merchandise orders
- `loyalty_transactions` - Points history

## 🔐 API Endpoints Overview

### Public Endpoints
- POST /api/auth/signup
- POST /api/auth/login
- GET /api/movies/**
- GET /api/categories/**

### User Endpoints (Requires JWT)
- GET /api/bookings/user/{userId}
- POST /api/bookings/create
- GET /api/user/profile
- POST /api/orders/create

### Admin Endpoints (Requires ADMIN role)
- POST /api/admin/movies
- PUT /api/admin/movies/{id}
- DELETE /api/admin/movies/{id}
- GET /api/admin/analytics/**

## 🎨 Design Guidelines

### Colors
- Background: #0a0a0a (pure black)
- Cards: #1a1a1a (dark gray)
- Accent: #ff006e (neon pink)
- Secondary: #00f5ff (neon blue)
- Highlight: #8b00ff (neon purple)

### Typography
- Headings: Bold, 2xl-4xl
- Body: Regular, base-lg
- Buttons: Semibold, uppercase

### Animations
- Hover effects with scale and glow
- Smooth transitions (300ms)
- Skeleton loaders for data fetching
- Fade-in animations for content

## 📱 Responsive Design
- Mobile: 320px-768px
- Tablet: 768px-1024px
- Desktop: 1024px+

## 🔧 Environment Variables

Backend (application.properties):
- MongoDB URI
- JWT Secret
- Email credentials

Frontend (.env):
- REACT_APP_API_URL=http://localhost:8081/api

## 🚀 Running the Application

### Backend
```bash
cd cinema-managing-system
./mvnw spring-boot:run
```

### Frontend
```bash
cd cinema-managing-system
npm start
```

## 📝 Development Roadmap

- [x] Backend models and repositories
- [x] JWT authentication
- [x] Security configuration
- [ ] Service layer implementation
- [ ] REST controllers
- [ ] Email service with QR codes
- [ ] Frontend TailwindCSS setup
- [ ] React components
- [ ] Admin dashboard
- [ ] Testing
- [ ] Deployment

## 💡 Next Immediate Tasks

1. Create remaining service classes
2. Implement all REST controllers
3. Set up frontend with TailwindCSS
4. Create AuthContext and protected routes
5. Build Home page with featured movies
6. Implement seat selection booking flow
7. Create admin dashboard with charts
8. Add email notifications
9. Implement QR code generation
10. Test all features

---

**Status**: Backend foundation complete. Ready for service layer and frontend implementation.
