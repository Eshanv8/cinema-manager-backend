# ✅ Post-Migration Checklist

## Immediate Actions (Before Running)

### 1. Environment Variables Setup

#### Backend Environment Variables (Required)
```bash
# Copy and run these commands (update values)
export MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/"
export MONGODB_DATABASE="cinema_db"
export JWT_SECRET="generate-a-secure-256-bit-key-here"
```

#### Frontend Environment Variables (Already Created)
- ✅ `.env` file created
- ✅ Contains `REACT_APP_API_URL=http://localhost:8081/api`

### 2. Verify Changes
- ✅ All hard-coded values removed
- ✅ Configuration files updated
- ✅ Documentation created
- ✅ No compilation errors

---

## Testing Steps

### Step 1: Start Backend
```bash
cd "cinema-managing-system"
./mvnw clean install
./mvnw spring-boot:run
```

**Expected Output:**
```
Initializing system configurations...
System configurations initialized!
Creating default admin user...
Default admin user created! Email: admin@cinema.com
```

### Step 2: Start Frontend
```bash
npm install
npm start
```

**Expected Output:**
```
Compiled successfully!
You can now view cinema-managing-system in the browser.
Local: http://localhost:3000
```

### Step 3: Test Login
1. Open `http://localhost:3000`
2. Login with default admin credentials:
   - Email: `admin@cinema.com`
   - Password: `admin123` (or your configured password)

### Step 4: Verify SystemConfig
1. Navigate to Admin Dashboard
2. Check System Configuration section
3. Verify all configuration keys are present:
   - ✅ TICKET_FORMATS
   - ✅ SCREEN_NUMBERS
   - ✅ DEFAULT_SEAT_COUNT
   - ✅ FOOD_CATEGORIES
   - ✅ MERCHANDISE_CATEGORIES
   - ✅ DEFAULT_TICKET_PRICE
   - ✅ SEAT_ROWS
   - ✅ SEATS_PER_ROW
   - ✅ SEAT_TYPES
   - ✅ WELCOME_BONUS

---

## Production Deployment Checklist

### Security
- [ ] Change `ADMIN_PASSWORD` from default
- [ ] Generate new `JWT_SECRET` (use: `openssl rand -base64 32`)
- [ ] Update `CORS_ALLOWED_ORIGINS` with production domain
- [ ] Review all environment variables
- [ ] Secure MongoDB connection string
- [ ] Enable HTTPS
- [ ] Set up rate limiting
- [ ] Configure firewall rules

### Configuration
- [ ] Set production database credentials
- [ ] Configure email service (SMTP)
- [ ] Update API URL in frontend `.env`
- [ ] Set appropriate `SERVER_PORT`
- [ ] Review SystemConfig values
- [ ] Adjust welcome bonus if needed
- [ ] Customize seat layout if needed

### Monitoring
- [ ] Set up application logging
- [ ] Configure error tracking
- [ ] Enable health checks
- [ ] Monitor database connections
- [ ] Track API response times
- [ ] Set up alerts for failures

### Backup
- [ ] Set up database backups
- [ ] Document recovery procedures
- [ ] Test backup restoration
- [ ] Store environment variables securely

---

## Troubleshooting Guide

### Issue: "Can't connect to MongoDB"
**Check:**
```bash
echo $MONGODB_URI
# Should output your connection string
```
**Solution:** Set the environment variable correctly

### Issue: "JWT token invalid"
**Check:**
```bash
echo $JWT_SECRET
# Should output at least 32 characters
```
**Solution:** Generate and set a strong JWT secret

### Issue: "CORS error in browser"
**Check:** `application.properties`
```properties
app.cors.allowed-origins=${CORS_ALLOWED_ORIGINS:http://localhost:3000}
```
**Solution:** Add your frontend URL to CORS_ALLOWED_ORIGINS

### Issue: "SystemConfig not initialized"
**Check:** Application logs for errors
**Solution:** Restart application to trigger initialization

### Issue: "Welcome bonus not applied"
**Check:**
```bash
echo $USER_WELCOME_BONUS
# Or check database
db.system_config.findOne({configKey: "WELCOME_BONUS"})
```
**Solution:** Set environment variable or update database

---

## Performance Optimization

### Recommended Settings

#### MongoDB Connection Pool
Already configured in `application.properties`:
```properties
maxPoolSize=50
minPoolSize=10
maxIdleTimeMS=300000
```

#### JVM Options (Production)
```bash
java -Xms512m -Xmx2048m -jar cinema-managing-system.jar
```

#### Node.js (Production Build)
```bash
npm run build
# Serve the build folder with nginx or similar
```

---

## Documentation Reference

| Document | Use Case |
|----------|----------|
| [SUMMARY.md](SUMMARY.md) | Quick overview of changes |
| [QUICK_CONFIG_REFERENCE.md](QUICK_CONFIG_REFERENCE.md) | Daily configuration tasks |
| [CONFIGURATION_GUIDE.md](CONFIGURATION_GUIDE.md) | Complete configuration details |
| [HARD_CODED_REMOVAL_SUMMARY.md](HARD_CODED_REMOVAL_SUMMARY.md) | Technical migration details |

---

## Support Contacts

For assistance:
1. Check relevant documentation above
2. Review application logs
3. Verify environment variables
4. Test database connection
5. Check SystemConfig table in MongoDB

---

## Success Criteria

Your migration is successful when:
- ✅ Application starts without errors
- ✅ Can login with admin credentials
- ✅ SystemConfig table is populated
- ✅ All features work as expected
- ✅ Configuration changes take effect
- ✅ No hard-coded values in logs
- ✅ Different environments use different configs

---

## Next Steps After Successful Testing

1. **Commit Changes**
   ```bash
   git add .
   git commit -m "Remove hard-coded values, add configuration system"
   ```

2. **Update Team**
   - Share CONFIGURATION_GUIDE.md
   - Document environment setup
   - Update deployment procedures

3. **Deploy to Staging**
   - Test with staging environment variables
   - Verify all configurations
   - Test all features

4. **Deploy to Production**
   - Set production environment variables
   - Monitor logs during deployment
   - Verify application health

---

## Rollback Plan

If issues occur:

1. **Database:** Previous data remains unchanged
2. **Code:** Revert to previous Git commit
3. **Config:** Previous environment variables still work

To rollback:
```bash
git revert HEAD
./mvnw spring-boot:run
```

---

## Contact & Support

If you encounter issues not covered in this checklist:
1. Review the full [CONFIGURATION_GUIDE.md](CONFIGURATION_GUIDE.md)
2. Check application logs for detailed error messages
3. Verify all environment variables are set correctly
4. Test database connectivity separately

---

**🎉 Congratulations!** Your Cinema Management System is now fully configurable and production-ready!
