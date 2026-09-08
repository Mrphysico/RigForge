import { CommunityPost } from '../types/hardware';

export interface TrendingTopic {
  tag: string;
  count: string;
}

export interface TopMember {
  handle: string;
  name: string;
  avatar: string;
  points: string;
  badge: string;
}

export const TRENDING_TOPICS: TrendingTopic[] = [
  { tag: '#pc-builds', count: '1.2K posts' },
  { tag: '#gpu', count: '980 posts' },
  { tag: '#setup-showcase', count: '850 posts' },
  { tag: '#help', count: '720 posts' },
  { tag: '#budget-build', count: '640 posts' },
];

export const TOP_MEMBERS: TopMember[] = [
  {
    handle: '@shadowbyte',
    name: 'Shadow Byte',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=120&q=80',
    points: '12.4k points',
    badge: 'Elite Builder',
  },
  {
    handle: '@technosoul',
    name: 'TechnoSoul',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    points: '10.2k points',
    badge: 'Hardware Pro',
  },
  {
    handle: '@rgpioneer',
    name: 'RG Pioneer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    points: '8.9k points',
    badge: 'Cable Artist',
  },
];

export const MOCK_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    authorName: 'TechnoSoul',
    authorHandle: '@technosoul',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    authorBadge: 'Hardware Pro',
    timeAgo: '2h ago',
    title: 'Finally completed my white build! What do you guys think?',
    content: 'Took over 4 weeks to source the white Lian Li fans and white sleeved cables in Mumbai. Powered by Ryzen 7 7800X3D and RTX 4080 Super Trinity. Temperatures idle at 32°C and peak at 64°C under full Cinebench and Cyberpunk 4K max raytracing.',
    category: 'Showcases',
    likesCount: 342,
    commentsCount: 48,
    images: [
      'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    ],
    tags: ['#white-build', '#pc-builds', '#setup-showcase'],
  },
  {
    id: 'post-2',
    authorName: 'GamerRX',
    authorHandle: '@gamerrx',
    authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
    timeAgo: '5h ago',
    title: 'Best GPU under 30K in India right now?',
    content: 'Looking to upgrade from a GTX 1660 Super. My budget is strictly ₹28,000 - ₹32,000. Considering between RTX 3060 12GB for the VRAM or RX 7600 8GB for raster speed. Playing at 1080p high refresh rate. Any advice from fellow Indian builders?',
    category: 'Discussions',
    likesCount: 120,
    commentsCount: 67,
    images: [],
    tags: ['#gpu', '#budget-build', '#help'],
  },
  {
    id: 'post-3',
    authorName: 'BuildMaster',
    authorHandle: '@buildmaster',
    authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80',
    timeAgo: '1d ago',
    title: 'Cable management tips for small cases?',
    content: 'When routing 24-pin ATX and dual 8-pin EPS cables in compact mid-towers, always route the thicker main harness first behind the motherboard tray and secure with velcro ties before installing the PSU modular cables. Saves hours of headache!',
    category: 'Help',
    likesCount: 98,
    commentsCount: 34,
    images: [
      'https://images.unsplash.com/photo-1547394765-185e1e68f34e?auto=format&fit=crop&w=800&q=80',
    ],
    tags: ['#help', '#pc-builds'],
  },
];
