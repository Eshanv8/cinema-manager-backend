# Quick Configuration Reference Card

## 🚀 Quick Start

### Step 1: Backend Setup
```bash
# Set required environment variables
export MONGODB_URI="your-connection-string"
export MONGODB_DATABASE="cinema_db"
export JWT_SECRET="your-secret-key-256-bits-minimum"

# Run the application
./mvnw spring-boot:run
```

### Step 2: Frontend Setup
```bash
# Create .env file
echo "REACT_APP_API_URL=http://localhost:8081/api" > .env

# Install and run
npm install
npm start
```

---

## 📝 Essential Environment Variables

### Backend (Must Set These)
| Variable | Example | Required |
|----------|---------|----------|
| `MONGODB_URI` | `mongodb+srv://...` | ✅ Yes |
| `MONGODB_DATABASE` | `cinema_db` | ✅ Yes |
| `JWT_SECRET` | `min-256-bits-long-secret` | ✅ Yes |

### Frontend (Must Set These)
| Variable | Example | Required |
|----------|---------|----------|
| `REACT_APP_API_URL` | `http://localhost:8081/api` | ✅ Yes |

---

## 🔧 Common Configuration Tasks

### Change Admin Password
**Option 1: Environment Variable (Before First Run)**
```bash
export ADMIN_PASSWORD="new-secure-password"
```

**Option 2: Database (After First Run)**
```bash
# Connect to MongoDB and update
db.users.updateOne(
  { email: "admin@cinema.com" },
  { $set: { password: "$2a$...hashed..." } }
)
```

### Change Welcome Bonus
**Option 1: Environment Variable**
```bash
export USER_WELCOME_BONUS=150
```

**Option 2: Database**
```bash
db.system_config.updateOne(
  { configKey: "WELCOME_BONUS" },
  { $set: { value: 150 } }
)
```

### Change Seat Layout
**Environment Variables:**
```bash
export SEATS_ROWS="A,B,C,D,E,F,G,H"
export SEATS_PER_ROW=12
```

**Database:**
```bash
db.system_config.updateOne(
  { configKey: "SEAT_ROWS" },
  { $set: { value: ["A","B","C","D","E","F","G","H"] } }
)

db.system_config.updateOne(
  { configKey: "SEATS_PER_ROW" },
  { $set: { value: 12 } }
)
```

---

## 🔒 Production Checklist

- [ ] Change `ADMIN_PASSWORD` from default
- [ ] Set strong `JWT_SECRET` (generate new)
- [ ] Update `CORS_ALLOWED_ORIGINS` with production domain
- [ ] Configure production database
- [ ] Set up email service credentials
- [ ] Review all SystemConfig values
- [ ] Test configurations
- [ ] Enable HTTPS

---

## 🌍 Environment-Specific Configs

### Development
```properties
SERVER_PORT=8081
CORS_ALLOWED_ORIGINS=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017
```

### Production
```properties
SERVER_PORT=443
CORS_ALLOWED_ORIGINS=https://yourdomain.com
MONGODB_URI=mongodb+srv://prod-cluster...
JWT_SECRET=<strong-unique-secret>
```

---

## 📊 Configuration Priority

```
1. Environment Variables (Highest)
   ↓
2. Database (SystemConfig)
   ↓
3. Default Values (Fallback)
```

---

## 🔍 Troubleshooting

### Backend won't start
```bash
# Check if MongoDB URI is set
echo $MONGODB_URI

# Check application logs
./mvnw spring-boot:run --debug
```

### Frontend can't connect to API
```bash
# Verify .env file exists
cat .env

# Check API URL
grep REACT_APP_API_URL .env
```

### CORS errors
```bash
# Update CORS origins
export CORS_ALLOWED_ORIGINS="http://localhost:3000,https://yourdomain.com"
```

---

## 📚 More Information

- Full guide: [CONFIGURATION_GUIDE.md](CONFIGURATION_GUIDE.md)
- Migration summary: [HARD_CODED_REMOVAL_SUMMARY.md](HARD_CODED_REMOVAL_SUMMARY.md)
- Main readme: [README.md](README.md)

---

## 💡 Tips

1. **Never commit `.env` files** - They're in `.gitignore`
2. **Use `.env.example`** as a template
3. **Rotate secrets regularly** in production
4. **Test configurations** before deploying
5. **Monitor logs** for configuration issues

---

## 🆘 Quick Help

**Problem:** "Can't connect to database"
**Solution:** Check `MONGODB_URI` environment variable

**Problem:** "CORS error"
**Solution:** Add your frontend URL to `CORS_ALLOWED_ORIGINS`

**Problem:** "JWT token invalid"
**Solution:** Ensure `JWT_SECRET` is at least 256 bits (32+ characters)

**Problem:** "Configuration not found"
**Solution:** Restart application to initialize SystemConfig

---

## 📞 Contact

For issues or questions, refer to the full documentation in [CONFIGURATION_GUIDE.md](CONFIGURATION_GUIDE.md)
