export type ComponentCategory =
  | 'cpu'
  | 'gpu'
  | 'motherboard'
  | 'ram'
  | 'nvme_ssd'
  | 'sata_ssd'
  | 'hdd'
  | 'psu'
  | 'case'
  | 'air_cooler'
  | 'aio_cooler'
  | 'case_fans'
  | 'thermal_paste'
  | 'monitor'
  | 'keyboard'
  | 'mouse'
  // Legacy aliases for backward compatibility with PC Builder & older cart state:
  | 'cooler'
  | 'storage'
  | 'peripherals';

export interface HardwareSpecs {
  socket?: string; // e.g. 'AM5', 'LGA1700'
  cores?: number;
  threads?: number;
  baseClock?: string;
  boostClock?: string;
  tdp?: number; // Watts drawn
  vram?: string; // e.g. '24GB GDDR6X'
  ramType?: 'DDR4' | 'DDR5';
  speed?: string; // e.g. 'DDR5-6000'
  capacity?: string; // e.g. '32GB (2x16GB)', '2TB'
  storageType?: 'NVMe M.2 Gen4' | 'NVMe M.2 Gen5' | 'SATA SSD';
  formFactor?: 'ATX' | 'Micro-ATX' | 'Mini-ITX' | 'Mid-Tower' | 'Full-Tower';
  chipset?: string; // e.g. 'AMD B650', 'Intel Z790'
  memorySlots?: number;
  maxMemory?: string;
  supportedRamType?: 'DDR4' | 'DDR5';
  wattage?: number; // PSU rated wattage e.g. 850, 1000
  efficiency?: '80+ Bronze' | '80+ Gold' | '80+ Platinum' | '80+ Titanium';
  modular?: 'Full' | 'Semi' | 'Non';
  radiatorSize?: string; // e.g. '360mm AIO', 'Dual-Tower Air'
  color?: string;
  rgb?: boolean;
  dpi?: number;
  switches?: string;
  connectivity?: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ComponentCategory;
  price: number | null;
  originalPrice?: number;
  mrp?: number;
  seller?: string;
  warranty?: string;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  stockStatus?: 'In Stock' | 'Limited Stock' | 'Out of Stock' | 'Unknown';
  placeholder?: boolean;
  specs: HardwareSpecs;
  image: string;
  description: string;
  featured?: boolean;
  tags?: string[];
  catalogueDetails?: Record<string, any>;
  keySpecsSummary?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface BuilderSlotConfig {
  category: ComponentCategory;
  label: string;
  sublabel: string;
  icon: string;
  required: boolean;
}

export interface CompatibilityIssue {
  severity: 'error' | 'warning' | 'info';
  title: string;
  message: string;
  slots: ComponentCategory[];
}

export interface ShowcaseBuild {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  specsSummary: string;
  cpu: string;
  gpu: string;
  ram: string;
  storage: string;
  totalPrice: number;
  likes: number;
  comments: number;
  image: string;
  category: 'Popular' | 'Latest' | 'Budget' | 'High-End' | 'Gaming' | 'Streaming' | 'Workstation';
  description: string;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  authorBadge?: string;
  timeAgo: string;
  title: string;
  content: string;
  category: 'Discussions' | 'Showcases' | 'Help' | 'Events';
  likesCount: number;
  commentsCount: number;
  images: string[];
  tags: string[];
}

export interface GuideArticle {
  id: string;
  title: string;
  subtitle: string;
  category: 'PC Building' | 'Components' | 'Gaming' | 'Software' | 'Troubleshooting';
  readTime: string;
  image: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  content: string[];
}
