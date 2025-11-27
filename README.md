# Cinema Management System

A full-stack web application for managing cinema operations with user authentication. Built with Spring Boot (backend) and React (frontend).

## Features

- User Registration (Sign Up)
- User Login with secure password encryption (BCrypt)
- MySQL database integration
- RESTful API
- Modern React UI with responsive design
- CORS configuration for cross-origin requests
- Spring Security integration

## Technologies Used

### Backend
- Java 21
- Spring Boot 3.5.7
- Spring Data JPA
- Spring Security
- MySQL Database
- Maven
- BCrypt Password Encryption

### Frontend
- React 18
- Axios for API calls
- CSS3 for styling

## Prerequisites

Before running this application, make sure you have installed:

1. **Java Development Kit (JDK) 21**
2. **Maven** (for building the backend)
3. **MySQL Server** (running on localhost:3306)
4. **Node.js and npm** (for running the React frontend)

## Database Setup

1. Install MySQL Server if not already installed
2. Start MySQL Server
3. Create a database (the application will auto-create tables):
   ```sql
   CREATE DATABASE cinema_db;
   ```
4. Update `src/main/resources/application.properties` if needed:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=root
   ```
   Change the username and password to match your MySQL credentials.

## Installation & Setup

### Backend Setup (Spring Boot)

1. Navigate to the project root directory:
   ```bash
   cd "cinema-managing-system"
   ```

2. Build the project using Maven:
   ```bash
   mvnw clean install
   ```

3. Run the Spring Boot application:
   ```bash
   mvnw spring-boot:run
   ```
   
   The backend server will start on `http://localhost:8080`

### Frontend Setup (React)

1. In the same project directory, install npm dependencies:
   ```bash
   npm install
   ```

2. Start the React development server:
   ```bash
   npm start
   ```
   
   The frontend will open automatically at `http://localhost:3000`

## API Endpoints

### Authentication APIs

#### Sign Up
- **URL**: `POST /api/auth/signup`
- **Body**:
  ```json
  {
    "username": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**: `"User registered successfully"`

#### Login
- **URL**: `POST /api/auth/login`
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**: User object with details (excluding sensitive info in production)

## Project Structure

```
cinema-managing-system/
├── src/
│   ├── main/
│   │   ├── java/com/example/cinema/managing/system/
│   │   │   ├── CinemaManagingSystemApplication.java
│   │   │   ├── config/
│   │   │   │   ├── CorsConfig.java
│   │   │   │   └── SecurityConfig.java
│   │   │   ├── controller/
│   │   │   │   └── AuthController.java
│   │   │   ├── model/
│   │   │   │   └── User.java
│   │   │   ├── repository/
│   │   │   │   └── UserRepository.java
│   │   │   └── service/
│   │   │       └── UserService.java
│   │   └── resources/
│   │       └── application.properties
│   ├── App.js
│   ├── index.js
│   └── components/
│       ├── Login.jsx
│       ├── Login.css
│       ├── Signup.jsx
│       └── Signup.css
├── public/
│   └── index.html
├── pom.xml
└── package.json
```

## Usage

1. Start both the backend (Spring Boot) and frontend (React) servers
2. Open your browser and navigate to `http://localhost:3000`
3. You'll see the Cinema Management System interface with Login/Signup options
4. Click "Signup" to create a new account
5. Fill in your details and submit
6. Switch to "Login" and enter your credentials
7. Upon successful login, you'll see a welcome message

## Configuration

### Database Configuration
Edit `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/cinema_db
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

### CORS Configuration
The application is configured to allow requests from `http://localhost:3000`. To change this, edit:
- `src/main/java/com/example/cinema/managing/system/config/CorsConfig.java`
- `src/main/java/com/example/cinema/managing/system/controller/AuthController.java`

## Security Notes

- Passwords are encrypted using BCrypt before storing in the database
- Spring Security is configured to allow authentication endpoints
- CSRF is disabled for API endpoints (enable in production with proper tokens)
- Consider adding JWT tokens for session management in production

## Future Enhancements

- Add JWT token-based authentication
- Implement role-based access control (Admin/User)
- Add movie management features
- Implement booking system
- Add payment integration
- Create admin dashboard
- Add email verification
- Implement password reset functionality

## Troubleshooting

### Backend Issues

1. **Port 8080 already in use**:
   - Change the port in `application.properties`:
     ```properties
     server.port=8081
     ```
   - Update the React proxy in `package.json` accordingly

2. **MySQL Connection Error**:
   - Ensure MySQL server is running
   - Verify username and password in `application.properties`
   - Check if the database exists

3. **Build Errors**:
   - Run `mvnw clean install` to rebuild
   - Ensure JDK 21 is installed and configured

### Frontend Issues

1. **Port 3000 already in use**:
   - The system will prompt to use another port, accept it

2. **API Connection Error**:
   - Ensure backend is running on port 8080
   - Check CORS configuration

3. **npm install fails**:
   - Delete `node_modules` folder and `package-lock.json`
   - Run `npm install` again

## License

This project is for educational purposes.

## Contact

For any queries or suggestions, please reach out to the development team.
