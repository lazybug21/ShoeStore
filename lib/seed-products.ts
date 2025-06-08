import dbConnect from './mongodb';
import Product from '../models/Product';

const sampleProducts = [
  {
    name: "Converse Chuck Taylor All Star II Hi",
    description: "The Chuck Taylor All Star II Hi features a durable canvas upper with a cushioned Lunarlon sockliner for all-day comfort. This iconic sneaker combines classic style with modern comfort technology.",
    price: 75.00,
    image: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800",
    variants: [
      {
        type: "Size",
        options: ["US 7", "US 8", "US 9", "US 10", "US 11"]
      },
      {
        type: "Color",
        options: ["Black", "White", "Red", "Navy"]
      }
    ],
    inventory: 50
  },
  {
    name: "Nike Air Max 270",
    description: "Experience ultimate comfort with the Nike Air Max 270. Featuring Nike's largest heel Air unit yet for a super-soft ride that feels as impossible as it looks.",
    price: 150.00,
    image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800",
    variants: [
      {
        type: "Size",
        options: ["US 7", "US 8", "US 9", "US 10", "US 11"]
      },
      {
        type: "Color",
        options: ["Black/White", "Blue/Orange", "Grey/Pink"]
      }
    ],
    inventory: 30
  },
  {
    name: "Adidas Ultraboost 22",
    description: "Run with incredible energy return in the Ultraboost 22. These running shoes combine comfort and responsiveness for a smooth ride.",
    price: 190.00,
    image: "https://images.unsplash.com/photo-1562183241-b937e95585b6?w=800",
    variants: [
      {
        type: "Size",
        options: ["US 7", "US 8", "US 9", "US 10", "US 11"]
      },
      {
        type: "Color",
        options: ["Core Black", "Cloud White", "Solar Red"]
      }
    ],
    inventory: 25
  },
  {
    name: "Vans Old Skool",
    description: "The Vans Old Skool is the original and now iconic Vans side stripe skate shoe. A low-top lace-up with durable suede and canvas uppers.",
    price: 65.00,
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800",
    variants: [
      {
        type: "Size",
        options: ["US 7", "US 8", "US 9", "US 10", "US 11", "US 12"]
      },
      {
        type: "Color",
        options: ["Black/White", "All Black", "Checkerboard", "Navy/White"]
      }
    ],
    inventory: 40
  },
  {
    name: "New Balance 997H",
    description: "A heritage-inspired running silhouette with modern comfort. Features a cushioned midsole and retro styling that works with any outfit.",
    price: 80.00,
    image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800",
    variants: [
      {
        type: "Size",
        options: ["US 7", "US 8", "US 9", "US 10", "US 11"]
      },
      {
        type: "Color",
        options: ["Grey/Navy", "White/Red", "Black/Silver", "Tan/Brown"]
      }
    ],
    inventory: 35
  },
  {
    name: "Jordan 1 Mid",
    description: "Inspired by the original AJ1, this mid-top edition maintains the iconic look you love while choice colors and crisp leather give it a distinct identity.",
    price: 110.00,
    image: "https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=800",
    variants: [
      {
        type: "Size",
        options: ["US 7", "US 8", "US 9", "US 10", "US 11", "US 12"]
      },
      {
        type: "Color",
        options: ["Chicago", "Bred", "Royal Blue", "Shadow Grey"]
      }
    ],
    inventory: 20
  },
  {
    name: "Puma RS-X",
    description: "The RS-X brings back the chunky sneaker trend with a bold design and comfortable cushioning. Perfect for making a statement.",
    price: 100.00,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
    variants: [
      {
        type: "Size",
        options: ["US 7", "US 8", "US 9", "US 10", "US 11"]
      },
      {
        type: "Color",
        options: ["White/Multi", "Black/Red", "Grey/Blue", "Pink/Purple"]
      }
    ],
    inventory: 28
  },
  {
    name: "Reebok Club C 85",
    description: "Clean and classic. The Club C 85 vintage shoes keep it simple with a timeless silhouette and minimalist style.",
    price: 70.00,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800",
    variants: [
      {
        type: "Size",
        options: ["US 7", "US 8", "US 9", "US 10", "US 11"]
      },
      {
        type: "Color",
        options: ["White/Green", "White/Navy", "All White", "Vintage White"]
      }
    ],
    inventory: 45
  },
  {
    name: "ASICS Gel-Lyte III",
    description: "Originally created in 1990, the GEL-LYTE III sneaker continues to celebrate the shoe's 30th anniversary with its iconic split-tongue design.",
    price: 90.00,
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800",
    variants: [
      {
        type: "Size",
        options: ["US 7", "US 8", "US 9", "US 10", "US 11"]
      },
      {
        type: "Color",
        options: ["White/Blue", "Grey/Red", "Black/Yellow", "Navy/Orange"]
      }
    ],
    inventory: 32
  },
  {
    name: "Fila Disruptor II",
    description: "The Disruptor II is a bold statement shoe featuring a chunky sole and retro basketball styling that's perfect for casual wear.",
    price: 65.00,
    image: "https://images.unsplash.com/photo-1600369671738-c44f8df1381c?w=800",
    variants: [
      {
        type: "Size",
        options: ["US 6", "US 7", "US 8", "US 9", "US 10", "US 11"]
      },
      {
        type: "Color",
        options: ["White", "Black", "White/Navy", "Pink"]
      }
    ],
    inventory: 38
  },
  {
    name: "Nike Air Force 1 '07",
    description: "The radiance lives on in the Nike Air Force 1 '07, the basketball original that puts a fresh spin on what you know best.",
    price: 90.00,
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800",
    variants: [
      {
        type: "Size",
        options: ["US 7", "US 8", "US 9", "US 10", "US 11", "US 12"]
      },
      {
        type: "Color",
        options: ["Triple White", "Triple Black", "White/Black", "White/Red"]
      }
    ],
    inventory: 55
  },
  {
    name: "Adidas Stan Smith",
    description: "Originally made for tennis, this clean and simple shoe is now a street-style staple. Features the classic perforated 3-Stripes design.",
    price: 85.00,
    image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800",
    variants: [
      {
        type: "Size",
        options: ["US 7", "US 8", "US 9", "US 10", "US 11"]
      },
      {
        type: "Color",
        options: ["White/Green", "All White", "White/Navy", "White/Red"]
      }
    ],
    inventory: 42
  },
  {
    name: "On Cloud 5",
    description: "The next generation of the On Cloud features improved comfort and performance. CloudTec technology provides a smooth and responsive ride.",
    price: 140.00,
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800",
    variants: [
      {
        type: "Size",
        options: ["US 7", "US 8", "US 9", "US 10", "US 11"]
      },
      {
        type: "Color",
        options: ["All White", "Black/White", "Grey/Orange", "Navy/White"]
      }
    ],
    inventory: 22
  },
  {
    name: "Allbirds Tree Runners",
    description: "Made from sustainably sourced eucalyptus tree fiber, these lightweight shoes offer breathability and comfort for everyday wear.",
    price: 98.00,
    image: "https://images.unsplash.com/photo-1529810313688-44ea1c2d81d3?w=800",
    variants: [
      {
        type: "Size",
        options: ["US 7", "US 8", "US 9", "US 10", "US 11"]
      },
      {
        type: "Color",
        options: ["Natural Grey", "Natural White", "Storm", "Blizzard"]
      }
    ],
    inventory: 18
  },
  {
    name: "Salomon XT-6",
    description: "Originally launched in 2013, the XT-6 is the preferred footwear of world-class trail runners for ultra-distance races in harsh conditions.",
    price: 160.00,
    image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?w=800",
    variants: [
      {
        type: "Size",
        options: ["US 7", "US 8", "US 9", "US 10", "US 11"]
      },
      {
        type: "Color",
        options: ["Black/Phantom", "Vanilla Ice", "Quiet Shade", "Mindful Grey"]
      }
    ],
    inventory: 15
  }
];

export async function seedProducts() {
  await dbConnect();
  
  try {
    // Clear existing products
    await Product.deleteMany({});
    
    // Insert sample products
    const products = await Product.insertMany(sampleProducts);
    console.log('Sample products seeded successfully:', products.length);
    return products;
  } catch (error) {
    console.error('Error seeding products:', error);
    throw error;
  }
}

// If this file is run directly
if (require.main === module) {
  seedProducts()
    .then(() => {
      console.log('Seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}