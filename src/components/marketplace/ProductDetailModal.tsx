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
  BadgePercent
} from 'lucide-react';
import { CatalogueRecord } from '../../data/catalogue/catalogueData';
import { formatINR } from '../../utils/formatCurrency';
import { useCartStore } from '../../store/useCartStore';
import { useBuilderStore } from '../../store/useBuilderStore';

interface ProductDetailModalProps {
  product: CatalogueRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onNotification?: (msg: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onNotification,
}) => {
  const [activeTab, setActiveTab] = useState<'specs' | 'compatibility' | 'commercial'>('specs');
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  const setSlot = useBuilderStore((state) => state.setSlot);
  const currentSlotProduct = useBuilderStore((state) => (product ? state.slots[product.category] : undefined));

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

  const details = product.catalogueDetails;
  const stockStatus = product.stockStatus || product.catalogueDetails?.stockStatus || (product.inStock ? 'In Stock' : 'Out of Stock');
  const isOutOfStock = stockStatus === 'Out of Stock' || !product.inStock;
  const isCurrentBuildSelection = currentSlotProduct?.id === product.id;
  const discountPercent = product.mrp && product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem(product, 1);
    openCart();
    if (onNotification) {
      onNotification(`Added "${product.name}" to cart.`);
    }
  };

  const handleAddToBuild = () => {
    if (isOutOfStock) return;
    setSlot(product.category, product);
    if (onNotification) {
      onNotification(`Assigned "${product.name}" to [${product.category.toUpperCase()}] slot!`);
    }
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

  // Render technical specs grid according to category
  const renderCategoryTechnicalSpecs = () => {
    const d = details as any;
    const items: { label: string; value: string | number | boolean | undefined | string[] }[] = [];

    switch (details.category) {
      case 'cpu':
        items.push(
          { label: 'Series / Generation', value: d.seriesGeneration },
          { label: 'Microarchitecture', value: d.architecture },
          { label: 'Cores / Threads', value: `${d.cores} Cores / ${d.threads} Threads` },
          { label: 'Base Clock', value: d.baseClock },
          { label: 'Max Boost Clock', value: d.boostClock },
          { label: 'Total Cache', value: d.cache },
          { label: 'Base TDP', value: `${d.tdp} Watts` },
          { label: 'Socket', value: d.socket },
          { label: 'Supported RAM', value: d.ramType },
          { label: 'Max Memory Supported', value: d.maxMemory },
          { label: 'PCIe Revision', value: d.pcieVersion },
          { label: 'Integrated Graphics', value: d.integratedGraphics },
          { label: 'NPU / AI Engine', value: d.npu || 'None' },
          { label: 'Cooler in Box', value: d.coolerIncluded ? 'Included' : 'Not Included (Requires Aftermarket Cooler)' },
          { label: 'Cooler Recommendation', value: d.coolerRecommendation }
        );
        break;

      case 'gpu':
        items.push(
          { label: 'GPU Family & Gen', value: `${d.gpuFamily} (${d.generation})` },
          { label: 'Board Partner Model', value: `${d.boardPartner} • ${d.model}` },
          { label: 'Architecture', value: d.architecture },
          { label: 'CUDA / Stream Processors', value: d.cudaOrStreamProcessors?.toLocaleString() },
          { label: 'Ray Tracing / RT Cores', value: d.rtCoresOrRayAccelerators },
          { label: 'Tensor / AI Accelerators', value: d.tensorOrAiAccelerators },
          { label: 'Base / Boost Clock', value: `${d.baseClock} / ${d.boostClock}` },
          { label: 'VRAM Capacity', value: d.vramCapacity },
          { label: 'Memory Type', value: d.memoryType },
          { label: 'Memory Bus Width', value: d.memoryBusWidth },
          { label: 'Bandwidth', value: d.memoryBandwidth },
          { label: 'PCIe Interface', value: d.pcieInterface },
          { label: 'TDP Power Consumption', value: `${d.tdpPowerConsumption}W` },
          { label: 'Recommended PSU', value: `${d.recommendedPsuWattage}W` },
          { label: 'Power Connectors', value: d.powerConnectors },
          { label: 'Display Outputs', value: d.displayOutputs },
          { label: 'Dimensions (Length x Width)', value: `${d.lengthMm} mm • ${d.slotWidth}` },
          { label: 'Dual BIOS', value: d.dualBios ? 'Yes' : 'No' }
        );
        break;

      case 'motherboard':
        items.push(
          { label: 'Socket', value: d.socket },
          { label: 'Chipset', value: d.chipset },
          { label: 'Form Factor', value: d.formFactor },
          { label: 'Power Stages / VRM', value: d.vrmPhases },
          { label: 'Memory Standard', value: d.ramGenerationSupported },
          { label: 'RAM Slots / Max Capacity', value: `${d.ramSlots} Slots • Up to ${d.maxRamCapacity}` },
          { label: 'PCIe Expansion', value: d.pcieSlots },
          { label: 'M.2 NVMe Slots', value: d.m2Slots },
          { label: 'SATA Ports', value: d.sataPorts },
          { label: 'Networking & Wireless', value: d.networking },
          { label: 'Audio Codec', value: d.audioChipset },
          { label: 'Rear I/O USB', value: d.rearUsbPorts },
          { label: 'BIOS Flashback', value: d.biosFlashback ? 'Supported (Button on Rear I/O)' : 'No' }
        );
        break;

      case 'ram':
        items.push(
          { label: 'Kit Capacity', value: d.kitCapacity },
          { label: 'Module Configuration', value: `${d.moduleCount} Modules` },
          { label: 'Tested Frequency', value: d.speed },
          { label: 'Tested Timings', value: d.timings },
          { label: 'CAS Latency', value: `CL${d.casLatency}` },
          { label: 'Tested Voltage', value: d.testedVoltage },
          { label: 'Overclocking Profile', value: d.overclockingProfile },
          { label: 'Module Height', value: `${d.heightMm} mm` },
          { label: 'RGB Illumination', value: d.rgbLighting ? 'Addressable RGB' : 'Non-RGB Stealth' },
          { label: 'Heatspreader Finish', value: d.heatSpreaderColor }
        );
        break;

      case 'nvme_ssd':
        items.push(
          { label: 'Capacity', value: d.capacity },
          { label: 'Form Factor', value: d.formFactor },
          { label: 'Interface', value: d.interfacePcie },
          { label: 'Max Sequential Read', value: `${d.sequentialReadMb?.toLocaleString()} MB/s` },
          { label: 'Max Sequential Write', value: `${d.sequentialWriteMb?.toLocaleString()} MB/s` },
          { label: 'Random Read IOPS', value: d.randomReadIops?.toLocaleString() },
          { label: 'Random Write IOPS', value: d.randomWriteIops?.toLocaleString() },
          { label: 'NAND Flash Type', value: d.nandType },
          { label: 'DRAM Cache', value: d.dramCache },
          { label: 'Endurance Rating (TBW)', value: `${d.enduranceTbw} TBW` },
          { label: 'MTBF Reliability', value: `${d.mtbfHours?.toLocaleString()} Hours` },
          { label: 'Heatsink Included', value: d.heatsinkIncluded ? 'Yes' : 'No (Use Motherboard Shield)' }
        );
        break;

      case 'sata_ssd':
        items.push(
          { label: 'Capacity', value: d.capacity },
          { label: 'Form Factor', value: d.formFactor },
          { label: 'Interface', value: d.interfaceSata },
          { label: 'Max Sequential Read', value: `${d.sequentialReadMb} MB/s` },
          { label: 'Max Sequential Write', value: `${d.sequentialWriteMb} MB/s` },
          { label: 'DRAM Cache', value: d.dramCache },
          { label: 'Endurance Rating (TBW)', value: `${d.enduranceTbw} TBW` },
          { label: 'MTBF', value: `${d.mtbfHours?.toLocaleString()} Hours` }
        );
        break;

      case 'hdd':
        items.push(
          { label: 'Capacity', value: d.capacity },
          { label: 'Form Factor', value: d.formFactor },
          { label: 'Rotational Speed', value: `${d.rpm} RPM` },
          { label: 'Buffer / Cache', value: `${d.cacheMb} MB` },
          { label: 'Recording Technology', value: d.recordingTechnology },
          { label: 'Annual Workload Rating', value: `${d.workloadRatingTbyr} TB/year` },
          { label: 'NAS / 24/7 Reliability', value: d.nasCompatibility ? 'Yes (NAS Certified)' : 'Desktop Grade' }
        );
        break;

      case 'psu':
        items.push(
          { label: 'Total Output Wattage', value: `${d.wattage} Watts` },
          { label: 'Efficiency Certification', value: d.efficiencyRating },
          { label: 'Cable Modularity', value: d.modularity },
          { label: 'ATX Compliance', value: d.atxVersion },
          { label: 'PCIe 5.0 12V-2x6 Cable', value: d.pcieGen5Connector ? 'Native 12V-2x6 Included' : 'Standard 8-pin PCIe' },
          { label: 'Cooling Fan', value: `${d.coolingFanSize} mm (${d.fanBearingType})` },
          { label: 'Zero RPM Fan Mode', value: d.zeroRpmMode ? 'Yes (Silent at low load)' : 'No' },
          { label: 'Protection Suite', value: d.protections },
          { label: 'PSU Dimensions', value: d.dimensionsMm }
        );
        break;

      case 'case':
        items.push(
          { label: 'Chassis Type', value: d.caseType },
          { label: 'Motherboard Compatibility', value: Array.isArray(d.motherboardSupport) ? d.motherboardSupport.join(', ') : d.motherboardSupport },
          { label: 'Side Panel', value: d.sidePanelType },
          { label: 'GPU Clearance (Max Length)', value: `${d.gpuClearanceMm} mm` },
          { label: 'CPU Cooler Height Limit', value: `${d.cpuCoolerClearanceMm} mm` },
          { label: 'PSU Max Length', value: `${d.psuClearanceMm} mm` },
          { label: 'Radiator Support', value: Array.isArray(d.radiatorSupport) ? d.radiatorSupport.join(' • ') : d.radiatorSupport },
          { label: 'Pre-installed Fans', value: d.includedFans },
          { label: 'Front Panel I/O', value: d.frontIoPorts }
        );
        break;

      case 'air_cooler':
        items.push(
          { label: 'Heatsink Architecture', value: d.coolerType },
          { label: 'Heatpipes', value: `${d.heatpipesCount} Direct-Contact / Sintered Pipes` },
          { label: 'Total Cooler Height', value: `${d.coolerHeightMm} mm` },
          { label: 'TDP Dissipation Rating', value: `${d.tdpRatingWatts} Watts` },
          { label: 'Fan Dimensions & Speed', value: `${d.fanDimensions} • ${d.fanSpeedRpm}` },
          { label: 'Max Airflow / Noise', value: `${d.fanAirflowCfm} CFM • ${d.noiseLevelDb} dBA` },
          { label: 'Socket Compatibility', value: Array.isArray(d.socketCompatibility) ? d.socketCompatibility.join(', ') : d.socketCompatibility },
          { label: 'Thermal Paste', value: d.thermalPasteIncluded ? 'Pre-applied / Syringe Included' : 'Separate Purchase' }
        );
        break;

      case 'aio_cooler':
        items.push(
          { label: 'Radiator Size', value: d.radiatorSize },
          { label: 'Radiator Dimensions', value: d.radiatorDimensionsMm },
          { label: 'Radiator Material', value: d.radiatorMaterial },
          { label: 'Tube Length', value: `${d.tubeLengthMm} mm` },
          { label: 'Pump Speed', value: d.pumpSpeedRpm },
          { label: 'Fans Included', value: `${d.fansIncludedCount}x Fans (${d.fanAirflowCfm} CFM, ${d.noiseLevelDb} dBA)` },
          { label: 'Pump Head Display', value: d.displayType },
          { label: 'Socket Compatibility', value: Array.isArray(d.socketCompatibility) ? d.socketCompatibility.join(', ') : d.socketCompatibility },
          { label: 'Lighting', value: d.rgbLighting }
        );
        break;

      case 'case_fans':
        items.push(
          { label: 'Fan Size', value: `${d.fanSizeMm} mm` },
          { label: 'Pack Quantity', value: d.packQuantity },
          { label: 'Rotational Speed', value: d.speedRpm },
          { label: 'Airflow Volume', value: `${d.airflowCfm} CFM` },
          { label: 'Static Air Pressure', value: `${d.staticPressureMmh2o} mmH2O` },
          { label: 'Acoustic Noise', value: `${d.noiseLevelDb} dBA` },
          { label: 'Bearing Type', value: d.bearingType },
          { label: 'Daisy-Chain Interlocking', value: d.daisyChainSupport ? 'Supported (Cableless Snap-on)' : 'Standard Cables' },
          { label: 'Lighting Type', value: d.rgbType }
        );
        break;

      case 'thermal_paste':
        items.push(
          { label: 'Syringe Net Quantity', value: `${d.quantityGrams} Grams` },
          { label: 'Thermal Conductivity', value: `${d.thermalConductivityWmK} W/m-K` },
          { label: 'Viscosity', value: d.viscosity },
          { label: 'Density', value: `${d.densityGcm3} g/cm³` },
          { label: 'Electrical Conductivity', value: d.electricallyConductive ? 'Conductive (Use Caution)' : 'Non-Conductive (Zero Short-Circuit Risk)' },
          { label: 'Recommended Shelf / Durability', value: `${d.recommendedDurabilityYears} Years on CPU/GPU` },
          { label: 'Application Spatula', value: d.applicationApplicatorIncluded ? 'Included in Box' : 'Not Included' }
        );
        break;

      case 'monitor':
        items.push(
          { label: 'Display Diagonal', value: `${d.screenSizeInches} Inches` },
          { label: 'Resolution', value: `${d.resolution} (${d.aspectRatio})` },
          { label: 'Panel Matrix', value: d.panelType },
          { label: 'Refresh Rate', value: `${d.refreshRateHz} Hz` },
          { label: 'Response Time', value: `${d.responseTimeMs} ms GtG` },
          { label: 'Peak Brightness / HDR', value: `${d.brightnessNits} nits • ${d.hdrSupport}` },
          { label: 'Color Gamut Coverage', value: d.colorGamut },
          { label: 'Contrast Ratio', value: d.contrastRatio },
          { label: 'Adaptive Sync', value: d.syncTechnology },
          { label: 'Display Ports', value: d.videoPorts },
          { label: 'Stand Ergonomics', value: d.ergonomics }
        );
        break;

      case 'keyboard':
        items.push(
          { label: 'Form Factor Layout', value: d.layout },
          { label: 'Key Switches', value: d.switchType },
          { label: 'Connectivity', value: d.connectivity },
          { label: 'Hot-Swap Switch Sockets', value: d.hotSwappable ? '5-pin Hot-Swappable' : 'Soldered' },
          { label: 'RGB Backlighting', value: d.rgbLighting },
          { label: 'Polling Rate', value: d.pollingRate },
          { label: 'Keycap Material & Profile', value: d.keycaps },
          { label: 'Battery Capacity', value: d.batteryCapacity || 'N/A (Wired)' }
        );
        break;

      case 'mouse':
        items.push(
          { label: 'Mouse Category', value: d.mouseType },
          { label: 'Optical Sensor', value: d.sensorModel },
          { label: 'Max Sensitivity', value: d.maxDpi },
          { label: 'Tracking Speed', value: `${d.trackingSpeedIps} IPS` },
          { label: 'Polling Frequency', value: d.pollingRate },
          { label: 'Chassis Weight', value: d.weightGrams },
          { label: 'Button Count', value: `${d.buttonCount} Programmable Buttons` },
          { label: 'Connectivity', value: d.connectivity },
          { label: 'Switch Technology', value: d.switchType },
          { label: 'Battery Life', value: d.batteryLife || 'N/A (Wired)' }
        );
        break;

      default:
        break;
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item, idx) => (
          item.value !== undefined && (
            <div 
              key={idx} 
              className="flex flex-col p-3 rounded-xl bg-[#081120] border border-[#162744] hover:border-[#ff1e2d]/30 transition-colors"
            >
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">
                {item.label}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-white font-mono">
                {String(item.value)}
              </span>
            </div>
          )
        ))}
      </div>
    );
  };

  // Compatibility & Platform notes
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
            {d.ramGenerationSupported && (
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Memory Support:</strong> Requires {d.ramGenerationSupported} desktop DIMM modules.</span>
              </div>
            )}
            {d.formFactor && (
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Form Factor:</strong> {d.formFactor} format layout.</span>
              </div>
            )}
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span><strong>RigForge Verification:</strong> Cross-checked against standard ATX/mATX thermal and electrical profiles.</span>
            </div>
          </div>
        </div>

        {/* RigForge Compatibility Guarantee Box */}
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

  // Commercial & Seller Tab
  const renderCommercialTab = () => {
    return (
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
              {details.lowestPrice ? formatINR(details.lowestPrice) : formatINR(product.price * 0.96)}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Lowest 90-day tracking index across Indian retail stores.</p>
          </div>
        </div>

        {/* RigForge Promise Box */}
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
  };

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
          {/* Top Section: Image, Identity, & Commercial Box */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Image Card */}
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
                {(product.keySpecsSummary || details.keySpecs || []).slice(0, 4).map((spec, i) => (
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
                    <span>({product.reviewsCount} customer reviews)</span>
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
                      {formatINR(product.price)}
                    </span>
                    {product.mrp && product.mrp > product.price && (
                      <span className="text-sm font-mono text-slate-400 line-through">
                        {formatINR(product.mrp)}
                      </span>
                    )}
                    {discountPercent > 0 && product.mrp && (
                      <span className="text-xs font-bold text-emerald-400 font-mono">
                        Save {formatINR(product.mrp - product.price)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-1">
                    <span>Inclusive of 18% GST (Tax Invoice Included)</span>
                    <span className="text-emerald-400 font-medium">Free Expedited Courier</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                    isOutOfStock
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

          {/* Tab Navigation */}
          <div className="border-t border-[#1e2d4f] pt-5">
            <div className="flex items-center gap-2 border-b border-[#1e2d4f] pb-2">
              <button
                onClick={() => setActiveTab('specs')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'specs'
                    ? 'bg-[#ff1e2d] text-white shadow-glow-red'
                    : 'text-slate-400 hover:text-white hover:bg-[#142244]'
                }`}
              >
                Technical Specifications
              </button>
              <button
                onClick={() => setActiveTab('compatibility')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'compatibility'
                    ? 'bg-[#ff1e2d] text-white shadow-glow-red'
                    : 'text-slate-400 hover:text-white hover:bg-[#142244]'
                }`}
              >
                Platform & Compatibility
              </button>
              <button
                onClick={() => setActiveTab('commercial')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'commercial'
                    ? 'bg-[#ff1e2d] text-white shadow-glow-red'
                    : 'text-slate-400 hover:text-white hover:bg-[#142244]'
                }`}
              >
                Seller & Warranty
              </button>
            </div>

            {/* Tab Contents */}
            <div className="pt-4">
              {activeTab === 'specs' && renderCategoryTechnicalSpecs()}
              {activeTab === 'compatibility' && renderCompatibilityTab()}
              {activeTab === 'commercial' && renderCommercialTab()}
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
