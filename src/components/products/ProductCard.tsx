import React from 'react';
import { 
  ShoppingCart, 
  Wrench, 
  Star, 
  Check, 
  Zap, 
  Cpu, 
  Layers, 
  HardDrive, 
  Sparkles,
  Ban
} from 'lucide-react';
import { Product } from '../../types/hardware';
import { useCartStore } from '../../store/useCartStore';
import { useBuilderStore } from '../../store/useBuilderStore';
import { formatINR } from '../../utils/formatCurrency';

interface ProductCardProps {
  product: Product;
  onNotification?: (msg: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onNotification }) => {
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  const setSlot = useBuilderStore((state) => state.setSlot);
  const currentSlotProduct = useBuilderStore((state) => state.slots[product.category]);

  const isCurrentBuildSelection = currentSlotProduct?.id === product.id;
  const isOutOfStock = !product.inStock;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addItem(product, 1);
    openCart();
    if (onNotification) {
      onNotification(`Added "${product.name}" to cart.`);
    }
  };

  const handleAddToBuild = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    setSlot(product.category, product);
    if (onNotification) {
      onNotification(`Assigned "${product.name}" to [${product.category.toUpperCase()}] slot!`);
    }
  };

  // Generate specification highlights based on component category
  const renderSpecBadges = () => {
    const badges = [];

    if (product.specs.socket) {
      badges.push(
        <span key="socket" className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-[#1e2d4f] text-[#FCA311] border border-[#26365a]">
          <Cpu className="w-3 h-3 text-[#FCA311]" />
          {product.specs.socket}
        </span>
      );
    }

    if (product.specs.tdp) {
      badges.push(
        <span key="tdp" className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-[#1e2d4f] text-amber-300 border border-[#26365a]">
          <Zap className="w-3 h-3 text-amber-400" />
          {product.specs.tdp}W TDP
        </span>
      );
    }

    if (product.specs.wattage) {
      badges.push(
        <span key="wattage" className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-[#1e2d4f] text-amber-300 border border-[#26365a]">
          <Zap className="w-3 h-3 text-amber-400" />
          {product.specs.wattage}W
        </span>
      );
    }

    if (product.specs.vram) {
      badges.push(
        <span key="vram" className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-[#1e2d4f] text-purple-300 border border-[#26365a]">
          {product.specs.vram}
        </span>
      );
    }

    if (product.specs.ramType) {
      badges.push(
        <span key="ramType" className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-[#1e2d4f] text-emerald-300 border border-[#26365a]">
          <Layers className="w-3 h-3 text-emerald-400" />
          {product.specs.ramType}
        </span>
      );
    }

    if (product.specs.supportedRamType) {
      badges.push(
        <span key="supportedRam" className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-[#1e2d4f] text-emerald-300 border border-[#26365a]">
          {product.specs.supportedRamType} Mobo
        </span>
      );
    }

    if (product.specs.capacity) {
      badges.push(
        <span key="capacity" className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-[#1e2d4f] text-[#A0A0A0] border border-[#26365a]">
          <HardDrive className="w-3 h-3 text-[#A0A0A0]" />
          {product.specs.capacity}
        </span>
      );
    }

    return badges.slice(0, 3);
  };

  return (
    <div className={`group relative rounded-2xl bg-[#16223f] border transition-all duration-300 flex flex-col justify-between overflow-hidden backdrop-blur-sm ${
      isOutOfStock ? 'opacity-65 border-[#26365a]' :
      isCurrentBuildSelection 
        ? 'border-[#FCA311] shadow-glow-orange ring-1 ring-[#FCA311]/50' 
        : 'border-[#26365a] hover:border-[#FCA311]/50 hover:shadow-glow-orange'
    }`}>
      {/* Top Banner tags */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0b1329]">
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover object-center transition-transform duration-500 ${
            isOutOfStock ? 'grayscale-[50%] brightness-75' : 'group-hover:scale-105 opacity-90 group-hover:opacity-100'
          }`}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#16223f] via-[#16223f]/20 to-transparent" />

        {/* Brand and Category badge */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#131d38]/90 text-[#FCA311] border border-[#FCA311]/30 backdrop-blur-sm">
            {product.category}
          </span>
          {product.featured && !isOutOfStock && (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#1e2d4f] text-[#FCA311] border border-[#FCA311]/30 backdrop-blur-sm">
              <Sparkles className="w-2.5 h-2.5" />
              Featured
            </span>
          )}
        </div>

        {/* Selected indicator if in custom builder */}
        {isCurrentBuildSelection && !isOutOfStock && (
          <div className="absolute top-3 right-3 inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#FCA311] text-zinc-950 shadow-md">
            <Check className="w-3 h-3 stroke-[3]" />
            IN ACTIVE BUILD
          </div>
        )}

        {/* In Stock vs Out of Stock Badge */}
        <div className="absolute bottom-2.5 right-3">
          {isOutOfStock ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-red-950/90 text-red-400 border border-red-500/50 backdrop-blur-sm shadow-md">
              <Ban className="w-3 h-3" />
              Out of Stock
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              In Stock
            </span>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-[#A0A0A0] mb-1">
            <span className="font-mono">{product.brand}</span>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-[#FCA311] text-[#FCA311]" />
              <span className="font-bold text-white">{product.rating}</span>
              <span className="text-[#A0A0A0]">({product.reviewsCount})</span>
            </div>
          </div>

          <h3 className="text-base font-bold text-white group-hover:text-[#FCA311] transition-colors line-clamp-1 mb-2" title={product.name}>
            {product.name}
          </h3>

          <p className="text-xs text-[#A0A0A0] line-clamp-2 leading-relaxed mb-3">
            {product.description}
          </p>

          {/* Specs pills */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {renderSpecBadges()}
          </div>
        </div>

        {/* Price & Action Buttons */}
        <div className="pt-3 border-t border-[#26365a] mt-auto">
          <div className="flex items-baseline gap-2 mb-3">
            <span className={`text-xl font-extrabold font-mono tracking-tight ${
              isOutOfStock ? 'text-zinc-500' : 'text-white'
            }`}>
              {formatINR(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs font-mono text-[#A0A0A0] line-through">
                {formatINR(product.originalPrice)}
              </span>
            )}
            <span className="text-[10px] font-mono text-[#A0A0A0] ml-auto">
              Inc. 18% GST
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-colors min-h-[40px] ${
                isOutOfStock
                  ? 'bg-[#131d38] text-zinc-600 border-[#26365a] cursor-not-allowed'
                  : 'bg-[#1e2d4f] hover:bg-[#233359] text-zinc-200 hover:text-white border-[#26365a] active:scale-95'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5 text-[#A0A0A0]" />
              <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
            </button>

            <button
              onClick={handleAddToBuild}
              disabled={isOutOfStock}
              className={`py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all min-h-[40px] ${
                isOutOfStock
                  ? 'bg-[#131d38] text-zinc-600 border border-[#26365a] cursor-not-allowed'
                  : isCurrentBuildSelection
                  ? 'bg-[#FCA311]/20 text-[#FCA311] border border-[#FCA311]/50 active:scale-95'
                  : 'bg-[#FCA311] hover:bg-[#E59200] text-zinc-950 font-bold shadow-glow-orange active:scale-95'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>
                {isOutOfStock ? 'Unavailable' : isCurrentBuildSelection ? 'Selected' : '+ Build'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
