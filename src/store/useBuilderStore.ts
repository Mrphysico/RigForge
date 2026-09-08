import { create } from 'zustand';
import { ComponentCategory, Product, CompatibilityIssue } from '../types/hardware';
import { MOCK_PRODUCTS } from '../data/mockHardware';

interface BuilderState {
  slots: Record<ComponentCategory, Product | null>;
  activePickerCategory: ComponentCategory | null;
  setSlot: (category: ComponentCategory, product: Product) => void;
  removeSlot: (category: ComponentCategory) => void;
  clearBuild: () => void;
  setActivePickerCategory: (category: ComponentCategory | null) => void;
  loadPresetBuild: (preset: 'enthusiast' | 'sweetspot') => void;
  getEstimatedWattage: () => number;
  getRecommendedPsuWattage: () => number;
  getTotalPrice: () => number;
  getSelectedCount: () => number;
  getCompatibilityIssues: () => CompatibilityIssue[];
}

const initialSlots: Record<ComponentCategory, Product | null> = {
  cpu: null,
  cooler: null,
  motherboard: null,
  ram: null,
  storage: null,
  gpu: null,
  case: null,
  psu: null,
};

export const useBuilderStore = create<BuilderState>((set, get) => ({
  slots: initialSlots,
  activePickerCategory: null,

  setSlot: (category, product) => {
    // Only allow in-stock parts
    if (!product.inStock) return;

    set((state) => ({
      slots: { ...state.slots, [category]: product },
      activePickerCategory: null,
    }));
  },

  removeSlot: (category) => {
    set((state) => ({
      slots: { ...state.slots, [category]: null },
    }));
  },

  clearBuild: () => {
    set({ slots: initialSlots });
  },

  setActivePickerCategory: (category) => {
    set({ activePickerCategory: category });
  },

  loadPresetBuild: (preset) => {
    if (preset === 'enthusiast') {
      // 1440p / 4K Esports King (Ryzen 7 7800X3D + RTX 4070 Super) - ~₹1.6 Lakh
      const cpu = MOCK_PRODUCTS.find((p) => p.id === 'cpu-r7-7800x3d') || null;
      const cooler = MOCK_PRODUCTS.find((p) => p.id === 'cooler-deepcool-ak620') || null;
      const mobo = MOCK_PRODUCTS.find((p) => p.id === 'mobo-gigabyte-b650-aorus-elite') || null;
      const ram = MOCK_PRODUCTS.find((p) => p.id === 'ram-gskill-trident-z5-neo') || null;
      const storage = MOCK_PRODUCTS.find((p) => p.id === 'ssd-wd-black-sn850x-2tb') || null;
      const gpu = MOCK_PRODUCTS.find((p) => p.id === 'gpu-rtx-4070-super') || null;
      const chasis = MOCK_PRODUCTS.find((p) => p.id === 'case-lianli-216') || null;
      const psu = MOCK_PRODUCTS.find((p) => p.id === 'psu-corsair-rm850e') || null;

      set({
        slots: {
          cpu,
          cooler,
          motherboard: mobo,
          ram,
          storage,
          gpu,
          case: chasis,
          psu,
        },
      });
    } else {
      // 1080p Value Champion (Ryzen 5 5600 + RX 6600) - ~₹53,000
      const cpu = MOCK_PRODUCTS.find((p) => p.id === 'cpu-r5-5600') || null;
      const cooler = MOCK_PRODUCTS.find((p) => p.id === 'cooler-deepcool-ag400') || null;
      const mobo = MOCK_PRODUCTS.find((p) => p.id === 'mobo-msi-b550m-vdh') || null;
      const ram = MOCK_PRODUCTS.find((p) => p.id === 'ram-kingston-fury-16gb') || null;
      const storage = MOCK_PRODUCTS.find((p) => p.id === 'ssd-wd-blue-sn580-1tb') || null;
      const gpu = MOCK_PRODUCTS.find((p) => p.id === 'gpu-rx-6600') || null;
      const chasis = MOCK_PRODUCTS.find((p) => p.id === 'case-ant-ice-100') || null;
      const psu = MOCK_PRODUCTS.find((p) => p.id === 'psu-cm-mwe-550') || null;

      set({
        slots: {
          cpu,
          cooler,
          motherboard: mobo,
          ram,
          storage,
          gpu,
          case: chasis,
          psu,
        },
      });
    }
  },

  getEstimatedWattage: () => {
    const { slots } = get();
    let total = 0;
    let hasComponents = false;

    if (slots.cpu) {
      total += slots.cpu.specs.tdp || 65;
      hasComponents = true;
    }
    if (slots.gpu) {
      total += slots.gpu.specs.tdp || 200;
      hasComponents = true;
    }
    if (slots.cooler) {
      total += slots.cooler.specs.tdp || 20;
      hasComponents = true;
    }
    if (slots.motherboard) {
      total += slots.motherboard.specs.tdp || 45;
      hasComponents = true;
    }
    if (slots.ram) {
      total += slots.ram.specs.tdp || 15;
      hasComponents = true;
    }
    if (slots.storage) {
      total += slots.storage.specs.tdp || 10;
      hasComponents = true;
    }

    if (hasComponents) {
      // Add background system headroom (fans, RGB controller, USB peripherals)
      total += 35;
    }

    return total;
  },

  getRecommendedPsuWattage: () => {
    const estimated = get().getEstimatedWattage();
    if (estimated === 0) return 0;
    // Standard rule: 35% safe overhead for GPU transient spikes
    const withMargin = estimated * 1.35;
    const rounded = Math.ceil(withMargin / 50) * 50;
    return Math.max(rounded, 550);
  },

  getTotalPrice: () => {
    const { slots } = get();
    return Object.values(slots).reduce((sum, item) => {
      return sum + (item ? item.price : 0);
    }, 0);
  },

  getSelectedCount: () => {
    const { slots } = get();
    return Object.values(slots).filter(Boolean).length;
  },

  getCompatibilityIssues: () => {
    const { slots } = get();
    const issues: CompatibilityIssue[] = [];

    // 1. CPU vs Motherboard Socket Compatibility
    if (slots.cpu && slots.motherboard) {
      const cpuSocket = slots.cpu.specs.socket;
      const moboSocket = slots.motherboard.specs.socket;

      if (cpuSocket && moboSocket && cpuSocket !== moboSocket) {
        issues.push({
          severity: 'error',
          title: 'Socket Mismatch',
          message: `${slots.cpu.name} requires socket ${cpuSocket}, but ${slots.motherboard.name} has socket ${moboSocket}. These components are physically incompatible.`,
          slots: ['cpu', 'motherboard'],
        });
      }
    }

    // 2. RAM vs Motherboard Memory Standard Compatibility
    if (slots.ram && slots.motherboard) {
      const ramType = slots.ram.specs.ramType;
      const moboRamType = slots.motherboard.specs.supportedRamType;

      if (ramType && moboRamType && ramType !== moboRamType) {
        issues.push({
          severity: 'error',
          title: 'Memory Standard Mismatch',
          message: `${slots.ram.name} is ${ramType}, but ${slots.motherboard.name} only supports ${moboRamType}.`,
          slots: ['ram', 'motherboard'],
        });
      }
    }

    // 3. PSU Wattage Adequacy Check
    if (slots.psu) {
      const estimated = get().getEstimatedWattage();
      const psuWattage = slots.psu.specs.wattage || 0;

      if (psuWattage < estimated) {
        issues.push({
          severity: 'error',
          title: 'Insufficient Power Supply',
          message: `The selected ${psuWattage}W PSU is lower than the estimated system draw of ${estimated}W. Your system may shut down under heavy gaming loads.`,
          slots: ['psu'],
        });
      } else if (psuWattage < get().getRecommendedPsuWattage()) {
        issues.push({
          severity: 'warning',
          title: 'Low Power Headroom',
          message: `The selected ${psuWattage}W PSU provides less than the recommended 35% headroom for modern GPU transient spikes. We recommend at least ${get().getRecommendedPsuWattage()}W.`,
          slots: ['psu'],
        });
      }
    }

    return issues;
  },
}));
