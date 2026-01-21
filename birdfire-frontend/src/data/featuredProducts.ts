// data/featuredProducts.ts

export interface ProductVariant {
  id: string;
  title: string;
  price: number;
  compare_at_price?: number;
  sku: string;
  available: boolean;
  inventory_quantity?: number;
}

export interface Product {
  id: string;
  title: string;
  handle: string;
  description: string;

  price: number;
  compare_at_price?: number;

  featured_image: string;
  secondary_image?: string;

  variants: ProductVariant[];
  media?: ProductMedia[];

  has_options: boolean;

  rating: number;
  review_count: number;

  badge?: 'sale' | 'new' | 'hot';
  badge_text?: string;

  vendor?: string;
  product_type?: string;
  tags?: string[];
}

export interface ProductMedia {
  id: string;
  position: number;
  media_type: 'image' | 'video' | 'model';
  src: string;
  aspect_ratio: number;
  height: number;
  width: number;
  alt?: string;
}

export const featuredProducts: Product[] = [
  
    {
      id: '9871919776037',
      title: 'Modern Single Sofa Chair for Stylish Living Room',
      handle: 'modern-single-sofa-chair-for-stylish-living-room',
      description: 'Elegant single sofa chair perfect for modern living spaces. Features premium upholstery and sturdy wooden frame.',
      price: 20000, // $200.00
      featured_image: 'https://nov-minicom.myshopify.com/cdn/shop/files/1-min_44cdab73-bcb9-483d-ba6c-cbfc32321ed9.jpg?v=1749112427&width=400',
      secondary_image: 'https://nov-minicom.myshopify.com/cdn/shop/files/2-min_812100f8-1636-4efd-a57e-1778f6af908c.jpg?v=1751276352&width=400',
      variants: [
        {
          id: '50573133512997',
          title: 'Default Title',
          price: 20000,
          sku: 'a-123',
          available: true,
          inventory_quantity: 15,
        }
      ],
      media: [
        {
          id: '53111793418533',
          position: 1,
          media_type: 'image',
          src: 'https://nov-minicom.myshopify.com/cdn/shop/files/1-min_44cdab73-bcb9-483d-ba6c-cbfc32321ed9.jpg?v=1749112427',
          aspect_ratio: 0.806,
          height: 1240,
          width: 1000,
          alt: 'Modern Single Sofa Chair',
        },
        {
          id: '53401052545317',
          position: 2,
          media_type: 'model',
          src: 'https://nov-minicom.myshopify.com/cdn/shop/files/preview_images/sofa_chair.jpg?v=1751276308',
          aspect_ratio: 1.0,
          height: 1024,
          width: 1024,
          alt: '3D Model of Sofa Chair',
        }
      ],
      has_options: false,
      rating: 4.8,
      review_count: 24,
      vendor: 'Furniture Co',
      product_type: 'Furniture',
      tags: ['living-room', 'sofa', 'modern', 'chair'],
    },
    {
      id: '9871918203173',
      title: 'Decorative Cactus Plant Pot for Indoor Display',
      handle: 'decorative-cactus-plant-pot-for-indoor-display',
      description: 'Beautiful ceramic plant pot perfect for small cacti and succulents. Available in multiple colors and sizes.',
      price: 3700, // $37.00
      compare_at_price: 4500, // $45.00
      featured_image: 'https://nov-minicom.myshopify.com/cdn/shop/files/1-min_bdb6b918-6f94-45a7-b53e-4d9977e4c158.jpg?v=1749111975&width=400',
      secondary_image: 'https://nov-minicom.myshopify.com/cdn/shop/files/2-min_f49867b6-e7a1-46a0-9d91-4e9ee0a24619.jpg?v=1749111975&width=400',
      variants: [
        {
          id: '50680106844453',
          title: 'White / Small',
          price: 3700,
          compare_at_price: 4500,
          sku: 'a-123',
          available: true,
          inventory_quantity: 42,
        },
        {
          id: '50680113856805',
          title: 'White / Medium',
          price: 3900,
          compare_at_price: 4700,
          sku: 'a-124',
          available: true,
          inventory_quantity: 28,
        },
        {
          id: '50680113889573',
          title: 'White / Large',
          price: 4100,
          compare_at_price: 4900,
          sku: 'a-125',
          available: true,
          inventory_quantity: 15,
        }
      ],
      media: [
        {
          id: '53111575216421',
          position: 1,
          media_type: 'image',
          src: 'https://nov-minicom.myshopify.com/cdn/shop/files/1-min_bdb6b918-6f94-45a7-b53e-4d9977e4c158.jpg?v=1749111975',
          aspect_ratio: 0.806,
          height: 1240,
          width: 1000,
          alt: 'White Plant Pot',
        }
      ],
      has_options: true,
      rating: 4.5,
      review_count: 18,
      badge: 'sale',
      badge_text: '-18%',
      vendor: 'Home Decor Inc',
      product_type: 'Home Decor',
      tags: ['plant-pot', 'cactus', 'decorative', 'indoor'],
    },
    {
      id: '9871896052005',
      title: 'Solid Wood TV Stand with Storage Drawers Design',
      handle: 'solid-wood-tv-stand-with-storage-drawers-design',
      description: 'Sturdy solid wood TV stand with spacious drawers for media storage. Perfect for living room organization.',
      price: 13500, // $135.00
      featured_image: 'https://nov-minicom.myshopify.com/cdn/shop/files/1-min_2ee03dbe-b3f3-4ffe-a2f8-299ecbdfaa06.jpg?v=1749111269&width=400',
      secondary_image: 'https://nov-minicom.myshopify.com/cdn/shop/files/2-min_0074cada-5b4b-4553-9e9f-ef97c4142b82.jpg?v=1749111269&width=400',
      variants: [
        {
          id: '50680117428517',
          title: 'Small',
          price: 13500,
          sku: 'tv-stand-small',
          available: true,
          inventory_quantity: 8,
        },
        {
          id: '50680117461285',
          title: 'Medium',
          price: 15500,
          sku: 'tv-stand-medium',
          available: true,
          inventory_quantity: 12,
        },
        {
          id: '50680117494053',
          title: 'Large',
          price: 18500,
          sku: 'tv-stand-large',
          available: true,
          inventory_quantity: 6,
        }
      ],
      media: [],
      has_options: true,
      rating: 4.9,
      review_count: 32,
      badge: 'new',
      badge_text: 'New',
      vendor: 'Woodcraft Furniture',
      product_type: 'Furniture',
      tags: ['tv-stand', 'wood', 'storage', 'living-room'],
    },
    {
      id: '9871883534629',
      title: 'Modern Wooden Lounge Chair with Wide Fabric Arms',
      handle: 'modern-wooden-lounge-chair-with-wide-fabric-arms',
      description: 'Comfortable lounge chair with wide arms for maximum relaxation. Features premium fabric and solid wood frame.',
      price: 15500, // $155.00
      featured_image: 'https://nov-minicom.myshopify.com/cdn/shop/files/1-min_202fa2e4-302c-481c-aab5-74b98f061838.jpg?v=1749110906&width=400',
      secondary_image: 'https://nov-minicom.myshopify.com/cdn/shop/files/2-min_95f196a8-48e1-40fb-a768-3f06b97b8b1e.jpg?v=1751276700&width=400',
      variants: [
        {
          id: '50573045858597',
          title: 'Default Title',
          price: 15500,
          sku: 'lounge-chair-01',
          available: true,
          inventory_quantity: 10,
        }
      ],
      media: [
        {
          id: '53111116169509',
          position: 1,
          media_type: 'image',
          src: 'https://nov-minicom.myshopify.com/cdn/shop/files/1-min_202fa2e4-302c-481c-aab5-74b98f061838.jpg?v=1749110906',
          aspect_ratio: 0.806,
          height: 1240,
          width: 1000,
          alt: 'Lounge Chair',
        },
        {
          id: '53401080660261',
          position: 2,
          media_type: 'video',
          src: 'https://nov-minicom.myshopify.com/cdn/shop/files/preview_images/f5eb9211de884b0587839972fc9ad0cf.thumbnail.0000000000.jpg?v=1751276606',
          aspect_ratio: 0.563,
          height: 1280,
          width: 720,
          alt: 'Lounge Chair Video',
        }
      ],
      has_options: false,
      rating: 4.7,
      review_count: 21,
      vendor: 'Comfort Living',
      product_type: 'Furniture',
      tags: ['lounge-chair', 'wooden', 'fabric', 'comfort'],
    },
    {
      id: '9871877079333',
      title: 'Modern Low Profile Swivel Sofa with Soft Seat',
      handle: 'modern-low-profile-swivel-sofa-with-soft-seat',
      description: 'Contemporary swivel sofa with low profile design and ultra-soft seating. Perfect for modern apartments.',
      price: 12500, // $125.00
      featured_image: 'https://nov-minicom.myshopify.com/cdn/shop/files/1-min_be47ec7a-ae18-44a0-ad6b-efeabb425930.jpg?v=1749110719&width=400',
      secondary_image: 'https://nov-minicom.myshopify.com/cdn/shop/files/2-min_85cb53bf-d322-472a-93fc-78be652aee20.jpg?v=1749110751&width=400',
      variants: [
        {
          id: '50573030228261',
          title: 'Default Title',
          price: 12500,
          sku: 'swivel-sofa-01',
          available: true,
          inventory_quantity: 7,
        }
      ],
      media: [],
      has_options: false,
      rating: 4.6,
      review_count: 19,
      vendor: 'Modern Living',
      product_type: 'Furniture',
      tags: ['sofa', 'swivel', 'modern', 'low-profile'],
    },
    {
      id: '9871918006565',
      title: 'Compact Mini Plant Pot for Desk or Shelf Display',
      handle: 'compact-mini-plant-pot-for-desk-or-shelf-display',
      description: 'Tiny plant pot perfect for small spaces. Great for desk decoration or shelf displays.',
      price: 3700, // $37.00
      featured_image: 'https://nov-minicom.myshopify.com/cdn/shop/files/1-min_0c6275f8-a24e-4702-90d0-bd01e49e1b67.jpg?v=1749111925&width=400',
      secondary_image: 'https://nov-minicom.myshopify.com/cdn/shop/files/2-min_c3032876-122b-4901-914e-152291fd130f.jpg?v=1749111925&width=400',
      variants: [
        {
          id: '50573128892709',
          title: 'Default Title',
          price: 3700,
          sku: 'mini-pot-01',
          available: true,
          inventory_quantity: 56,
        }
      ],
      media: [],
      has_options: false,
      rating: 4.3,
      review_count: 14,
      vendor: 'Mini Decor',
      product_type: 'Home Decor',
      tags: ['mini', 'plant-pot', 'desk', 'small'],
    },
    {
      id: '9871892775205',
      title: 'Round Wooden Coffee Table with Marble Top Design',
      handle: 'round-wooden-coffee-table-with-marble-top-design',
      description: 'Elegant round coffee table with marble top and wooden base. Perfect centerpiece for any living room.',
      price: 4000, // $40.00
      featured_image: 'https://nov-minicom.myshopify.com/cdn/shop/files/1-min_02d0e979-f8f4-49b4-bbc3-c4852675c021.jpg?v=1749111160&width=400',
      secondary_image: 'https://nov-minicom.myshopify.com/cdn/shop/files/2-min_bc28343c-916d-4370-a62c-c10fd668719d.jpg?v=1749111160&width=400',
      variants: [
        {
          id: '50573065847077',
          title: 'Default Title',
          price: 4000,
          sku: 'coffee-table-01',
          available: true,
          inventory_quantity: 4,
        }
      ],
      media: [],
      has_options: false,
      rating: 4.4,
      review_count: 16,
      badge: 'hot',
      badge_text: 'Hot',
      vendor: 'Table Masters',
      product_type: 'Furniture',
      tags: ['coffee-table', 'round', 'marble', 'wooden'],
    },
    {
      id: '9871899951397',
      title: 'Wooden Basket with Clean Towels for Home Decor',
      handle: 'wooden-basket-with-clean-towels-for-home-decor',
      description: 'Beautiful wooden basket perfect for storing towels or as a decorative piece. Comes with premium cotton towels.',
      price: 2500, // $25.00
      compare_at_price: 3000, // $30.00
      featured_image: 'https://nov-minicom.myshopify.com/cdn/shop/files/1-min_dfb1df34-1c68-4ee5-8bfb-ae5b3f5e430b.jpg?v=1749111367&width=400',
      secondary_image: 'https://nov-minicom.myshopify.com/cdn/shop/files/2-min_d10ef3ee-74be-4e60-942b-a19bc80ad4f0.jpg?v=1749111367&width=400',
      variants: [
        {
          id: '50573083574565',
          title: 'Default Title',
          price: 2500,
          compare_at_price: 3000,
          sku: 'basket-towels-01',
          available: true,
          inventory_quantity: 23,
        }
      ],
      media: [],
      has_options: false,
      rating: 4.2,
      review_count: 11,
      badge: 'sale',
      badge_text: '-17%',
      vendor: 'Home Essentials',
      product_type: 'Home Decor',
      tags: ['basket', 'towels', 'wooden', 'bathroom'],
    }
  ];
