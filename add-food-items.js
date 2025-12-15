// Script to add sample food items to the database
const axios = require('axios');

const API_URL = 'http://localhost:8081/api';

const foodItems = [
  // Popcorn (Scope Cinemas style)
  {
    name: 'Regular Popcorn',
    description: 'Freshly popped buttery popcorn',
    category: 'POPCORN',
    price: 450.00,
    imageUrl: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f',
    available: true,
    preparationTime: 2
  },
  {
    name: 'Medium Popcorn',
    description: 'Perfect size for sharing',
    category: 'POPCORN',
    price: 650.00,
    imageUrl: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f',
    available: true,
    preparationTime: 2
  },
  {
    name: 'Large Popcorn',
    description: 'The ultimate movie snack',
    category: 'POPCORN',
    price: 850.00,
    imageUrl: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f',
    available: true,
    preparationTime: 2
  },
  {
    name: 'Caramel Popcorn',
    description: 'Sweet and crunchy caramel-coated popcorn',
    category: 'POPCORN',
    price: 750.00,
    imageUrl: 'https://images.unsplash.com/photo-1630430757909-37551c5f8e3b',
    available: true,
    preparationTime: 3
  },
  {
    name: 'Cheese Popcorn',
    description: 'Savory cheese-flavored popcorn',
    category: 'POPCORN',
    price: 750.00,
    imageUrl: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330',
    available: true,
    preparationTime: 3
  },

  // Beverages
  {
    name: 'Coca-Cola (Regular)',
    description: 'Classic Coca-Cola',
    category: 'DRINKS',
    price: 350.00,
    imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7',
    available: true,
    preparationTime: 1
  },
  {
    name: 'Coca-Cola (Medium)',
    description: 'Ice cold Coca-Cola',
    category: 'DRINKS',
    price: 450.00,
    imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7',
    available: true,
    preparationTime: 1
  },
  {
    name: 'Coca-Cola (Large)',
    description: 'Extra large refreshment',
    category: 'DRINKS',
    price: 550.00,
    imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7',
    available: true,
    preparationTime: 1
  },
  {
    name: 'Sprite (Regular)',
    description: 'Refreshing lemon-lime soda',
    category: 'DRINKS',
    price: 350.00,
    imageUrl: 'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137',
    available: true,
    preparationTime: 1
  },
  {
    name: 'Fanta (Regular)',
    description: 'Orange flavored soda',
    category: 'DRINKS',
    price: 350.00,
    imageUrl: 'https://images.unsplash.com/photo-1624517452488-04869289c4ca',
    available: true,
    preparationTime: 1
  },
  {
    name: 'Bottled Water',
    description: 'Pure mineral water',
    category: 'DRINKS',
    price: 200.00,
    imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d',
    available: true,
    preparationTime: 1
  },
  {
    name: 'Iced Tea',
    description: 'Refreshing peach iced tea',
    category: 'DRINKS',
    price: 400.00,
    imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc',
    available: true,
    preparationTime: 2
  },
  {
    name: 'Iced Coffee',
    description: 'Chilled coffee with ice',
    category: 'DRINKS',
    price: 500.00,
    imageUrl: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7',
    available: true,
    preparationTime: 3
  },

  // Snacks
  {
    name: 'Nachos Supreme',
    description: 'Crispy nachos with cheese sauce, jalapeños and salsa',
    category: 'SNACKS',
    price: 950.00,
    imageUrl: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d',
    available: true,
    preparationTime: 5
  },
  {
    name: 'Chicken Hot Dog',
    description: 'Grilled chicken sausage with toppings',
    category: 'SNACKS',
    price: 650.00,
    imageUrl: 'https://images.unsplash.com/photo-1612392061787-2d078b3e573f',
    available: true,
    preparationTime: 4
  },
  {
    name: 'Beef Hot Dog',
    description: 'Classic beef hot dog with mustard and ketchup',
    category: 'SNACKS',
    price: 700.00,
    imageUrl: 'https://images.unsplash.com/photo-1612392061787-2d078b3e573f',
    available: true,
    preparationTime: 4
  },
  {
    name: 'French Fries',
    description: 'Crispy golden french fries',
    category: 'SNACKS',
    price: 550.00,
    imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877',
    available: true,
    preparationTime: 5
  },
  {
    name: 'Chicken Tenders',
    description: 'Crispy chicken tenders with BBQ sauce',
    category: 'SNACKS',
    price: 1050.00,
    imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710',
    available: true,
    preparationTime: 6
  },
  {
    name: 'Chicken Wings (6pcs)',
    description: 'Spicy chicken wings with ranch dip',
    category: 'SNACKS',
    price: 1200.00,
    imageUrl: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7',
    available: true,
    preparationTime: 7
  },
  {
    name: 'Samosa (2pcs)',
    description: 'Crispy vegetable samosas',
    category: 'SNACKS',
    price: 300.00,
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950',
    available: true,
    preparationTime: 3
  },
  {
    name: 'Chocolate Bar',
    description: 'Premium chocolate bar',
    category: 'SNACKS',
    price: 250.00,
    imageUrl: 'https://images.unsplash.com/photo-1511381939415-e44015466834',
    available: true,
    preparationTime: 1
  },
  {
    name: 'Skittles',
    description: 'Fruity candy',
    category: 'SNACKS',
    price: 280.00,
    imageUrl: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f',
    available: true,
    preparationTime: 1
  },
  {
    name: 'M&Ms',
    description: 'Chocolate candies',
    category: 'SNACKS',
    price: 300.00,
    imageUrl: 'https://images.unsplash.com/photo-1584706672667-574b04c6b44d',
    available: true,
    preparationTime: 1
  },

  // Combos (Popular cinema combos)
  {
    name: 'Classic Combo',
    description: 'Regular Popcorn + Regular Soft Drink',
    category: 'COMBOS',
    price: 750.00,
    imageUrl: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff',
    available: true,
    preparationTime: 3
  },
  {
    name: 'Medium Combo',
    description: 'Medium Popcorn + Medium Soft Drink',
    category: 'COMBOS',
    price: 1050.00,
    imageUrl: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff',
    available: true,
    preparationTime: 3
  },
  {
    name: 'Large Combo',
    description: 'Large Popcorn + Large Soft Drink',
    category: 'COMBOS',
    price: 1350.00,
    imageUrl: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff',
    available: true,
    preparationTime: 3
  },
  {
    name: 'Family Combo',
    description: 'Large Popcorn + 2 Medium Drinks + Nachos',
    category: 'COMBOS',
    price: 2500.00,
    imageUrl: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff',
    available: true,
    preparationTime: 5
  },
  {
    name: 'Deluxe Combo',
    description: 'Large Popcorn + Large Drink + Hot Dog + Chocolate',
    category: 'COMBOS',
    price: 2200.00,
    imageUrl: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff',
    available: true,
    preparationTime: 5
  },
  {
    name: 'Date Night Combo',
    description: 'Large Popcorn + 2 Medium Drinks + 2 Chocolates',
    category: 'COMBOS',
    price: 1850.00,
    imageUrl: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff',
    available: true,
    preparationTime: 3
  },
  {
    name: 'Ultimate Feast',
    description: 'Large Popcorn + 2 Large Drinks + Nachos + 6 Chicken Wings',
    category: 'COMBOS',
    price: 3500.00,
    imageUrl: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff',
    available: true,
    preparationTime: 7
  },
  {
    name: 'Kids Combo',
    description: 'Small Popcorn + Regular Drink + Candy',
    category: 'COMBOS',
    price: 950.00,
    imageUrl: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff',
    available: true,
    preparationTime: 3
  }
];

async function loginAsAdmin() {
  try {
    console.log('Logging in as admin...');
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@cinema.com',
      password: 'admin123'
    });
    console.log('✓ Login successful!\n');
    return response.data.token;
  } catch (error) {
    console.error('✗ Login failed:', error.response?.data || error.message);
    console.error('\nPlease make sure:');
    console.error('1. Backend is running on http://localhost:8081');
    console.error('2. Admin account exists (email: admin@cinema.com, password: admin123)');
    console.error('\nYou can create an admin account by signing up with role ADMIN');
    throw error;
  }
}

async function addFoodItems() {
  console.log('Starting to add food items...');
  
  // Login first to get JWT token
  const token = await loginAsAdmin();
  
  let successCount = 0;
  let failCount = 0;

  for (const food of foodItems) {
    try {
      const response = await axios.post(`${API_URL}/food`, food, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(`✓ Added: ${food.name}`);
      successCount++;
    } catch (error) {
      console.error(`✗ Failed to add ${food.name}:`, error.response?.data || error.message);
      failCount++;
    }
  }

  console.log('\n=== Summary ===');
  console.log(`Successfully added: ${successCount} food items`);
  console.log(`Failed: ${failCount} food items`);
  console.log('===============\n');
}

addFoodItems()
  .then(() => {
    console.log('Food items addition completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error adding food items:', error);
    process.exit(1);
  });
