import { ComponentCategory } from './hardware';

export interface BaseCatalogueProduct {
  productId: string;
  name: string;
  brand: string;
  manufacturer: string;
  category: ComponentCategory;
  categoryName: string;
  currentPrice: number | null;
  mrp: number | null;
  lowestPrice?: number | null;
  seller: string;
  stockStatus: 'In Stock' | 'Limited Stock' | 'Out of Stock' | 'Unknown';
  warranty: string;
  productUrl?: string;
  image: string;
  rating: number;
  reviewsCount: number;
  keySpecs: string[];
  description: string;
  featured?: boolean;
  placeholder?: boolean;
}

export interface CpuProduct extends BaseCatalogueProduct {
  category: 'cpu';
  seriesGeneration: string;
  architecture: string;
  launchDate?: string;
  boxedOrTray: 'Boxed' | 'Tray';
  unlocked: boolean;
  cores: number;
  threads: number;
  baseClock: string;
  boostClock: string;
  cache: string;
  tdp: number;
  integratedGraphics: string;
  npu?: string;
  socket: string;
  chipsetSupport: string[];
  ramType: string;
  maxMemory: string;
  memoryChannels: number;
  pcieVersion: string;
  coolerIncluded: boolean;
  coolerRecommendation: string;
  platformNotes?: string;
}

export interface GpuProduct extends BaseCatalogueProduct {
  category: 'gpu';
  boardPartner: string;
  model: string;
  gpuFamily: string;
  generation: string;
  architecture: string;
  cudaOrStreamProcessors: number;
  rtCoresOrRayAccelerators?: number;
  tensorOrAiAccelerators?: number;
  baseClock: string;
  boostClock: string;
  vram: string;
  memoryType: string;
  memorySpeed?: string;
  busWidth: string;
  bandwidth?: string;
  length: string;
  slotThickness: string;
  coolerType: string;
  fanCount: number;
  tbpTgp: number;
  recommendedPsu: number;
  connectorType: string;
  displayOutputs: string;
  maxResolution: string;
  features: string[];
}

export interface MotherboardProduct extends BaseCatalogueProduct {
  category: 'motherboard';
  boardModel: string;
  chipset: string;
  socket: string;
  supportedCpuFamilies: string[];
  vrmPhases: string;
  ramGeneration: 'DDR4' | 'DDR5';
  dimmSlots: number;
  maxMemoryCapacity: string;
  supportedSpeeds: string;
  pcieSlots: string;
  m2Slots: number;
  m2Details: string;
  sataPorts: number;
  rearIo: string;
  ethernet: string;
  wireless: string;
  audio: string;
  biosFlashback: boolean;
  formFactor: 'ATX' | 'Micro-ATX' | 'Mini-ITX' | 'E-ATX';
}

export interface RamProduct extends BaseCatalogueProduct {
  category: 'ram';
  capacity: string;
  kitSize: string;
  ddrGeneration: 'DDR4' | 'DDR5';
  speed: string;
  casLatency: string;
  timings?: string;
  voltage: string;
  ecc: 'Non-ECC' | 'ECC' | 'Non-ECC (On-die ECC)' | 'On-die ECC';
  profileSupport: string; // XMP / EXPO
  rgb: boolean;
  height: string;
}

export interface NvmeSsdProduct extends BaseCatalogueProduct {
  category: 'nvme_ssd';
  formFactor: 'M.2 2280' | 'M.2 2230' | 'M.2 2242';
  capacity: string;
  interface: 'PCIe 3.0 x4' | 'PCIe 4.0 x4' | 'PCIe 5.0 x4';
  nandType: string;
  controller?: string;
  dramCache: string;
  sequentialRead: string;
  sequentialWrite: string;
  tbwEndurance: string;
  heatsinkIncluded: boolean;
}

export interface SataSsdProduct extends BaseCatalogueProduct {
  category: 'sata_ssd';
  formFactor: '2.5-inch SATA' | 'M.2 SATA';
  capacity: string;
  interface: 'SATA III 6Gb/s';
  sequentialRead: string;
  sequentialWrite: string;
  nandType: string;
  dramCache: string;
  tbwEndurance: string;
  thickness: string;
}

export interface HddProduct extends BaseCatalogueProduct {
  category: 'hdd';
  family: 'Desktop 3.5-inch' | 'NAS' | 'Surveillance' | 'Enterprise' | 'Laptop 2.5-inch';
  capacity: string;
  rpm: '5400 RPM' | '7200 RPM';
  cacheSize: string;
  recordingTechnology: 'CMR' | 'SMR';
  interface: 'SATA III 6Gb/s';
  formFactor: '3.5-inch' | '2.5-inch';
  workloadRating?: string;
}

export interface PsuProduct extends BaseCatalogueProduct {
  category: 'psu';
  wattage: number;
  atxStandard: string; // ATX 3.0, ATX 3.1, ATX 2.x
  pcieGen5Connector: boolean; // 12V-2x6 / 12VHPWR
  efficiency: '80+ Bronze' | '80+ Silver' | '80+ Gold' | '80+ Platinum' | '80+ Titanium';
  cybeneticsRating?: string;
  modularity: 'Full Modular' | 'Semi-Modular' | 'Non-Modular';
  protections: string[]; // OVP, OCP, OPP, OTP, SCP, UVP
  length: string;
}

export interface CaseProduct extends BaseCatalogueProduct {
  category: 'case';
  caseType: 'Full Tower' | 'Mid Tower' | 'Mini Tower' | 'Mini-ITX / SFF' | 'Dual-Chamber Showcase';
  boardSupport: string[]; // ATX, Micro-ATX, Mini-ITX, E-ATX
  gpuClearance: string; // e.g. "410 mm"
  cpuCoolerClearance: string; // e.g. "185 mm"
  radiatorSupport: string; // e.g. "Up to 360mm front / top"
  includedFans: string;
  fanMounts: string;
  driveBays: string;
  frontIo: string;
  sidePanel: 'Tempered Glass' | 'Mesh Airflow' | 'Acrylic' | 'Solid Steel';
}

export interface AirCoolerProduct extends BaseCatalogueProduct {
  category: 'air_cooler';
  coolerType: 'Single Tower' | 'Dual Tower' | 'Low Profile' | 'Top-Flow';
  supportedSockets: string[];
  coolerHeight: string; // e.g. "160 mm"
  fanSize: string; // e.g. "2x 120mm"
  fanRpm: string;
  airflow: string;
  noiseLevel: string;
  heatpipeCount: number;
  tdpGuidance: string;
  ramClearance: string;
}

export interface AioCoolerProduct extends BaseCatalogueProduct {
  category: 'aio_cooler';
  radiatorSize: '120mm' | '240mm' | '280mm' | '360mm' | '420mm';
  radiatorThickness: string;
  pumpSpeed: string;
  fanSizeAndRpm: string;
  tubingLength: string;
  displayType: 'ARGB Infinity Mirror' | 'LCD Display' | 'RGB Ring' | 'Stealth / Non-RGB';
  supportedSockets: string[];
}

export interface CaseFanProduct extends BaseCatalogueProduct {
  category: 'case_fans';
  fanSize: '120mm' | '140mm' | '80mm' | '200mm';
  packQuantity: 'Single Fan' | '2-Pack' | '3-Pack' | '5-Pack';
  airflowCfm: string;
  staticPressure: string;
  noiseDba: string;
  rpmRange: string;
  pwmControl: boolean;
  rgbType: 'ARGB 5V 3-pin' | 'RGB 12V 4-pin' | 'Non-RGB';
  bearingType: string;
  daisyChainSupport: boolean;
}

export interface ThermalPasteProduct extends BaseCatalogueProduct {
  category: 'thermal_paste';
  pasteType: 'Thermal Grease / Compound' | 'Liquid Metal' | 'Thermal Pad';
  quantityGrams: string;
  thermalConductivity: string; // e.g. "12.5 W/mK"
  electricalConductivity: 'Electrically Non-Conductive' | 'Electrically Conductive';
  viscosity: string;
  includedAccessories: string;
  recommendedUse: string;
}

export interface MonitorProduct extends BaseCatalogueProduct {
  category: 'monitor';
  screenSize: string; // e.g. "27-inch", "34-inch Ultrawide"
  resolution: '1920x1080 (FHD)' | '2560x1440 (QHD)' | '3840x2160 (4K UHD)' | '3440x1440 (UWQHD)';
  panelType: 'Fast IPS' | 'IPS' | 'VA' | 'OLED' | 'QD-OLED' | 'Mini LED' | 'TN';
  refreshRate: string; // e.g. "180Hz", "240Hz", "144Hz"
  responseTime: string; // e.g. "1ms GTG", "0.03ms"
  curvature?: string; // e.g. "Flat", "1500R", "1800R"
  hdrSupport: string;
  syncTechnology: string; // e.g. "G-SYNC Compatible & AMD FreeSync Premium"
  videoPorts: string;
  ergonomics: string; // e.g. "Height, Tilt, Swivel, Pivot"
}

export interface KeyboardProduct extends BaseCatalogueProduct {
  category: 'keyboard';
  layout: 'Full-size (104/108)' | 'TKL (80%)' | '75%' | '65%' | '60%' | '96% / 1800';
  switchType: 'Mechanical Linear' | 'Mechanical Tactile' | 'Mechanical Clicky' | 'Optical' | 'Hall-Effect / Magnetic' | 'Membrane';
  connectivity: 'Wired USB-C' | 'Tri-Mode (Wired + 2.4GHz + BT)' | 'Bluetooth Multi-Device';
  hotSwappable: boolean;
  rgbLighting: 'Per-Key ARGB' | 'Rainbow Backlit' | 'White Backlit' | 'None';
  pollingRate: string; // e.g. "1000Hz", "8000Hz"
  batteryCapacity?: string;
  keycaps: string; // e.g. "Double-shot PBT", "ABS"
}

export interface MouseProduct extends BaseCatalogueProduct {
  category: 'mouse';
  mouseType: 'FPS Gaming' | 'Ultralight Competitive' | 'Ergonomic Productivity' | 'MMO / MOBA' | 'Ambidextrous';
  sensorModel: string;
  maxDpi: string; // e.g. "32,000 DPI", "16,000 DPI"
  trackingSpeedIps: string;
  pollingRate: string; // e.g. "1000Hz", "4000Hz", "8000Hz"
  weightGrams: string; // e.g. "60g", "89g"
  buttonCount: number;
  connectivity: 'Wired USB' | 'Wireless 2.4GHz Lightspeed' | 'Tri-Mode (Wireless + BT + Wired)';
  switchType: string;
  batteryLife?: string;
}

export type AnyCatalogueProduct =
  | CpuProduct
  | GpuProduct
  | MotherboardProduct
  | RamProduct
  | NvmeSsdProduct
  | SataSsdProduct
  | HddProduct
  | PsuProduct
  | CaseProduct
  | AirCoolerProduct
  | AioCoolerProduct
  | CaseFanProduct
  | ThermalPasteProduct
  | MonitorProduct
  | KeyboardProduct
  | MouseProduct;

export interface CategoryMetadata {
  id: ComponentCategory;
  name: string;
  shortLabel: string;
  iconName: string;
  description: string;
  typicalFilterKeys: string[];
}

export const CATALOGUE_CATEGORIES_META: CategoryMetadata[] = [
  { id: 'cpu', name: 'CPU / Processors', shortLabel: 'CPUs', iconName: 'Cpu', description: 'Desktop processors from AMD Ryzen & Intel Core families', typicalFilterKeys: ['brand', 'seriesGeneration', 'socket', 'cores'] },
  { id: 'gpu', name: 'GPU / Graphics Cards', shortLabel: 'GPUs', iconName: 'MonitorPlay', description: 'NVIDIA RTX 50/40 & AMD Radeon RX 9000/7000 cards', typicalFilterKeys: ['manufacturer', 'vram', 'boardPartner', 'features'] },
  { id: 'motherboard', name: 'Motherboards / Mainboards', shortLabel: 'Motherboards', iconName: 'CircuitBoard', description: 'AM5, LGA1851, LGA1700 & AM4 motherboards across ATX/mATX/ITX', typicalFilterKeys: ['socket', 'chipset', 'formFactor', 'ramGeneration'] },
  { id: 'ram', name: 'RAM / Desktop Memory', shortLabel: 'RAM', iconName: 'MemoryStick', description: 'High-speed DDR5 & DDR4 desktop memory kits', typicalFilterKeys: ['ddrGeneration', 'capacity', 'speed', 'rgb'] },
  { id: 'nvme_ssd', name: 'NVMe M.2 Solid State Drives', shortLabel: 'NVMe SSDs', iconName: 'HardDriveDownload', description: 'Ultra-fast PCIe Gen5, Gen4 & Gen3 M.2 NVMe SSDs', typicalFilterKeys: ['interface', 'capacity', 'heatsinkIncluded'] },
  { id: 'sata_ssd', name: 'SATA 2.5" SSDs', shortLabel: 'SATA SSDs', iconName: 'Layers', description: 'Reliable 2.5-inch SATA storage for upgrades & bulk gaming storage', typicalFilterKeys: ['capacity', 'formFactor'] },
  { id: 'hdd', name: 'Hard Disk Drives (HDD)', shortLabel: 'HDDs', iconName: 'HardDrive', description: 'High-capacity mechanical 3.5" desktop & 24/7 NAS hard drives', typicalFilterKeys: ['family', 'capacity', 'rpm', 'recordingTechnology'] },
  { id: 'psu', name: 'Power Supplies (PSU)', shortLabel: 'Power Supplies', iconName: 'Zap', description: 'ATX 3.0 & 3.1 power supplies with PCIe 5.0 12V-2x6 cables', typicalFilterKeys: ['wattage', 'efficiency', 'modularity', 'pcieGen5Connector'] },
  { id: 'case', name: 'PC Cabinets & Cases', shortLabel: 'Cases', iconName: 'Box', description: 'Dual-chamber showcases, airflow mid-towers & SFF cabinets', typicalFilterKeys: ['caseType', 'sidePanel', 'radiatorSupport'] },
  { id: 'air_cooler', name: 'CPU Air Coolers', shortLabel: 'Air Coolers', iconName: 'Wind', description: 'High-performance single & dual-tower CPU air heatsinks', typicalFilterKeys: ['coolerType', 'coolerHeight', 'socket'] },
  { id: 'aio_cooler', name: 'AIO Liquid Coolers', shortLabel: 'AIO Coolers', iconName: 'Droplets', description: 'All-in-one liquid radiators from 240mm to 420mm with LCD & ARGB', typicalFilterKeys: ['radiatorSize', 'displayType'] },
  { id: 'case_fans', name: 'Case & Radiator Fans', shortLabel: 'Case Fans', iconName: 'Fan', description: '120mm & 140mm high static-pressure PWM and ARGB daisy-chain fans', typicalFilterKeys: ['fanSize', 'packQuantity', 'rgbType'] },
  { id: 'thermal_paste', name: 'Thermal Paste & Compounds', shortLabel: 'Thermal Paste', iconName: 'Thermometer', description: 'High thermal conductivity greases & compounds for CPU/GPU cooling', typicalFilterKeys: ['quantityGrams', 'pasteType'] },
  { id: 'monitor', name: 'Gaming Monitors & Displays', shortLabel: 'Monitors', iconName: 'Tv', description: 'Fast IPS, OLED, QHD & Ultrawide esports & creator gaming displays', typicalFilterKeys: ['screenSize', 'resolution', 'panelType', 'refreshRate'] },
  { id: 'keyboard', name: 'Gaming Keyboards', shortLabel: 'Keyboards', iconName: 'Keyboard', description: 'Mechanical, Hall-effect magnetic & optical gaming keyboards', typicalFilterKeys: ['layout', 'switchType', 'connectivity', 'hotSwappable'] },
  { id: 'mouse', name: 'Gaming Mice', shortLabel: 'Mice', iconName: 'Mouse', description: 'Ultralight, high-polling rate optical wireless & wired gaming mice', typicalFilterKeys: ['mouseType', 'connectivity', 'weightGrams'] },
];
