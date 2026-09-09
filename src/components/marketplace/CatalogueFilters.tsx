import React from 'react';
import { 
  RotateCcw, 
  SlidersHorizontal,
  X,
  Sparkles,
  Cpu,
  Tv,
  CircuitBoard,
  Layers,
  HardDriveDownload,
  Layers3,
  HardDrive,
  Zap,
  Box,
  Wind,
  Droplets,
  Fan,
  Thermometer,
  Keyboard,
  Mouse
} from 'lucide-react';
import { ComponentCategory } from '../../types/hardware';
import { CATALOGUE_CATEGORIES_META } from '../../types/catalogue';
import { formatINR } from '../../utils/formatCurrency';

export interface FilterState {
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
  selectedBrands: string[];
  attributes: Record<string, string[]>;
}

interface CatalogueFiltersProps {
  category: ComponentCategory | 'all';
  onSelectCategory: (cat: ComponentCategory | 'all') => void;
  categoryCounts: Record<string, number>;
  filterState: FilterState;
  onFilterChange: (newState: FilterState) => void;
  availableBrands: { brand: string; count: number }[];
  priceBounds: { min: number; max: number };
  onReset: () => void;
  isMobileDrawer?: boolean;
  onCloseMobileDrawer?: () => void;
}

// Category Icon helper
const getCategoryIcon = (catId: string) => {
  switch (catId) {
    case 'all': return <Sparkles className="w-3.5 h-3.5" />;
    case 'cpu': return <Cpu className="w-3.5 h-3.5" />;
    case 'gpu': return <Tv className="w-3.5 h-3.5" />;
    case 'motherboard': return <CircuitBoard className="w-3.5 h-3.5" />;
    case 'ram': return <Layers className="w-3.5 h-3.5" />;
    case 'nvme_ssd': return <HardDriveDownload className="w-3.5 h-3.5" />;
    case 'sata_ssd': return <Layers3 className="w-3.5 h-3.5" />;
    case 'hdd': return <HardDrive className="w-3.5 h-3.5" />;
    case 'psu': return <Zap className="w-3.5 h-3.5" />;
    case 'case': return <Box className="w-3.5 h-3.5" />;
    case 'air_cooler': return <Wind className="w-3.5 h-3.5" />;
    case 'aio_cooler': return <Droplets className="w-3.5 h-3.5" />;
    case 'case_fans': return <Fan className="w-3.5 h-3.5" />;
    case 'thermal_paste': return <Thermometer className="w-3.5 h-3.5" />;
    case 'monitor': return <Tv className="w-3.5 h-3.5" />;
    case 'keyboard': return <Keyboard className="w-3.5 h-3.5" />;
    case 'mouse': return <Mouse className="w-3.5 h-3.5" />;
    default: return <Sparkles className="w-3.5 h-3.5" />;
  }
};

// Category-specific attribute options definition
const CATEGORY_ATTRIBUTE_CONFIG: Record<
  string, 
  { key: string; title: string; options: string[] }[]
> = {
  cpu: [
    { key: 'socket', title: 'Socket Architecture', options: ['AM5', 'AM4', 'LGA1851', 'LGA1700', 'LGA1200'] },
    { key: 'seriesGeneration', title: 'Processor Series', options: ['Ryzen 9000 Series', 'Ryzen 8000 Series', 'Ryzen 7000 Series', 'Ryzen 5000 Series', 'Core Ultra 200S', '14th Gen Core', '13th Gen Core', '12th Gen Core'] },
    { key: 'cores', title: 'Core Count', options: ['6 Cores', '8 Cores', '14+ Cores', '24 Cores'] },
    { key: 'integratedGraphics', title: 'Integrated GPU', options: ['Included', 'Requires Discrete GPU (F-Series)'] },
  ],
  gpu: [
    { key: 'manufacturer', title: 'GPU Chipset Maker', options: ['NVIDIA GeForce', 'AMD Radeon'] },
    { key: 'vramCapacity', title: 'Video Memory (VRAM)', options: ['8GB', '12GB', '16GB', '24GB', '32GB'] },
    { key: 'boardPartner', title: 'Board Partner', options: ['ASUS', 'MSI', 'Gigabyte', 'Sapphire', 'ZOTAC', 'Colorful'] },
    { key: 'generation', title: 'GPU Series', options: ['RTX 50', 'RTX 40', 'RTX 30', 'RX 9000', 'RX 7000', 'RX 6000'] },
  ],
  motherboard: [
    { key: 'socket', title: 'CPU Socket', options: ['AM5', 'AM4', 'LGA1851', 'LGA1700', 'LGA1200'] },
    { key: 'chipset', title: 'Chipset Series', options: ['AMD X870', 'AMD B650', 'Intel Z890', 'Intel B860', 'Intel Z790', 'Intel B760', 'AMD B550'] },
    { key: 'formFactor', title: 'Form Factor', options: ['ATX', 'Micro-ATX', 'Mini-ITX', 'E-ATX'] },
    { key: 'ramGenerationSupported', title: 'Memory Type', options: ['DDR5', 'DDR4'] },
    { key: 'wifiGeneration', title: 'Wi-Fi Technology', options: ['Wi-Fi 7', 'Wi-Fi 6E', 'Wi-Fi 6', 'No Wi-Fi'] },
  ],
  ram: [
    { key: 'ramType', title: 'Memory Generation', options: ['DDR5', 'DDR4'] },
    { key: 'capacity', title: 'Kit Capacity', options: ['16GB', '32GB (2x16GB)', '64GB (2x32GB)'] },
    { key: 'speed', title: 'Speed Frequency', options: ['DDR5-6000', 'DDR5-5600', 'DDR5-7000+', 'DDR4-3600', 'DDR4-3200'] },
    { key: 'rgb', title: 'Aesthetic / RGB', options: ['Addressable RGB', 'Stealth Non-RGB'] },
  ],
  nvme_ssd: [
    { key: 'interface', title: 'PCIe Generation', options: ['PCIe 5.0 (Gen5)', 'PCIe 4.0 (Gen4)', 'PCIe 3.0 (Gen3)'] },
    { key: 'capacity', title: 'Storage Capacity', options: ['1TB', '2TB', '4TB', '8TB'] },
    { key: 'heatsink', title: 'Heatsink Configuration', options: ['Heatsink Included', 'Standard Bare M.2'] },
  ],
  sata_ssd: [
    { key: 'capacity', title: 'Capacity', options: ['250GB', '500GB', '1TB', '2TB', '4TB'] },
    { key: 'formFactor', title: 'Form Factor', options: ['2.5-inch 7mm'] },
  ],
  hdd: [
    { key: 'capacity', title: 'Drive Capacity', options: ['2TB', '4TB', '8TB', '16TB'] },
    { key: 'speed', title: 'Rotational Speed', options: ['7200 RPM', '5400 RPM'] },
    { key: 'type', title: 'Usage Profile', options: ['Desktop Everyday', 'NAS / 24x7 Rated'] },
  ],
  psu: [
    { key: 'wattage', title: 'Continuous Wattage', options: ['550W–650W', '750W–850W', '1000W+'] },
    { key: 'efficiency', title: '80 PLUS Efficiency', options: ['80+ Gold', '80+ Platinum', '80+ Titanium', '80+ Bronze'] },
    { key: 'modularity', title: 'Modularity', options: ['Fully Modular', 'Semi-Modular'] },
    { key: 'pcieGen5', title: 'ATX 3.0 / PCIe 5.0', options: ['Native 12V-2x6 Cable Included', 'Standard PCIe 8-pin'] },
  ],
  case: [
    { key: 'type', title: 'Chassis Architecture', options: ['Dual-Chamber Showcase', 'High Airflow Mid-Tower', 'Full Tower Workstation', 'Compact Mini-ITX'] },
    { key: 'radiatorSupport', title: 'Radiator Capacity', options: ['Up to 360mm', 'Up to 420mm', 'Up to 240mm'] },
  ],
  air_cooler: [
    { key: 'type', title: 'Tower Configuration', options: ['Dual Tower Heatsink', 'Single Tower Heatsink', 'Low Profile SFF'] },
    { key: 'socket', title: 'Platform Compatibility', options: ['AM5 Compatible', 'LGA1851 / LGA1700 Compatible'] },
  ],
  aio_cooler: [
    { key: 'radiatorSize', title: 'Radiator Dimensions', options: ['240mm', '280mm', '360mm', '420mm'] },
    { key: 'display', title: 'Pump Cap Feature', options: ['IPS / LCD Screen', 'Addressable RGB Mirror', 'Stealth Clean'] },
  ],
  case_fans: [
    { key: 'size', title: 'Fan Diameter', options: ['120mm Fans', '140mm Fans'] },
    { key: 'pack', title: 'Packaging Configuration', options: ['Single Fan Pack', '3-Fan Value Pack', '5-Pack'] },
  ],
  thermal_paste: [
    { key: 'quantity', title: 'Net Syringe Weight', options: ['1g - 2g', '3g - 4g Standard', '8g Builder Pack'] },
    { key: 'conductive', title: 'Compound Type', options: ['Non-Conductive Carbon/Ceramic', 'Liquid Metal'] },
  ],
  monitor: [
    { key: 'screenSize', title: 'Screen Size', options: ['24" - 25"', '27" Esports Standard', '32" Immersive', '34"+ Ultrawide'] },
    { key: 'resolution', title: 'Display Resolution', options: ['1080p Full HD', '1440p Quad HD (2K)', '4K UHD'] },
    { key: 'panelType', title: 'Panel Technology', options: ['Fast IPS', 'OLED / QD-OLED', 'VA Curved'] },
    { key: 'refreshRate', title: 'Refresh Rate', options: ['144Hz - 180Hz', '240Hz Competitive', '360Hz+ Apex Esports'] },
  ],
  keyboard: [
    { key: 'layout', title: 'Form Factor Layout', options: ['Full-size (100%)', 'TKL (80%)', '75% Compact', '65% / 60% SFF'] },
    { key: 'switchType', title: 'Switch Mechanism', options: ['Mechanical Linear (Smooth)', 'Mechanical Tactile', 'Hall-Effect Magnetic (Rapid Trigger)', 'Optical Switches'] },
    { key: 'connectivity', title: 'Connection Interface', options: ['Wired USB-C', 'Tri-Mode Wireless (2.4GHz + BT + Wired)'] },
  ],
  mouse: [
    { key: 'mouseType', title: 'Ergonomic Profile', options: ['Ultralight Esports (<60g)', 'Ergonomic Palm Grip', 'Symmetrical Ambidextrous'] },
    { key: 'connectivity', title: 'Wireless / Wired', options: ['2.4GHz High-Speed Wireless', 'Tri-Mode Wireless', 'Wired Ultra-Flexible'] },
    { key: 'pollingRate', title: 'Polling Rate', options: ['1000Hz Standard', '4000Hz / 8000Hz Hyper-Polling'] },
  ],
};

export const CatalogueFilters: React.FC<CatalogueFiltersProps> = ({
  category,
  onSelectCategory,
  categoryCounts,
  filterState,
  onFilterChange,
  availableBrands,
  priceBounds,
  onReset,
  isMobileDrawer = false,
  onCloseMobileDrawer,
}) => {
  // Brand toggle handler
  const handleToggleBrand = (brand: string) => {
    const isSelected = filterState.selectedBrands.includes(brand);
    const updatedBrands = isSelected
      ? filterState.selectedBrands.filter((b) => b !== brand)
      : [...filterState.selectedBrands, brand];

    onFilterChange({
      ...filterState,
      selectedBrands: updatedBrands,
    });
  };

  // Attribute toggle handler
  const handleToggleAttribute = (attrKey: string, optionValue: string) => {
    const currentValues = filterState.attributes[attrKey] || [];
    const isSelected = currentValues.includes(optionValue);
    const updatedValues = isSelected
      ? currentValues.filter((v) => v !== optionValue)
      : [...currentValues, optionValue];

    onFilterChange({
      ...filterState,
      attributes: {
        ...filterState.attributes,
        [attrKey]: updatedValues,
      },
    });
  };

  // Price range slider change
  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Number(e.target.value);
    onFilterChange({
      ...filterState,
      maxPrice: newMax,
    });
  };

  // In-stock toggle
  const handleToggleInStock = () => {
    onFilterChange({
      ...filterState,
      inStockOnly: !filterState.inStockOnly,
    });
  };

  const dynamicAttributes = category !== 'all' ? (CATEGORY_ATTRIBUTE_CONFIG[category] || []) : [];

  const activeFiltersCount = 
    (filterState.inStockOnly ? 1 : 0) +
    filterState.selectedBrands.length +
    (filterState.maxPrice < priceBounds.max ? 1 : 0) +
    Object.values(filterState.attributes).reduce((acc, curr) => acc + curr.length, 0);

  const filterContent = (
    <div className="space-y-6">
      {/* 1. Category Navigation (All 16 Categories) */}
      <div className="space-y-1 pb-5 border-b border-[#1e2d4f]">
        <div className="flex items-center justify-between mb-2.5 px-1">
          <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Hardware Categories (16)
          </span>
          {activeFiltersCount > 0 && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 text-[11px] font-mono text-[#ff1e2d] hover:text-red-400 transition-colors font-semibold"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Filters
            </button>
          )}
        </div>

        {/* All Hardware Components Button */}
        <button
          onClick={() => {
            onSelectCategory('all');
            if (isMobileDrawer && onCloseMobileDrawer) onCloseMobileDrawer();
          }}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
            category === 'all'
              ? 'bg-[#ff1e2d] text-white shadow-glow-red font-bold'
              : 'text-slate-300 hover:text-white hover:bg-[#142244]'
          }`}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>All Gear</span>
          </div>
          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
            category === 'all' ? 'bg-black/30 text-white' : 'bg-[#101b34] text-slate-400'
          }`}>
            {categoryCounts['all'] || 0}
          </span>
        </button>

        {/* 16 Individual Hardware Categories */}
        <div className="space-y-0.5 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
          {CATALOGUE_CATEGORIES_META.map((cat) => {
            const isSelected = category === cat.id;
            const count = categoryCounts[cat.id] || 0;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  if (isMobileDrawer && onCloseMobileDrawer) onCloseMobileDrawer();
                }}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-[#ff1e2d] text-white shadow-glow-red font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-[#142244]'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {getCategoryIcon(cat.id)}
                  <span className="truncate">{cat.name.split('/')[0].trim()}</span>
                </div>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                  isSelected ? 'bg-black/30 text-white' : 'bg-[#101b34] text-slate-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Refinements Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#1e2d4f]">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#ff1e2d]" />
          <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            REFINE RESULTS {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </span>
        </div>
      </div>

      {/* 3. In Stock Toggle */}
      <div className="space-y-2">
        <label className="flex items-center justify-between p-3 rounded-xl bg-[#0b1324] border border-[#1e2d4f] cursor-pointer hover:border-slate-500 transition-colors">
          <span className="text-xs font-semibold text-slate-200">In Stock Only</span>
          <input
            type="checkbox"
            checked={filterState.inStockOnly}
            onChange={handleToggleInStock}
            className="w-4 h-4 rounded bg-[#0d172e] border-[#1e2d4f] text-[#ff1e2d] focus:ring-0 focus:ring-offset-0 cursor-pointer"
          />
        </label>
      </div>

      {/* 4. Price Range Slider */}
      <div className="space-y-3 p-3.5 rounded-xl bg-[#0b1324] border border-[#1e2d4f]">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400 uppercase">Max Budget</span>
          <span className="font-bold text-white">{formatINR(filterState.maxPrice)}</span>
        </div>
        
        <input
          type="range"
          min={priceBounds.min}
          max={priceBounds.max}
          step={1000}
          value={filterState.maxPrice}
          onChange={handleMaxPriceChange}
          className="w-full accent-[#ff1e2d] cursor-pointer h-1.5 bg-[#142244] rounded-lg"
        />

        <div className="flex justify-between text-[10px] font-mono text-slate-400">
          <span>Min: {formatINR(priceBounds.min)}</span>
          <span>Max: {formatINR(priceBounds.max)}</span>
        </div>
      </div>

      {/* 5. Brand Checkboxes */}
      {availableBrands.length > 0 && (
        <div className="space-y-2.5 p-3.5 rounded-xl bg-[#0b1324] border border-[#1e2d4f]">
          <span className="text-xs font-bold text-white uppercase tracking-wider font-mono block mb-2">
            Brands & Manufacturers
          </span>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
            {availableBrands.map(({ brand, count }) => {
              const isChecked = filterState.selectedBrands.includes(brand);
              return (
                <label
                  key={brand}
                  className="flex items-center justify-between text-xs text-slate-300 hover:text-white cursor-pointer py-1 select-none"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleBrand(brand)}
                      className="w-3.5 h-3.5 rounded bg-[#0d172e] border-[#1e2d4f] text-[#ff1e2d] focus:ring-0 cursor-pointer"
                    />
                    <span>{brand}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">({count})</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. Dynamic Category Specific Filters */}
      {dynamicAttributes.map((attr) => {
        const selectedForAttr = filterState.attributes[attr.key] || [];

        return (
          <div key={attr.key} className="space-y-2.5 p-3.5 rounded-xl bg-[#0b1324] border border-[#1e2d4f]">
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono block mb-2">
              {attr.title}
            </span>
            <div className="space-y-1.5">
              {attr.options.map((option) => {
                const isChecked = selectedForAttr.includes(option);
                return (
                  <label
                    key={option}
                    className="flex items-center gap-2 text-xs text-slate-300 hover:text-white cursor-pointer py-1 select-none"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleAttribute(attr.key, option)}
                      className="w-3.5 h-3.5 rounded bg-[#0d172e] border-[#1e2d4f] text-[#ff1e2d] focus:ring-0 cursor-pointer"
                    />
                    <span>{option}</span>
                  </label>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );

  // If rendering inside mobile drawer
  if (isMobileDrawer) {
    return (
      <div 
        className="fixed inset-0 z-50 flex bg-black/80 backdrop-blur-sm animate-fadeIn"
        onClick={onCloseMobileDrawer}
      >
        <div 
          className="w-full max-w-xs h-full bg-[#080f1e] border-r border-[#1e2d4f] p-5 overflow-y-auto flex flex-col justify-between"
          onClick={(e) => e.stopPropagation()}
        >
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#1e2d4f] mb-4">
              <div className="flex items-center gap-2 font-bold text-white font-mono uppercase">
                <SlidersHorizontal className="w-4 h-4 text-[#ff1e2d]" />
                <span>Navigation & Filters</span>
              </div>
              <button
                onClick={onCloseMobileDrawer}
                className="p-1.5 rounded-lg bg-[#142244] text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {filterContent}
          </div>

          <div className="pt-6 mt-6 border-t border-[#1e2d4f]">
            <button
              onClick={onCloseMobileDrawer}
              className="w-full py-2.5 rounded-xl bg-[#ff1e2d] text-white font-bold text-xs shadow-glow-red"
            >
              Apply & Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <aside className="w-72 flex-shrink-0 hidden lg:block">
      <div className="sticky top-24 rounded-2xl bg-[#070d1a]/95 border border-[#1e2d4f] p-4 shadow-xl">
        {filterContent}
      </div>
    </aside>
  );
};
