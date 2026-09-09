import React from 'react';
import { 
  ShoppingCart, 
  Wrench, 
  Star, 
  Eye, 
  Check, 
  Ban, 
  Sparkles,
  BadgePercent,
  HelpCircle
} from 'lucide-react';
import { CatalogueRecord } from '../../data/catalogue/catalogueData';
import { ComponentCategory } from '../../types/hardware';
import { formatINR } from '../../utils/formatCurrency';
import { useCartStore } from '../../store/useCartStore';
import { useBuilderStore } from '../../store/useBuilderStore';

interface MarketplaceProductCardProps {
  product: CatalogueRecord;
  onViewDetails: (product: CatalogueRecord) => void;
  onNotification?: (msg: string) => void;
}

// Maps catalogue category to existing PC builder slot if applicable
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
    case 'case_fans':
    case 'thermal_paste':
    case 'monitor':
    case 'keyboard':
    case 'mouse': return 'peripherals';
    default: return cat;
  }
};

export const MarketplaceProductCard: React.FC<MarketplaceProductCardProps> = ({
  product,
  onViewDetails,
  onNotification,
}) => {
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  const setSlot = useBuilderStore((state) => state.setSlot);

  const builderSlot = mapCategoryToBuilderSlot(product.category);
  const currentSlotProduct = useBuilderStore((state) => state.slots[builderSlot]);
  const isCurrentBuildSelection = currentSlotProduct?.id === product.id;

  const stockStatus = product.stockStatus || product.catalogueDetails?.stockStatus || (product.inStock ? 'In Stock' : 'Out of Stock');
  const isOutOfStock = stockStatus === 'Out of Stock' || !product.inStock;
  const isPlaceholder = product.placeholder ?? false;

  const discountPercent = product.mrp && product.price && product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock || product.price === null) return;
    addItem(product, 1);
    openCart();
    if (onNotification) {
      onNotification(`Added "${product.name}" to cart.`);
    }
  };

  const handleAddToBuild = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    setSlot(builderSlot, product);
    if (onNotification) {
      onNotification(`Assigned "${product.name}" to [${builderSlot.toUpperCase()}] slot in PC Builder!`);
    }
  };

  const handleCardClick = () => {
    onViewDetails(product);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group relative rounded-2xl bg-[#0b1326] border transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer hover:-translate-y-1 backdrop-blur-md ${
        isOutOfStock
          ? 'opacity-70 border-[#1a2948]'
          : isCurrentBuildSelection
          ? 'border-[#FCA311] shadow-glow-orange ring-1 ring-[#FCA311]/50'
          : 'border-[#1e2d4f] hover:border-[#ff1e2d]/60 hover:shadow-glow-red'
      }`}
    >
      {/* Top Banner & Hardware Photography */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#070c18]">
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover object-center transition-transform duration-500 ${
            isOutOfStock ? 'grayscale-[40%] brightness-75' : 'group-hover:scale-105 opacity-90 group-hover:opacity-100'
          }`}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1326] via-[#0b1326]/20 to-transparent" />

        {/* Top Badges (Brand, Real vs Catalogue, Discount, Featured) */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10 max-w-[80%]">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#0b1326]/90 text-white border border-[#1e2d4f] backdrop-blur-sm">
            {product.brand}
          </span>

          {/* Real PDF Verified vs Catalogue Entry */}
          {isPlaceholder ? (
            <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded-md bg-[#132240]/90 text-sky-300 border border-sky-500/30 backdrop-blur-sm">
              Catalogue Entry
            </span>
          ) : (
            <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded-md bg-emerald-950/90 text-emerald-300 border border-emerald-500/30 backdrop-blur-sm">
              Verified Spec
            </span>
          )}

          {discountPercent > 0 && !isOutOfStock && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#ff1e2d] text-white shadow-md">
              <BadgePercent className="w-2.5 h-2.5" />
              {discountPercent}% OFF
            </span>
          )}

          {product.featured && !isOutOfStock && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#142244]/90 text-[#FCA311] border border-[#FCA311]/30 backdrop-blur-sm">
              <Sparkles className="w-2.5 h-2.5" />
              Featured
            </span>
          )}
        </div>

        {/* In Active Build Indicator */}
        {isCurrentBuildSelection && !isOutOfStock && (
          <div className="absolute top-3 right-3 inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#FCA311] text-zinc-950 shadow-md z-10">
            <Check className="w-3 h-3 stroke-[3]" />
            ACTIVE BUILD
          </div>
        )}

        {/* Stock Status Pill */}
        <div className="absolute bottom-2.5 right-3 z-10">
          {stockStatus === 'In Stock' ? (
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-950/90 text-emerald-400 border border-emerald-500/40 backdrop-blur-sm shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              In Stock
            </span>
          ) : stockStatus === 'Limited Stock' ? (
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-950/90 text-amber-400 border border-amber-500/40 backdrop-blur-sm shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Limited Stock
            </span>
          ) : stockStatus === 'Out of Stock' ? (
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-red-950/90 text-red-400 border border-red-500/40 backdrop-blur-sm shadow-sm">
              <Ban className="w-3 h-3" />
              Out of Stock
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-slate-900/90 text-slate-400 border border-slate-700 backdrop-blur-sm shadow-sm">
              <HelpCircle className="w-3 h-3" />
              Status: Check
            </span>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category name & rating */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#ff1e2d] font-bold">
              {product.catalogueDetails?.categoryName || product.category}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-[#FCA311] text-[#FCA311]" />
              <span className="font-bold text-white text-xs">{product.rating}</span>
              <span className="text-slate-400 text-[11px]">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 
            className="text-sm sm:text-base font-bold text-white group-hover:text-[#ff1e2d] transition-colors line-clamp-1 mb-2.5" 
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Key Specs (2-3 bullet points extracted from catalogue data) */}
          <div className="space-y-1 mb-4">
            {(product.keySpecsSummary || product.catalogueDetails?.keySpecs || []).slice(0, 3).map((spec, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-300 font-mono line-clamp-1">
                <span className="w-1 h-1 rounded-full bg-[#ff1e2d] flex-shrink-0" />
                <span className="truncate">{spec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Price & Actions Section */}
        <div className="pt-3 border-t border-[#1e2d4f] mt-auto">
          <div className="flex items-baseline gap-2 mb-3">
            <span className={`text-lg sm:text-xl font-black font-mono tracking-tight ${
              isOutOfStock ? 'text-slate-500' : 'text-white'
            }`}>
              {product.price !== null ? formatINR(product.price) : 'Price on Request'}
            </span>
            {product.mrp && product.price && product.mrp > product.price && (
              <span className="text-xs font-mono text-slate-400 line-through">
                {formatINR(product.mrp)}
              </span>
            )}
            <span className="text-[10px] font-mono text-slate-400 ml-auto">
              Inc. 18% GST
            </span>
          </div>

          {/* Action Buttons: Add to Build + View Details + Add to Cart */}
          <div className="grid grid-cols-12 gap-2">
            {/* View Details Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(product);
              }}
              className="col-span-4 py-2 px-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 bg-[#142244] hover:bg-[#1a2c58] text-slate-200 hover:text-white border border-[#1e2d4f] transition-colors min-h-[38px]"
              title="View complete specification schema"
            >
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              <span>Details</span>
            </button>

            {/* Add to Build Button */}
            <button
              type="button"
              onClick={handleAddToBuild}
              disabled={isOutOfStock}
              className={`col-span-4 py-2 px-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 border transition-all min-h-[38px] ${
                isOutOfStock
                  ? 'bg-[#10192e] text-slate-600 border-[#1a2948] cursor-not-allowed'
                  : isCurrentBuildSelection
                  ? 'bg-[#FCA311]/20 text-[#FCA311] border-[#FCA311]/50'
                  : 'bg-[#142244] hover:bg-[#1a2c58] text-[#FCA311] border-[#1e2d4f]'
              }`}
              title="Assign to PC Builder slot"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>{isCurrentBuildSelection ? 'Selected' : '+ Build'}</span>
            </button>

            {/* Add to Cart Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock || product.price === null}
              className={`col-span-4 py-2 px-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all min-h-[38px] ${
                isOutOfStock || product.price === null
                  ? 'bg-[#10192e] text-slate-600 border border-[#1a2948] cursor-not-allowed'
                  : 'bg-[#ff1e2d] hover:bg-[#e00d1b] text-white shadow-glow-red active:scale-95'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{isOutOfStock ? 'Out' : 'Cart'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
