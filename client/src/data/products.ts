import type { Product, Category } from '@/types/models';

// Dummy categories
export const dummyCategories: Category[] = [
  {
    _id: '1',
    name: 'T-Shirts',
    slug: 't-shirts',
    description: 'Comfortable and stylish t-shirts',
    image: {
      url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
      public_id: 'cat_tshirts',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '2',
    name: 'Hoodies',
    slug: 'hoodies',
    description: 'Cozy hoodies for all seasons',
    image: {
      url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7',
      public_id: 'cat_hoodies',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '3',
    name: 'Jeans',
    slug: 'jeans',
    description: 'Premium quality denim jeans',
    image: {
      url: 'https://images.unsplash.com/photo-1542272604-787c3835535d',
      public_id: 'cat_jeans',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '4',
    name: 'Sneakers',
    slug: 'sneakers',
    description: 'Trendy and comfortable sneakers',
    image: {
      url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772',
      public_id: 'cat_sneakers',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Dummy products
export const dummyProducts: Product[] = [
  {
    _id: '1',
    name: 'Classic White T-Shirt',
    slug: 'classic-white-t-shirt',
    description:
      'A timeless classic white t-shirt made from 100% organic cotton. Perfect for everyday wear with a comfortable fit.',
    price: 29.99,
    tags: ['casual', 'cotton', 'basic'],
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
      public_id: 'prod_white_tshirt',
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
        public_id: 'prod_white_tshirt_1',
      },
      {
        url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a',
        public_id: 'prod_white_tshirt_2',
      },
    ],
    stock: 150,
    category: dummyCategories[0],
    size: ['s', 'm', 'l', 'xl'],
    inStock: true,
    totalStock: 150,
    totalSold: 245,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '2',
    name: 'Black Graphic Hoodie',
    slug: 'black-graphic-hoodie',
    description:
      'Stay warm and stylish with this black graphic hoodie. Features a unique design and premium quality fabric.',
    price: 59.99,
    tags: ['winter', 'graphic', 'streetwear'],
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7',
      public_id: 'prod_black_hoodie',
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7',
        public_id: 'prod_black_hoodie_1',
      },
    ],
    stock: 75,
    category: dummyCategories[1],
    size: ['m', 'l', 'xl'],
    inStock: true,
    totalStock: 75,
    totalSold: 89,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '3',
    name: 'Blue Denim Jeans',
    slug: 'blue-denim-jeans',
    description:
      'Classic blue denim jeans with a modern slim fit. Made from high-quality denim for lasting durability.',
    price: 79.99,
    tags: ['denim', 'classic', 'casual'],
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1542272604-787c3835535d',
      public_id: 'prod_blue_jeans',
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1542272604-787c3835535d',
        public_id: 'prod_blue_jeans_1',
      },
    ],
    stock: 120,
    category: dummyCategories[2],
    size: ['s', 'm', 'l', 'xl'],
    inStock: true,
    totalStock: 120,
    totalSold: 156,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '4',
    name: 'Red Running Sneakers',
    slug: 'red-running-sneakers',
    description:
      'Lightweight running sneakers with excellent cushioning. Perfect for your daily workout routine.',
    price: 89.99,
    tags: ['sports', 'running', 'athletic'],
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
      public_id: 'prod_red_sneakers',
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
        public_id: 'prod_red_sneakers_1',
      },
    ],
    stock: 60,
    category: dummyCategories[3],
    size: ['s', 'm', 'l'],
    inStock: true,
    totalStock: 60,
    totalSold: 134,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '5',
    name: 'Grey V-Neck T-Shirt',
    slug: 'grey-v-neck-t-shirt',
    description: 'Sophisticated grey v-neck t-shirt. Perfect for layering or wearing on its own.',
    price: 34.99,
    tags: ['casual', 'v-neck', 'basics'],
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990',
      public_id: 'prod_grey_vneck',
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990',
        public_id: 'prod_grey_vneck_1',
      },
    ],
    stock: 200,
    category: dummyCategories[0],
    size: ['xs', 's', 'm', 'l', 'xl'],
    inStock: true,
    totalStock: 200,
    totalSold: 312,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '6',
    name: 'Navy Blue Hoodie',
    slug: 'navy-blue-hoodie',
    description:
      'Comfortable navy blue hoodie with a kangaroo pocket. Essential for your wardrobe.',
    price: 54.99,
    tags: ['casual', 'comfort', 'winter'],
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1578681994506-b8f463449011',
      public_id: 'prod_navy_hoodie',
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1578681994506-b8f463449011',
        public_id: 'prod_navy_hoodie_1',
      },
    ],
    stock: 90,
    category: dummyCategories[1],
    size: ['s', 'm', 'l', 'xl'],
    inStock: true,
    totalStock: 90,
    totalSold: 67,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '7',
    name: 'Black Skinny Jeans',
    slug: 'black-skinny-jeans',
    description: 'Sleek black skinny jeans with stretch fabric for maximum comfort and style.',
    price: 84.99,
    tags: ['denim', 'skinny', 'modern'],
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1603252109612-f4a7c2a9d151',
      public_id: 'prod_black_jeans',
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1603252109612-f4a7c2a9d151',
        public_id: 'prod_black_jeans_1',
      },
    ],
    stock: 85,
    category: dummyCategories[2],
    size: ['s', 'm', 'l'],
    inStock: true,
    totalStock: 85,
    totalSold: 198,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '8',
    name: 'White Canvas Sneakers',
    slug: 'white-canvas-sneakers',
    description: 'Clean and versatile white canvas sneakers. Goes with everything in your closet.',
    price: 69.99,
    tags: ['casual', 'canvas', 'versatile'],
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772',
      public_id: 'prod_white_sneakers',
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772',
        public_id: 'prod_white_sneakers_1',
      },
    ],
    stock: 110,
    category: dummyCategories[3],
    size: ['s', 'm', 'l', 'xl'],
    inStock: true,
    totalStock: 110,
    totalSold: 223,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Available colors for products (for variant selection)
export const availableColors = [
  { name: 'Black', value: 'black', hex: '#000000' },
  { name: 'White', value: 'white', hex: '#FFFFFF' },
  { name: 'Red', value: 'red', hex: '#EF4444' },
  { name: 'Blue', value: 'blue', hex: '#3B82F6' },
  { name: 'Green', value: 'green', hex: '#10B981' },
  { name: 'Grey', value: 'grey', hex: '#6B7280' },
  { name: 'Navy', value: 'navy', hex: '#1E3A8A' },
];
