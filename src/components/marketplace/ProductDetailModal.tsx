import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShoppingCart, 
  Wrench, 
  Star, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  Cpu, 
  CircuitBoard, 
  Layers, 
  HardDrive, 
  Zap, 
  Box, 
  Wind, 
  Droplets, 
  Fan, 
  Thermometer, 
  Tv, 
  Keyboard, 
  Mouse,
  CheckCircle2,
  Clock,
  Layers3,
  BadgePercent,
  Gauge
} from 'lucide-react';
import { CatalogueRecord } from '../../data/catalogue/catalogueData';
import { ComponentCategory } from '../../types/hardware';
import { formatINR } from '../../utils/formatCurrency';
import { useCartStore } from '../../store/useCartStore';
import { useBuilderStore } from '../../store/useBuilderStore';

interface ProductDetailModalProps {
  product: CatalogueRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onNotification?: (msg: string) => void;
}

const mapCategoryToBuilderSlot = (cat: ComponentCategory): ComponentCategory => {
  switch (cat) {
    case 'cpu': return 'cpu';
    case 'gpu': return 'gpu';
    case 'motherboard': return 'motherboard';
    case 'ram': return 'ram';
    case 'nvme_ssd':
    case 'sata_ssd':
    case 'hdd': return 'storage';
    case 'psu': return 'psu';
    case 'case': return 'case';
    case 'air_cooler':
    case 'aio_cooler': return 'cooler';
    default: return 'peripherals';
  }
};

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onNotification,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'performance' | 'compatibility' | 'pricing'>('overview');
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  const setSlot = useBuilderStore((state) => state.setSlot);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen || !product) return null;

  const details = product.catalogueDetails || ({} as any);
  const builderSlot = mapCategoryToBuilderSlot(product.category);
  const currentSlotProduct = useBuilderStore.getState().slots[builderSlot];
  const isCurrentBuildSelection = currentSlotProduct?.id === product.id;

  const stockStatus = product.stockStatus || details.stockStatus || (product.inStock ? 'In Stock' : 'Out of Stock');
  const isOutOfStock = stockStatus === 'Out of Stock' || !product.inStock;
  const isPlaceholder = product.placeholder ?? false;

  const discountPercent = product.mrp && product.price && product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  const handleAddToCart = () => {
    if (isOutOfStock || product.price === null) return;
    addItem(product, 1);
    openCart();
    if (onNotification) {
      onNotification(`Added "${product.name}" to cart.`);
    }
  };

  const handleAddToBuild = () => {
    if (isOutOfStock) return;
    setSlot(builderSlot, product);
    if (onNotification) {
      onNotification(`Assigned "${product.name}" to [${builderSlot.toUpperCase()}] slot in PC Builder!`);
    }
  };

  // Helper to render value or "Not specified"
  const val = (v: any) => {
    if (v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0)) {
      return <span className="text-slate-500 italic">Not specified</span>;
    }
    if (typeof v === 'boolean') {
      return v ? 'Yes' : 'No';
    }
    if (Array.isArray(v)) {
      return v.join(', ');
    }
    return String(v);
  };

  // Category Icon helper
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cpu': return <Cpu className="w-4 h-4" />;
      case 'gpu': return <Tv className="w-4 h-4" />;
      case 'motherboard': return <CircuitBoard className="w-4 h-4" />;
      case 'ram': return <Layers className="w-4 h-4" />;
      case 'nvme_ssd':
      case 'sata_ssd':
      case 'hdd': return <HardDrive className="w-4 h-4" />;
      case 'psu': return <Zap className="w-4 h-4" />;
      case 'case': return <Box className="w-4 h-4" />;
      case 'air_cooler': return <Wind className="w-4 h-4" />;
      case 'aio_cooler': return <Droplets className="w-4 h-4" />;
      case 'case_fans': return <Fan className="w-4 h-4" />;
      case 'thermal_paste': return <Thermometer className="w-4 h-4" />;
      case 'monitor': return <Tv className="w-4 h-4" />;
      case 'keyboard': return <Keyboard className="w-4 h-4" />;
      case 'mouse': return <Mouse className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  // Overview Tab
  const renderOverviewTab = () => (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-[#081120] border border-[#162744] space-y-3">
        <h4 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#ff1e2d]" />
          <span>Product Overview & Summary</span>
        </h4>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {product.description || 'Verified PC hardware component conforming to official manufacturer specifications.'}
        </p>
      </div>

      <div className="p-4 rounded-xl bg-[#081120] border border-[#162744]">
        <h4 className="text-xs font-bold text-slate-400 uppercase font-mono tracking-wider mb-3">
          Key Highlight Specifications
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {(product.keySpecsSummary || details.keySpecs || []).map((spec: string, i: number) => (
            <div key={i} className="flex items-center gap-2 text-xs text-slate-200 font-mono p-2 rounded-lg bg-[#0b1428] border border-[#182846]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e2d] flex-shrink-0" />
              <span>{spec}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-[#081120] border border-[#162744]">
          <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">Brand</span>
          <span className="text-xs font-bold text-white font-mono">{product.brand}</span>
        </div>
        <div className="p-3 rounded-xl bg-[#081120] border border-[#162744]">
          <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">Manufacturer</span>
          <span className="text-xs font-bold text-white font-mono">{details.manufacturer || product.brand}</span>
        </div>
        <div className="p-3 rounded-xl bg-[#081120] border border-[#162744]">
          <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">Catalogue Status</span>
          <span className="text-xs font-bold text-emerald-400 font-mono">
            {isPlaceholder ? 'Catalogue Reference' : 'Verified Specification'}
          </span>
        </div>
        <div className="p-3 rounded-xl bg-[#081120] border border-[#162744]">
          <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">Warranty</span>
          <span className="text-xs font-bold text-[#FCA311] font-mono">{product.warranty || 'Domestic Warranty'}</span>
        </div>
      </div>
    </div>
  );

  // Technical Specifications Tab
  const renderSpecsTab = () => {
    const d = details as any;
    const items: { label: string; value: any }[] = [];

    switch (details.category) {
      case 'cpu':
        items.push(
          { label: 'Product ID', value: d.productId || product.id },
          { label: 'Brand', value: product.brand },
          { label: 'Manufacturer', value: d.manufacturer },
          { label: 'Product Name', value: product.name },
          { label: 'Series / Generation', value: d.seriesGeneration },
          { label: 'Microarchitecture', value: d.architecture },
          { label: 'Launch Date', value: d.launchDate },
          { label: 'Boxed / Tray', value: d.boxedOrTray },
          { label: 'Unlocked / Overclocking', value: d.unlocked },
          { label: 'Cores', value: d.cores },
          { label: 'Threads', value: d.threads },
          { label: 'Base Clock', value: d.baseClock },
          { label: 'Boost Clock', value: d.boostClock },
          { label: 'L1/L2/L3 Cache', value: d.cache },
          { label: 'TDP / Power', value: d.tdp ? `${d.tdp} Watts` : undefined },
          { label: 'Socket', value: d.socket },
          { label: 'Motherboard Chipset Support', value: d.chipsetSupport },
          { label: 'RAM Type', value: d.ramType },
          { label: 'Maximum Memory', value: d.maxMemory },
          { label: 'Memory Channels', value: d.memoryChannels },
          { label: 'PCIe Version / Lanes', value: d.pcieVersion },
          { label: 'Integrated Graphics', value: d.integratedGraphics },
          { label: 'NPU (if present)', value: d.npu },
          { label: 'Cooler Included', value: d.coolerIncluded },
          { label: 'Cooler Recommendation', value: d.coolerRecommendation },
          { label: 'OS / Platform Notes', value: d.platformNotes }
        );
        break;

      case 'gpu':
        items.push(
          { label: 'Product ID', value: d.productId || product.id },
          { label: 'Manufacturer', value: d.manufacturer },
          { label: 'Board Partner', value: d.boardPartner },
          { label: 'Model', value: d.model },
          { label: 'GPU Family', value: d.gpuFamily },
          { label: 'Generation', value: d.generation },
          { label: 'Architecture', value: d.architecture },
          { label: 'Launch Date', value: d.launchDate },
          { label: 'CUDA Cores / Stream Processors', value: d.cudaOrStreamProcessors?.toLocaleString() },
          { label: 'RT Cores / Ray Accelerators', value: d.rtCoresOrRayAccelerators },
          { label: 'Tensor / AI Accelerators', value: d.tensorOrAiAccelerators },
          { label: 'Base Clock', value: d.baseClock },
          { label: 'Boost Clock', value: d.boostClock },
          { label: 'VRAM Capacity', value: d.vramCapacity },
          { label: 'Memory Type', value: d.memoryType },
          { label: 'Memory Speed', value: d.memorySpeed },
          { label: 'Memory Bus Width', value: d.memoryBusWidth },
          { label: 'Bandwidth', value: d.memoryBandwidth },
          { label: 'Cache', value: d.cache },
          { label: 'Length (mm)', value: d.lengthMm ? `${d.lengthMm} mm` : undefined },
          { label: 'Slot Thickness', value: d.slotWidth },
          { label: 'Cooler Type', value: d.coolerType },
          { label: 'TBP / TGP', value: d.tdpPowerConsumption ? `${d.tdpPowerConsumption}W` : undefined },
          { label: 'Recommended PSU', value: d.recommendedPsuWattage ? `${d.recommendedPsuWattage}W` : undefined },
          { label: 'Connector Type', value: d.powerConnectors },
          { label: 'Display Outputs', value: d.displayOutputs },
          { label: 'Ray Tracing Support', value: d.rayTracing },
          { label: 'DLSS / FSR', value: d.dlssOrFsrSupport },
          { label: 'Frame Generation', value: d.frameGeneration },
          { label: 'Dual BIOS', value: d.dualBios }
        );
        break;

      case 'motherboard':
        items.push(
          { label: 'Product ID', value: d.productId || product.id },
          { label: 'Manufacturer', value: d.manufacturer },
          { label: 'Board Model', value: d.boardModel || product.name },
          { label: 'Chipset', value: d.chipset },
          { label: 'Socket', value: d.socket },
          { label: 'Generation', value: d.generation },
          { label: 'BIOS Version', value: d.biosVersion },
          { label: 'Supported CPU Families', value: d.supportedCpuFamilies },
          { label: 'DDR4 / DDR5', value: d.ramGenerationSupported },
          { label: 'DIMM Count', value: d.ramSlots },
          { label: 'Maximum RAM Capacity', value: d.maxRamCapacity },
          { label: 'Supported Speeds', value: d.supportedSpeeds },
          { label: 'EXPO / XMP Support', value: d.overclockingProfile },
          { label: 'PCIe Expansion Slots', value: d.pcieSlots },
          { label: 'PCIe Generation', value: d.pcieGeneration },
          { label: 'M.2 NVMe Slot Count', value: d.m2Slots },
          { label: 'SATA Ports', value: d.sataPorts },
          { label: 'Rear USB I/O Ports', value: d.rearUsbPorts },
          { label: 'Thunderbolt / USB4 Support', value: d.thunderboltOrUsb4 },
          { label: 'Networking & LAN Speed', value: d.networking },
          { label: 'Wi-Fi Generation', value: d.wifiGeneration },
          { label: 'Bluetooth Version', value: d.bluetoothVersion },
          { label: 'Audio Codec', value: d.audioChipset },
          { label: 'VRM Power Phases', value: d.vrmPhases },
          { label: 'BIOS Flashback Button', value: d.biosFlashback },
          { label: 'Form Factor', value: d.formFactor }
        );
        break;

      default:
        // Generic dump for all other categories
        Object.entries(d).forEach(([key, value]) => {
          if (!['image', 'keySpecs', 'description', 'categoryName'].includes(key)) {
            items.push({
              label: key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()),
              value,
            });
          }
        });
        break;
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {items.map((item, idx) => (
          <div 
            key={idx} 
            className="flex flex-col p-3 rounded-xl bg-[#081120] border border-[#162744] hover:border-[#ff1e2d]/30 transition-colors"
          >
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">
              {item.label}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-white font-mono">
              {val(item.value)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  // Performance Tab
  const renderPerformanceTab = () => {
    const d = details as any;

    return (
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-[#081120] border border-[#162744] space-y-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Gauge className="w-4 h-4 text-[#ff1e2d]" />
            <span>Hardware Performance Metrics</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-300">
            {d.baseClock && (
              <div className="p-3 rounded-lg bg-[#0b1428] border border-[#182846]">
                <span className="text-[11px] text-slate-400 uppercase font-mono block">Base / Nominal Frequency</span>
                <span className="font-bold text-white font-mono">{d.baseClock}</span>
              </div>
            )}
            {d.boostClock && (
              <div className="p-3 rounded-lg bg-[#0b1428] border border-[#182846]">
                <span className="text-[11px] text-slate-400 uppercase font-mono block">Peak Boost Clock</span>
                <span className="font-bold text-emerald-400 font-mono">{d.boostClock}</span>
              </div>
            )}
            {d.cudaOrStreamProcessors && (
              <div className="p-3 rounded-lg bg-[#0b1428] border border-[#182846]">
                <span className="text-[11px] text-slate-400 uppercase font-mono block">Compute Cores / Shaders</span>
                <span className="font-bold text-white font-mono">{d.cudaOrStreamProcessors.toLocaleString()} Cores</span>
              </div>
            )}
            {d.sequentialReadMb && (
              <div className="p-3 rounded-lg bg-[#0b1428] border border-[#182846]">
                <span className="text-[11px] text-slate-400 uppercase font-mono block">Sequential Read Bandwidth</span>
                <span className="font-bold text-emerald-400 font-mono">{d.sequentialReadMb.toLocaleString()} MB/s</span>
              </div>
            )}
            {d.sequentialWriteMb && (
              <div className="p-3 rounded-lg bg-[#0b1428] border border-[#182846]">
                <span className="text-[11px] text-slate-400 uppercase font-mono block">Sequential Write Bandwidth</span>
                <span className="font-bold text-emerald-400 font-mono">{d.sequentialWriteMb.toLocaleString()} MB/s</span>
              </div>
            )}
            {d.speed && (
              <div className="p-3 rounded-lg bg-[#0b1428] border border-[#182846]">
                <span className="text-[11px] text-slate-400 uppercase font-mono block">Rated Frequency / MT/s</span>
                <span className="font-bold text-white font-mono">{d.speed}</span>
              </div>
            )}
            {d.wattage && (
              <div className="p-3 rounded-lg bg-[#0b1428] border border-[#182846]">
                <span className="text-[11px] text-slate-400 uppercase font-mono block">Sustained Power Output</span>
                <span className="font-bold text-white font-mono">{d.wattage} Watts</span>
              </div>
            )}
            {d.refreshRateHz && (
              <div className="p-3 rounded-lg bg-[#0b1428] border border-[#182846]">
                <span className="text-[11px] text-slate-400 uppercase font-mono block">Panel Refresh Rate</span>
                <span className="font-bold text-white font-mono">{d.refreshRateHz} Hz</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Compatibility Tab
  const renderCompatibilityTab = () => {
    const d = details as any;

    return (
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-[#081120] border border-[#162744] space-y-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Layers3 className="w-4 h-4 text-[#ff1e2d]" />
            <span>Platform Integration Guidelines</span>
          </div>

          <div className="space-y-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
            {d.socket && (
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Socket Architecture:</strong> Compatible with {d.socket} motherboards and coolers with matching bracket kits.</span>
              </div>
            )}
            {d.chipsetSupport && (
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Recommended Chipsets:</strong> {Array.isArray(d.chipsetSupport) ? d.chipsetSupport.join(', ') : d.chipsetSupport}.</span>
              </div>
            )}
            {d.recommendedPsuWattage && (
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Power Supply:</strong> Requires minimum {d.recommendedPsuWattage}W rated PSU with {d.powerConnectors}.</span>
              </div>
            )}
            {d.lengthMm && (
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Case Clearance:</strong> Ensure chassis supports GPU length &gt;= {d.lengthMm} mm and slot width of {d.slotWidth}.</span>
              </div>
            )}
            {d.coolerHeightMm && (
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Cooler Height:</strong> Requires case CPU clearance of at least {d.coolerHeightMm + 5} mm.</span>
              </div>
            )}
            {d.radiatorSize && (
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Radiator Clearance:</strong> Case must feature top or front mounting rails for {d.radiatorSize} radiators.</span>
              </div>
            )}
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span><strong>RigForge Verification:</strong> Cross-checked against standard ATX/mATX thermal and electrical profiles.</span>
            </div>
          </div>
        </div>

        {/* Builder Fit Guarantee */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-[#142244]/80 to-[#0d172e] border border-[#1e2d4f] flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-[#ff1e2d] flex-shrink-0" />
          <div className="text-xs">
            <h5 className="font-bold text-white mb-0.5">RigForge 100% Fit Guarantee</h5>
            <p className="text-slate-300">Add this part to your RigForge Builder slot to test automatic wattage calculation and clearance verification in real time.</p>
          </div>
        </div>
      </div>
    );
  };

  // Pricing & Warranty Tab
  const renderPricingTab = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-3.5 rounded-xl bg-[#081120] border border-[#162744]">
          <span className="text-[11px] font-medium text-slate-400 uppercase">Authorized Seller</span>
          <p className="text-sm font-bold text-white mt-1 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            {product.seller || 'RigForge Direct Partner'}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Authorized Indian distributor with verified GST invoice.</p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#081120] border border-[#162744]">
          <span className="text-[11px] font-medium text-slate-400 uppercase">Manufacturer Warranty</span>
          <p className="text-sm font-bold text-white mt-1 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#FCA311]" />
            {product.warranty || '3 Years Domestic Warranty'}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Official brand service centers across India.</p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#081120] border border-[#162744]">
          <span className="text-[11px] font-medium text-slate-400 uppercase">Stock & Inventory</span>
          <p className={`text-sm font-bold mt-1 flex items-center gap-1.5 ${
            stockStatus === 'In Stock' ? 'text-emerald-400' :
            stockStatus === 'Limited Stock' ? 'text-amber-400' : 'text-red-400'
          }`}>
            <CheckCircle2 className="w-4 h-4" />
            {stockStatus}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Dispatches within 24 business hours.</p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#081120] border border-[#162744]">
          <span className="text-[11px] font-medium text-slate-400 uppercase">Lowest Recorded Price</span>
          <p className="text-sm font-bold text-[#FCA311] font-mono mt-1">
            {details.lowestPrice ? formatINR(details.lowestPrice) : (product.price ? formatINR(product.price * 0.96) : 'Not specified')}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Lowest 90-day tracking index across Indian retail stores.</p>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-[#081120] border border-[#162744] space-y-2">
        <div className="flex items-center gap-2 text-white font-bold text-xs">
          <Truck className="w-4 h-4 text-[#ff1e2d]" />
          <span>Shipping & Transit Insurance</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          All orders include bubble-wrapped ESD-safe packaging and full transit insurance against loss or damage. Orders over ₹10,000 qualify for free expedited air courier shipping.
        </p>
      </div>
    </div>
  );

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-[#0b1324] border border-[#1e2d4f] shadow-2xl overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e2d4f] bg-[#070d18]/90">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#142244] border border-[#1e2d4f] text-[#ff1e2d] text-xs font-mono font-bold uppercase">
              {getCategoryIcon(product.category)}
              {details.categoryName || product.category}
            </span>
            <span className="text-xs font-mono text-slate-400">Brand: <strong className="text-white">{product.brand}</strong></span>
            
            {isPlaceholder ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#142244] text-sky-300 border border-sky-500/30">
                Catalogue Entry
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                Verified Spec
              </span>
            )}

            {discountPercent > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ff1e2d]/20 border border-[#ff1e2d]/40 text-[#ff1e2d] text-xs font-mono font-bold">
                <BadgePercent className="w-3 h-3" />
                {discountPercent}% OFF
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#0d172e] hover:bg-[#1e2d4f] text-slate-400 hover:text-white transition-colors border border-[#1e2d4f]"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Top Section: Hardware Photo & Main Pricing */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Component Photo */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#070c17] border border-[#1e2d4f] group">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1324] via-transparent to-transparent opacity-60" />
                
                {/* Stock status floating pill */}
                <div className="absolute bottom-3 left-3">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md shadow-md ${
                    stockStatus === 'In Stock'
                      ? 'bg-emerald-950/90 text-emerald-400 border border-emerald-500/40'
                      : stockStatus === 'Limited Stock'
                      ? 'bg-amber-950/90 text-amber-400 border border-amber-500/40'
                      : 'bg-red-950/90 text-red-400 border border-red-500/40'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      stockStatus === 'In Stock' ? 'bg-emerald-400 animate-pulse' :
                      stockStatus === 'Limited Stock' ? 'bg-amber-400' : 'bg-red-400'
                    }`} />
                    {stockStatus}
                  </span>
                </div>
              </div>

              {/* Quick Specs Bullet List */}
              <div className="w-full mt-4 space-y-1.5">
                {(product.keySpecsSummary || details.keySpecs || []).slice(0, 4).map((spec: string, i: number) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-300 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e2d]" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Info & Pricing Card */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-[#FCA311] text-[#FCA311]" />
                    <span className="font-bold text-white">{product.rating}</span>
                    <span>({product.reviewsCount} reviews)</span>
                  </div>
                  <span>•</span>
                  <span className="font-mono text-[11px] text-slate-400">SKU: {product.id}</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
                  {product.name}
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  {product.description}
                </p>

                {/* Price Display */}
                <div className="mt-5 p-4 rounded-xl bg-[#081120] border border-[#162744]">
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                      {product.price !== null ? formatINR(product.price) : 'Price on Request'}
                    </span>
                    {product.mrp && product.price && product.mrp > product.price && (
                      <span className="text-sm font-mono text-slate-400 line-through">
                        {formatINR(product.mrp)}
                      </span>
                    )}
                    {discountPercent > 0 && product.mrp && product.price && (
                      <span className="text-xs font-bold text-emerald-400 font-mono">
                        Save {formatINR(product.mrp - product.price)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-1">
                    <span>Inclusive of 18% GST (Official Tax Invoice)</span>
                    <span className="text-emerald-400 font-medium">Free Expedited Courier</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Add to Cart + Select in PC Builder */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || product.price === null}
                  className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                    isOutOfStock || product.price === null
                      ? 'bg-[#141f36] text-slate-500 border border-[#1e2d4f] cursor-not-allowed'
                      : 'bg-[#ff1e2d] hover:bg-[#e00d1b] text-white shadow-glow-red active:scale-95'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{isOutOfStock ? 'Currently Out of Stock' : 'Add to Cart'}</span>
                </button>

                <button
                  onClick={handleAddToBuild}
                  disabled={isOutOfStock}
                  className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all border ${
                    isOutOfStock
                      ? 'bg-[#141f36] text-slate-500 border-[#1e2d4f] cursor-not-allowed'
                      : isCurrentBuildSelection
                      ? 'bg-[#FCA311]/20 text-[#FCA311] border-[#FCA311]/50'
                      : 'bg-[#0d172e] hover:bg-[#142244] text-[#FCA311] border-[#FCA311]/40 hover:border-[#FCA311]'
                  }`}
                >
                  <Wrench className="w-4 h-4" />
                  <span>
                    {isOutOfStock ? 'Unavailable' : isCurrentBuildSelection ? 'In Current Build' : 'Select in PC Builder'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Structured Sections / Tabs */}
          <div className="border-t border-[#1e2d4f] pt-5">
            <div className="flex items-center gap-2 border-b border-[#1e2d4f] pb-2 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === 'overview'
                    ? 'bg-[#ff1e2d] text-white shadow-glow-red'
                    : 'text-slate-400 hover:text-white hover:bg-[#142244]'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === 'specs'
                    ? 'bg-[#ff1e2d] text-white shadow-glow-red'
                    : 'text-slate-400 hover:text-white hover:bg-[#142244]'
                }`}
              >
                Specifications
              </button>
              <button
                onClick={() => setActiveTab('performance')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === 'performance'
                    ? 'bg-[#ff1e2d] text-white shadow-glow-red'
                    : 'text-slate-400 hover:text-white hover:bg-[#142244]'
                }`}
              >
                Performance
              </button>
              <button
                onClick={() => setActiveTab('compatibility')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === 'compatibility'
                    ? 'bg-[#ff1e2d] text-white shadow-glow-red'
                    : 'text-slate-400 hover:text-white hover:bg-[#142244]'
                }`}
              >
                Compatibility
              </button>
              <button
                onClick={() => setActiveTab('pricing')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === 'pricing'
                    ? 'bg-[#ff1e2d] text-white shadow-glow-red'
                    : 'text-slate-400 hover:text-white hover:bg-[#142244]'
                }`}
              >
                Pricing & Warranty
              </button>
            </div>

            {/* Tab Contents */}
            <div className="pt-4">
              {activeTab === 'overview' && renderOverviewTab()}
              {activeTab === 'specs' && renderSpecsTab()}
              {activeTab === 'performance' && renderPerformanceTab()}
              {activeTab === 'compatibility' && renderCompatibilityTab()}
              {activeTab === 'pricing' && renderPricingTab()}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-[#1e2d4f] bg-[#070d18] flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>RigForge Verified Genuine Component</span>
          </div>
          <button
            onClick={onClose}
            className="text-xs text-slate-300 hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
