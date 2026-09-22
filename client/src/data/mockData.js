export const RESTAURANT_DATA = {
  id: 'rest-1',
  name: 'Kyoto Ramen & Izakaya',
  tagline: 'Authentic Handcrafted Ramen & Japanese Comfort Dining',
  rating: 4.9,
  reviewsCount: '1.2k+',
  deliveryTime: '25-35 min',
  deliveryFee: '$2.99',
  address: '742 Evergreen Blvd, San Francisco, CA',
  icon: '🍜'
};

export const MENU_CATEGORIES = [
  'All Items',
  'Signature Ramen',
  'Appetizers',
  'Rice Bowls',
  'Beverages'
];

export const MENU_ITEMS = [
  {
    id: 'item-1',
    name: 'Special Black Garlic Tonkotsu Ramen',
    category: 'Signature Ramen',
    price: 16.50,
    rating: 4.9,
    description: '16-hour simmered rich pork broth, roasted black garlic oil, tender chashu pork belly, nitamago egg, menma bamboo shoots.',
    icon: '🍜',
    popular: true
  },
  {
    id: 'item-2',
    name: 'Spicy Red Miso Ramen',
    category: 'Signature Ramen',
    price: 15.95,
    rating: 4.8,
    description: 'Spicy red miso blend with rich broth, spicy ground pork, sweet corn, scallions, nori seaweed, and bean sprouts.',
    icon: '🌶️',
    popular: true
  },
  {
    id: 'item-3',
    name: 'Crispy Pan-Fried Pork Gyoza (6 pcs)',
    category: 'Appetizers',
    price: 8.50,
    rating: 4.8,
    description: 'Crispy bottom handmade dumplings filled with seasoned pork and cabbage, served with scallion ponzu sauce.',
    icon: '🥟',
    popular: true
  },
  {
    id: 'item-4',
    name: 'Japanese Karaage Fried Chicken',
    category: 'Appetizers',
    price: 9.75,
    rating: 4.9,
    description: 'Ginger-soy marinated bite-sized crispy fried chicken thighs served with Japanese Kewpie mayo and lemon wedge.',
    icon: '🍗',
    popular: false
  },
  {
    id: 'item-5',
    name: 'Chashu Donburi Rice Bowl',
    category: 'Rice Bowls',
    price: 13.50,
    rating: 4.7,
    description: 'Steamed premium koshihikari rice topped with flame-torched pork belly, sweet savory glaze, scallions, and pickled ginger.',
    icon: '🍚',
    popular: false
  },
  {
    id: 'item-6',
    name: 'Matcha Iced Green Tea Latte',
    category: 'Beverages',
    price: 5.25,
    rating: 4.9,
    description: 'Ceremonial grade Uji Japanese matcha blended with cold oat milk and organic cane sugar.',
    icon: '🍵',
    popular: true
  }
];
