export interface Product {
  id: string
  name: string
  slug: string
  image: string
  price: number
  category: string
}

export const products: Product[] = [
  // =========================
  // Dining & Bar Chairs
  // =========================
  {
    id: "dbc-1",
    name: "Classic Wooden Dining Chair",
    slug: "classic-wooden-dining-chair",
    image: "/images/products/dining-chair-1.jpg",
    price: 8500,
    category: "dining-and-bar-chairs"
  },
  {
    id: "dbc-2",
    name: "Modern Bar Stool",
    slug: "modern-bar-stool",
    image: "/images/products/dining-chair-2.jpg",
    price: 9200,
    category: "dining-and-bar-chairs"
  },
  {
    id: "dbc-3",
    name: "Leather Bar Chair",
    slug: "leather-bar-chair",
    image: "/images/products/dining-chair-3.jpg",
    price: 11500,
    category: "dining-and-bar-chairs"
  },
  {
    id: "dbc-4",
    name: "Minimal Dining Chair",
    slug: "minimal-dining-chair",
    image: "/images/products/dining-chair-4.jpg",
    price: 7800,
    category: "dining-and-bar-chairs"
  },
  {
    id: "dbc-5",
    name: "High Back Bar Chair",
    slug: "high-back-bar-chair",
    image: "/images/products/dining-chair-5.jpg",
    price: 9900,
    category: "dining-and-bar-chairs"
  },

  // =========================
  // Tables
  // =========================
  {
    id: "tbl-1",
    name: "Solid Wood Dining Table",
    slug: "solid-wood-dining-table",
    image: "/images/products/table-1.jpg",
    price: 32000,
    category: "tables"
  },
  {
    id: "tbl-2",
    name: "Modern Coffee Table",
    slug: "modern-coffee-table",
    image: "/images/products/table-2.jpg",
    price: 14500,
    category: "tables"
  },
  {
    id: "tbl-3",
    name: "Outdoor Patio Table",
    slug: "outdoor-patio-table",
    image: "/images/products/table-3.jpg",
    price: 18200,
    category: "tables"
  },
  {
    id: "tbl-4",
    name: "Glass Top Table",
    slug: "glass-top-table",
    image: "/images/products/table-4.jpg",
    price: 21000,
    category: "tables"
  },
  {
    id: "tbl-5",
    name: "Round Side Table",
    slug: "round-side-table",
    image: "/images/products/table-5.jpg",
    price: 9800,
    category: "tables"
  },

  // =========================
  // Lounging
  // =========================
  {
    id: "lng-1",
    name: "Outdoor Lounge Set",
    slug: "outdoor-lounge-set",
    image: "/images/products/lounge-1.jpg",
    price: 45000,
    category: "lounging"
  },
  {
    id: "lng-2",
    name: "Garden Lounger",
    slug: "garden-lounger",
    image: "/images/products/lounge-2.jpg",
    price: 18500,
    category: "lounging"
  },
  {
    id: "lng-3",
    name: "Minimal Lounge Sofa",
    slug: "minimal-lounge-sofa",
    image: "/images/products/lounge-3.jpg",
    price: 52000,
    category: "lounging"
  },
  {
    id: "lng-4",
    name: "Balcony Lounger",
    slug: "balcony-lounger",
    image: "/images/products/lounge-4.jpg",
    price: 16500,
    category: "lounging"
  },
  {
    id: "lng-5",
    name: "Premium Recliner",
    slug: "premium-recliner",
    image: "/images/products/lounge-5.jpg",
    price: 39500,
    category: "lounging"
  },

  // =========================
  // Lounge Chairs
  // =========================
  {
    id: "lc-1",
    name: "Luxury Lounge Chair",
    slug: "luxury-lounge-chair",
    image: "/images/products/lounge-chair-1.jpg",
    price: 22500,
    category: "lounge-chairs"
  },
  {
    id: "lc-2",
    name: "Woven Rope Chair",
    slug: "woven-rope-chair",
    image: "/images/products/lounge-chair-2.jpg",
    price: 19800,
    category: "lounge-chairs"
  },
  {
    id: "lc-3",
    name: "Modern Accent Chair",
    slug: "modern-accent-chair",
    image: "/images/products/lounge-chair-3.jpg",
    price: 17500,
    category: "lounge-chairs"
  },
  {
    id: "lc-4",
    name: "Scandinavian Chair",
    slug: "scandinavian-chair",
    image: "/images/products/lounge-chair-4.jpg",
    price: 21000,
    category: "lounge-chairs"
  },
  {
    id: "lc-5",
    name: "Outdoor Lounge Armchair",
    slug: "outdoor-lounge-armchair",
    image: "/images/products/lounge-chair-5.jpg",
    price: 23500,
    category: "lounge-chairs"
  },

  // =========================
  // Beach Chairs
  // =========================
  {
    id: "bc-1",
    name: "Foldable Beach Chair",
    slug: "foldable-beach-chair",
    image: "/images/products/beach-chair-1.jpg",
    price: 6500,
    category: "beach-chairs"
  },
  {
    id: "bc-2",
    name: "Wooden Beach Chair",
    slug: "wooden-beach-chair",
    image: "/images/products/beach-chair-2.jpg",
    price: 8200,
    category: "beach-chairs"
  },
  {
    id: "bc-3",
    name: "Reclining Beach Chair",
    slug: "reclining-beach-chair",
    image: "/images/products/beach-chair-3.jpg",
    price: 9900,
    category: "beach-chairs"
  },
  {
    id: "bc-4",
    name: "Premium Sun Lounger",
    slug: "premium-sun-lounger",
    image: "/images/products/beach-chair-4.jpg",
    price: 14500,
    category: "beach-chairs"
  },
  {
    id: "bc-5",
    name: "Lightweight Beach Chair",
    slug: "lightweight-beach-chair",
    image: "/images/products/beach-chair-5.jpg",
    price: 7200,
    category: "beach-chairs"
  },

  // =========================
  // Iconics
  // =========================
  {
    id: "ic-1",
    name: "Iconic Designer Chair",
    slug: "iconic-designer-chair",
    image: "/images/products/iconic-1.jpg",
    price: 58000,
    category: "iconics"
  },
  {
    id: "ic-2",
    name: "Statement Lounge Chair",
    slug: "statement-lounge-chair",
    image: "/images/products/iconic-2.jpg",
    price: 46500,
    category: "iconics"
  },
  {
    id: "ic-3",
    name: "Limited Edition Table",
    slug: "limited-edition-table",
    image: "/images/products/iconic-3.jpg",
    price: 62000,
    category: "iconics"
  },
  {
    id: "ic-4",
    name: "Architect Series Chair",
    slug: "architect-series-chair",
    image: "/images/products/iconic-4.jpg",
    price: 71000,
    category: "iconics"
  },
  {
    id: "ic-5",
    name: "Signature Outdoor Seat",
    slug: "signature-outdoor-seat",
    image: "/images/products/iconic-5.jpg",
    price: 54000,
    category: "iconics"
  },

  // =========================
  // Side Tables
  // =========================
  {
    id: "st-1",
    name: "Compact Side Table",
    slug: "compact-side-table",
    image: "/images/products/side-table-1.jpg",
    price: 7500,
    category: "side-tables"
  },
  {
    id: "st-2",
    name: "Metal Frame Side Table",
    slug: "metal-frame-side-table",
    image: "/images/products/side-table-2.jpg",
    price: 8800,
    category: "side-tables"
  },
  {
    id: "st-3",
    name: "Round Marble Side Table",
    slug: "round-marble-side-table",
    image: "/images/products/side-table-3.jpg",
    price: 13500,
    category: "side-tables"
  },
  {
    id: "st-4",
    name: "Outdoor Side Table",
    slug: "outdoor-side-table",
    image: "/images/products/side-table-4.jpg",
    price: 9600,
    category: "side-tables"
  },
  {
    id: "st-5",
    name: "Minimalist Side Table",
    slug: "minimalist-side-table",
    image: "/images/products/side-table-5.jpg",
    price: 8200,
    category: "side-tables"
  },

  // =========================
  // Lighting Accessories
  // =========================
  {
    id: "la-1",
    name: "Outdoor Floor Lamp",
    slug: "outdoor-floor-lamp",
    image: "/images/products/light-1.jpg",
    price: 18500,
    category: "lighting-accessories"
  },
  {
    id: "la-2",
    name: "Portable LED Lamp",
    slug: "portable-led-lamp",
    image: "/images/products/light-2.jpg",
    price: 9200,
    category: "lighting-accessories"
  },
  {
    id: "la-3",
    name: "Designer Table Lamp",
    slug: "designer-table-lamp",
    image: "/images/products/light-3.jpg",
    price: 14500,
    category: "lighting-accessories"
  },
  {
    id: "la-4",
    name: "Ambient Outdoor Light",
    slug: "ambient-outdoor-light",
    image: "/images/products/light-4.jpg",
    price: 16800,
    category: "lighting-accessories"
  },
  {
    id: "la-5",
    name: "Minimal Lantern Light",
    slug: "minimal-lantern-light",
    image: "/images/products/light-5.jpg",
    price: 7800,
    category: "lighting-accessories"
  },

  // =========================
  // Accessories
  // =========================
  {
    id: "acc-1",
    name: "Outdoor Cushion Set",
    slug: "outdoor-cushion-set",
    image: "/images/products/accessory-1.jpg",
    price: 4200,
    category: "accessories"
  },
  {
    id: "acc-2",
    name: "Decorative Planter",
    slug: "decorative-planter",
    image: "/images/products/accessory-2.jpg",
    price: 6800,
    category: "accessories"
  },
  {
    id: "acc-3",
    name: "Weatherproof Cover",
    slug: "weatherproof-cover",
    image: "/images/products/accessory-3.jpg",
    price: 5200,
    category: "accessories"
  },
  {
    id: "acc-4",
    name: "Outdoor Rug",
    slug: "outdoor-rug",
    image: "/images/products/accessory-4.jpg",
    price: 11500,
    category: "accessories"
  },
  {
    id: "acc-5",
    name: "Side Storage Basket",
    slug: "side-storage-basket",
    image: "/images/products/accessory-5.jpg",
    price: 3900,
    category: "accessories"
  }
]
