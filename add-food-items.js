// Script to add sample food items to the database
const axios = require('axios');

const API_URL = 'http://localhost:8081/api';

const foodItems = [
  // Popcorn
  {
    name: 'Small Popcorn',
    description: 'Freshly popped buttery popcorn',
    category: 'POPCORN',
    price: 5.99,
    imageUrl: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f',
    available: true,
    preparationTime: 2
  },
  {
    name: 'Medium Popcorn',
    description: 'Perfect size for sharing',
    category: 'POPCORN',
    price: 8.99,
    imageUrl: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f',
    available: true,
    preparationTime: 2
  },
  {
    name: 'Large Popcorn',
    description: 'The ultimate movie snack',
    category: 'POPCORN',
    price: 11.99,
    imageUrl: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f',
    available: true,
    preparationTime: 2
  },
  {
    name: 'Caramel Popcorn',
    description: 'Sweet and crunchy caramel-coated popcorn',
    category: 'POPCORN',
    price: 9.99,
    imageUrl: 'https://images.unsplash.com/photo-1630430757909-37551c5f8e3b',
    available: true,
    preparationTime: 3
  },

  // Drinks
  {
    name: 'Small Coke',
    description: 'Refreshing Coca-Cola',
    category: 'DRINKS',
    price: 4.99,
    imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7',
    available: true,
    preparationTime: 1
  },
  {
    name: 'Medium Coke',
    description: 'Ice cold Coca-Cola',
    category: 'DRINKS',
    price: 6.99,
    imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7',
    available: true,
    preparationTime: 1
  },
  {
    name: 'Large Coke',
    description: 'Extra large refreshment',
    category: 'DRINKS',
    price: 8.99,
    imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7',
    available: true,
    preparationTime: 1
  },
  {
    name: 'Bottled Water',
    description: 'Pure mineral water',
    category: 'DRINKS',
    price: 3.99,
    imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d',
    available: true,
    preparationTime: 1
  },
  {
    name: 'Orange Juice',
    description: 'Fresh squeezed orange juice',
    category: 'DRINKS',
    price: 5.99,
    imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba',
    available: true,
    preparationTime: 2
  },
  {
    name: 'Iced Coffee',
    description: 'Cold brew coffee with ice',
    category: 'DRINKS',
    price: 6.99,
    imageUrl: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7',
    available: true,
    preparationTime: 3
  },

  // Snacks
  {
    name: 'Nachos with Cheese',
    description: 'Crispy nachos with warm cheese dip',
    category: 'SNACKS',
    price: 7.99,
    imageUrl: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d',
    available: true,
    preparationTime: 5
  },
  {
    name: 'Hot Dog',
    description: 'Classic all-beef hot dog',
    category: 'SNACKS',
    price: 6.99,
    imageUrl: 'https://images.unsplash.com/photo-1612392061787-2d078b3e573f',
    available: true,
    preparationTime: 4
  },
  {
    name: 'Pretzel Bites',
    description: 'Soft pretzel bites with cheese sauce',
    category: 'SNACKS',
    price: 6.99,
    imageUrl: 'https://images.unsplash.com/photo-1575535468500-be46d300b0c2',
    available: true,
    preparationTime: 4
  },
  {
    name: 'Candy Mix',
    description: 'Assorted movie theater candies',
    category: 'SNACKS',
    price: 4.99,
    imageUrl: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f',
    available: true,
    preparationTime: 1
  },
  {
    name: 'Chicken Tenders',
    description: 'Crispy chicken tenders with sauce',
    category: 'SNACKS',
    price: 9.99,
    imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710',
    available: true,
    preparationTime: 6
  },

  // Combos
  {
    name: 'Classic Combo',
    description: 'Medium popcorn + Medium drink',
    category: 'COMBOS',
    price: 13.99,
    imageUrl: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff',
    available: true,
    preparationTime: 3
  },
  {
    name: 'Family Combo',
    description: 'Large popcorn + 2 Medium drinks + Candy',
    category: 'COMBOS',
    price: 24.99,
    imageUrl: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff',
    available: true,
    preparationTime: 4
  },
  {
    name: 'Deluxe Combo',
    description: 'Large popcorn + Large drink + Nachos',
    category: 'COMBOS',
    price: 22.99,
    imageUrl: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff',
    available: true,
    preparationTime: 5
  },
  {
    name: 'Date Night Combo',
    description: 'Large popcorn + 2 Drinks + Chocolate',
    category: 'COMBOS',
    price: 19.99,
    imageUrl: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff',
    available: true,
    preparationTime: 3
  },
  {
    name: 'Ultimate Combo',
    description: 'Large popcorn + 2 Drinks + Nachos + Hot Dog',
    category: 'COMBOS',
    price: 29.99,
    imageUrl: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff',
    available: true,
    preparationTime: 6
  }
];

async function addFoodItems() {
  console.log('Starting to add food items...');
  let successCount = 0;
  let failCount = 0;

  for (const food of foodItems) {
    try {
      const response = await axios.post(`${API_URL}/food`, food);
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
