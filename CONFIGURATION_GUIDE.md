# Configuration Guide

This document explains how to configure the Cinema Management System using environment variables and database-driven configuration.

## Overview

All hard-coded values have been removed from the codebase. The system now uses:
1. **Environment Variables** - For deployment-specific settings (credentials, URLs, ports)
2. **Database Configuration (SystemConfig)** - For business logic settings (prices, categories, seat layouts)

---

## Backend Configuration (Java/Spring Boot)

### Environment Variables

Create a `.env` file or set system environment variables:

```properties
# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?options
MONGODB_DATABASE=cinema_db

# Server Configuration
SERVER_PORT=8081

# JWT Security
JWT_SECRET=your-secret-key-at-least-256-bits-long
JWT_EXPIRATION=86400000

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com

# Email Configuration
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password

# Admin Default Credentials (for initial setup)
ADMIN_EMAIL=admin@cinema.com
ADMIN_PASSWORD=admin123

# User Configuration
USER_WELCOME_BONUS=100

# Seat Configuration
SEATS_ROWS=A,B,C,D,E,F,G,H,I,J
SEATS_PER_ROW=10
```

### Database Configuration (SystemConfig Collection)

The following configurations are stored in MongoDB and can be modified at runtime:

#### 1. Ticket Formats
```json
{
  "configKey": "TICKET_FORMATS",
  "configType": "LIST",
  "value": ["2D", "3D", "IMAX", "4DX", "Dolby Atmos"],
  "description": "Available ticket formats"
}
```

#### 2. Screen Numbers
```json
{
  "configKey": "SCREEN_NUMBERS",
  "configType": "LIST",
  "value": ["1", "2", "3", "4", "5", "VIP Hall", "Gold Class"],
  "description": "Available screen numbers/halls"
}
```

#### 3. Default Seat Count
```json
{
  "configKey": "DEFAULT_SEAT_COUNT",
  "configType": "NUMBER",
  "value": 100,
  "description": "Default seat count per showtime"
}
```

#### 4. Food Categories
```json
{
  "configKey": "FOOD_CATEGORIES",
  "configType": "LIST",
  "value": ["POPCORN", "DRINKS", "SNACKS", "COMBOS", "DESSERTS"],
  "description": "Food item categories"
}
```

#### 5. Merchandise Categories
```json
{
  "configKey": "MERCHANDISE_CATEGORIES",
  "configType": "LIST",
  "value": ["POSTERS", "TOYS", "CLOTHING", "COLLECTIBLES", "ACCESSORIES"],
  "description": "Merchandise categories"
}
```

#### 6. Default Ticket Price
```json
{
  "configKey": "DEFAULT_TICKET_PRICE",
  "configType": "NUMBER",
  "value": 1500.0,
  "description": "Default ticket price in LKR"
}
```

#### 7. Seat Rows
```json
{
  "configKey": "SEAT_ROWS",
  "configType": "LIST",
  "value": ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
  "description": "Seat row labels"
}
```

#### 8. Seats Per Row
```json
{
  "configKey": "SEATS_PER_ROW",
  "configType": "NUMBER",
  "value": 10,
  "description": "Number of seats per row"
}
```

#### 9. Seat Types
```json
{
  "configKey": "SEAT_TYPES",
  "configType": "LIST",
  "value": ["STANDARD", "VIP", "PREMIUM"],
  "description": "Available seat types"
}
```

#### 10. Welcome Bonus
```json
{
  "configKey": "WELCOME_BONUS",
  "configType": "NUMBER",
  "value": 100,
  "description": "Welcome bonus points for new users"
}
```

---

## Frontend Configuration (React)

### Environment Variables

Create `.env` file in the root directory:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:8081/api

# Feature Flags
REACT_APP_ENABLE_TRAILER=true
REACT_APP_ENABLE_MERCHANDISE=true

# Application Settings
REACT_APP_APP_NAME=Cinema Management System
REACT_APP_COMPANY_NAME=Cinema Corp
```

---

## How to Modify Configurations

### 1. Modifying Environment Variables

**Development:**
- Edit `.env` file
- Restart the application

**Production:**
- Set environment variables in your hosting platform
- For Docker: Use docker-compose.yml or Kubernetes ConfigMap
- For cloud: Use platform-specific configuration (Azure App Settings, AWS Parameter Store, etc.)

### 2. Modifying Database Configurations

You can modify SystemConfig values in three ways:

#### A. Using API Endpoints (Recommended)
```bash
# Get all configurations
GET /api/system-config

# Update a configuration
PUT /api/system-config/{configKey}
{
  "value": [new value]
}
```

#### B. Direct Database Update
```javascript
// Connect to MongoDB and update
db.system_config.updateOne(
  { configKey: "WELCOME_BONUS" },
  { $set: { value: 150, updatedAt: new Date() } }
)
```

#### C. Admin Dashboard
- Navigate to Admin Dashboard
- Go to System Configuration
- Edit values through the UI

---

## Security Best Practices

### 1. Never Commit Sensitive Data
- Add `.env` to `.gitignore`
- Use `.env.example` for documentation
- Store secrets in secret management services (Azure Key Vault, AWS Secrets Manager)

### 2. Rotate Credentials Regularly
- Change JWT_SECRET periodically
- Update database passwords
- Rotate API keys

### 3. Use Strong Passwords
- Minimum 12 characters
- Mix of uppercase, lowercase, numbers, symbols
- Don't use default passwords in production

### 4. Restrict CORS Origins
```properties
# Development
CORS_ALLOWED_ORIGINS=http://localhost:3000

# Production
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

---

## Deployment Checklist

- [ ] Set all environment variables in deployment platform
- [ ] Change default admin password
- [ ] Update CORS_ALLOWED_ORIGINS for production domain
- [ ] Set strong JWT_SECRET (generate new random key)
- [ ] Configure production database credentials
- [ ] Set up email service (SMTP credentials)
- [ ] Review and adjust SystemConfig values
- [ ] Test all configurations before going live
- [ ] Set up monitoring for configuration changes

---

## Troubleshooting

### Issue: Configuration not loading
**Solution:** Check if environment variables are set correctly. Use defaults if optional.

### Issue: Database connection failed
**Solution:** Verify MONGODB_URI and MONGODB_DATABASE environment variables.

### Issue: CORS errors
**Solution:** Ensure CORS_ALLOWED_ORIGINS includes your frontend URL.

### Issue: SystemConfig not initialized
**Solution:** The system auto-initializes on startup. Check logs for errors.

---

## Additional Resources

- [Spring Boot Configuration](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.external-config)
- [MongoDB Connection String](https://docs.mongodb.com/manual/reference/connection-string/)
- [React Environment Variables](https://create-react-app.dev/docs/adding-custom-environment-variables/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

## Support

For questions or issues:
1. Check this configuration guide
2. Review application logs
3. Verify environment variables
4. Test database connection
5. Contact system administrator
