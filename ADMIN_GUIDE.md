# Admin Dashboard Guide

## How to Add Content to Your Cinema Website

### Prerequisites
1. Both servers must be running:
   - **Backend**: http://localhost:8081
   - **Frontend**: http://localhost:3000

2. You must be logged in as an **Admin**

### Accessing Admin Dashboard
1. Open your browser and go to http://localhost:3000
2. Click "Login" 
3. Use admin credentials to login
4. Click "Admin" in the navigation bar

---

## 🎬 Adding Movies

### Step 1: Navigate to Movies Tab
The Movies tab is selected by default when you open the admin dashboard.

### Step 2: Click "+ Add New Movie"
This will open the movie form.

### Step 3: Fill in Movie Details
- **Movie Title**: Name of the movie (e.g., "Inception")
- **Genre**: Genre category (e.g., "Action", "Sci-Fi", "Drama")
- **Duration**: Length in minutes (e.g., 148)
- **Rating**: Movie rating 0-10 (e.g., 8.8)
- **Release Date**: Select the release date
- **Poster URL**: Link to movie poster image
- **Trailer URL**: Link to YouTube or video trailer
- **Description**: Brief synopsis of the movie
- **Now Showing**: Check if movie is currently showing
- **Coming Soon**: Check if movie is upcoming

### Step 4: Click "Add Movie"
The movie will be saved and appear in the movies list.

---

## 🛍️ Adding Merchandise

### Step 1: Click "Merchandise" Tab
Switch to the merchandise management section.

### Step 2: Click "+ Add New Merchandise"
This will open the merchandise form.

### Step 3: Fill in Product Details
- **Product Name**: Name of the item (e.g., "Avengers T-Shirt")
- **Category**: Choose from dropdown
  - Posters
  - T-Shirts
  - Mugs
  - Collectibles
- **Price**: Product price (e.g., 25.99)
- **Stock Quantity**: Number of items available (e.g., 100)
- **Image URL**: Link to product image
- **Description**: Product description
- **Bundle Item**: Check if this is part of a movie bundle
- **Bundle Movie ID**: (Optional) Movie ID if it's a bundle item
- **Active**: Check to make the item visible to customers

### Step 4: Click "Add Merchandise"
The item will be saved and appear in the merchandise list.

---

## 🍿 Adding Foods

### Step 1: Click "Foods" Tab
Switch to the food management section.

### Step 2: Click "+ Add New Food Item"
This will open the food form.

### Step 3: Fill in Food Details
- **Food Name**: Name of the item (e.g., "Large Popcorn")
- **Category**: Choose from dropdown
  - Popcorn
  - Drinks
  - Snacks
  - Combos
- **Size**: Choose from dropdown
  - Small
  - Medium
  - Large
- **Price**: Food price (e.g., 8.99)
- **Image URL**: Link to food image
- **Description**: Food description
- **Combo Deal**: Check if this is a combo offer
- **Seat Delivery**: Check if available for seat delivery
- **Active**: Check to make the item visible to customers

### Step 4: Click "Add Food Item"
The item will be saved and appear in the food list.

---

## 📊 Managing Existing Items

### Viewing Items
All items are displayed in tables with the following information:
- **Movies**: Title, Genre, Duration, Rating, Trailer link, Status
- **Merchandise**: Name, Category, Price, Stock, Sales count, Status
- **Foods**: Name, Category, Size, Price, Sales count, Status

### Deleting Items
1. Find the item you want to remove in the table
2. Click the red "Delete" button
3. Confirm the deletion in the popup dialog
4. The item will be removed from the database

---

## 🖼️ Adding Images

### Where to Get Image URLs
You can use images from:
1. **ImgBB** (https://imgbb.com) - Free image hosting
2. **Imgur** (https://imgur.com) - Image hosting
3. **Cloudinary** - Professional image hosting
4. **Direct URLs** from official movie sites (make sure you have rights)

### How to Upload Images
1. Go to ImgBB or similar service
2. Upload your image
3. Copy the "Direct Link" or "Image URL"
4. Paste it in the "Image URL" or "Poster URL" field

### Recommended Image Sizes
- **Movie Posters**: 500x750 pixels (2:3 ratio)
- **Merchandise**: 400x400 pixels (square)
- **Food Items**: 400x300 pixels (4:3 ratio)

---

## 🎞️ Adding Trailers

### YouTube Trailers
1. Go to YouTube and find the movie trailer
2. Click "Share" button
3. Copy the link (e.g., https://www.youtube.com/watch?v=abc123)
4. Paste it in the "Trailer URL" field

The trailer will open in a new tab when users click "Watch" in the movies table.

---

## 📝 Tips & Best Practices

### Movies
- ✅ Use high-quality poster images
- ✅ Keep descriptions concise (2-3 sentences)
- ✅ Set realistic ratings based on IMDb or Rotten Tomatoes
- ✅ Include official trailer links
- ✅ Mark movies correctly as "Now Showing" or "Coming Soon"

### Merchandise
- ✅ Keep product names short and descriptive
- ✅ Update stock regularly to avoid overselling
- ✅ Use clear product images
- ✅ Set competitive pricing
- ✅ Create movie bundles for special promotions

### Foods
- ✅ Organize by category for easy browsing
- ✅ Create combo deals to increase sales
- ✅ Enable seat delivery for convenience
- ✅ Use appetizing food images
- ✅ Update prices seasonally if needed

---

## 🔧 Troubleshooting

### "Network Error" when adding items
- ✅ Check if backend server is running on port 8081
- ✅ Verify MongoDB connection is active
- ✅ Check browser console for error details

### Images not showing
- ✅ Verify the image URL is accessible
- ✅ Make sure it's a direct image link (ends with .jpg, .png, etc.)
- ✅ Check if the hosting service allows hotlinking

### Can't delete items
- ✅ Make sure you're logged in as admin
- ✅ Check if the backend server is responding
- ✅ Refresh the page and try again

---

## 📊 Statistics Dashboard

The admin dashboard shows real-time statistics:
- **Total Movies**: Number of movies in the database
- **Merchandise Items**: Number of merchandise products
- **Food Items**: Number of food items

---

## 🚀 Next Steps

After adding your content:
1. **Test the website** - Browse as a customer to see how it looks
2. **Check movie pages** - Verify posters and trailers display correctly
3. **Review pricing** - Ensure all prices are accurate
4. **Test booking flow** - Try booking a movie to test the system
5. **Monitor sales** - Track which items are selling well

---

## 📞 Need Help?

If you encounter any issues:
1. Check the browser console for errors (F12)
2. Verify both servers are running
3. Review the MongoDB connection
4. Check the terminal for backend errors

---

**Happy Managing! 🎬🍿**
