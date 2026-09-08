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
        <span key="socket" className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800/90 text-cyan-300 border border-zinc-700">
          <Cpu className="w-3 h-3 text-cyan-400" />
          {product.specs.socket}
        </span>
      );
    }

    if (product.specs.tdp) {
      badges.push(
        <span key="tdp" className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800/90 text-amber-300 border border-zinc-700">
          <Zap className="w-3 h-3 text-amber-400" />
          {product.specs.tdp}W TDP
        </span>
      );
    }

    if (product.specs.wattage) {
      badges.push(
        <span key="wattage" className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800/90 text-amber-300 border border-zinc-700">
          <Zap className="w-3 h-3 text-amber-400" />
          {product.specs.wattage}W
        </span>
      );
    }

    if (product.specs.vram) {
      badges.push(
        <span key="vram" className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800/90 text-purple-300 border border-zinc-700">
          {product.specs.vram}
        </span>
      );
    }

    if (product.specs.ramType) {
      badges.push(
        <span key="ramType" className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800/90 text-emerald-300 border border-zinc-700">
          <Layers className="w-3 h-3 text-emerald-400" />
          {product.specs.ramType}
        </span>
      );
    }

    if (product.specs.supportedRamType) {
      badges.push(
        <span key="supportedRam" className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800/90 text-emerald-300 border border-zinc-700">
          {product.specs.supportedRamType} Mobo
        </span>
      );
    }

    if (product.specs.capacity) {
      badges.push(
        <span key="capacity" className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800/90 text-zinc-300 border border-zinc-700">
          <HardDrive className="w-3 h-3 text-zinc-400" />
          {product.specs.capacity}
        </span>
      );
    }

    return badges.slice(0, 3);
  };

  return (
    <div className={`group relative rounded-2xl bg-zinc-900/70 border transition-all duration-300 flex flex-col justify-between overflow-hidden backdrop-blur-sm ${
      isOutOfStock ? 'opacity-70 border-zinc-800/60' :
      isCurrentBuildSelection 
        ? 'border-cyan-500 shadow-glow-cyan' 
        : 'border-zinc-800/90 hover:border-cyan-500/50 hover:shadow-glow-cyan'
    }`}>
      {/* Top Banner tags */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-950/80">
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover object-center transition-transform duration-500 ${
            isOutOfStock ? 'grayscale-[50%] brightness-75' : 'group-hover:scale-105 opacity-90 group-hover:opacity-100'
          }`}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />

        {/* Brand and Category badge */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-zinc-900/90 text-cyan-400 border border-cyan-500/30 backdrop-blur-sm">
            {product.category}
          </span>
          {product.featured && !isOutOfStock && (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-sm">
              <Sparkles className="w-2.5 h-2.5" />
              Featured
            </span>
          )}
        </div>

        {/* Selected indicator if in custom builder */}
        {isCurrentBuildSelection && !isOutOfStock && (
          <div className="absolute top-3 right-3 inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-cyan-500 text-zinc-950 shadow-md">
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
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span className="font-mono text-zinc-400">{product.brand}</span>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-zinc-200">{product.rating}</span>
              <span className="text-zinc-500">({product.reviewsCount})</span>
            </div>
          </div>

          <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1 mb-2" title={product.name}>
            {product.name}
          </h3>

          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-3">
            {product.description}
          </p>

          {/* Specs pills */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {renderSpecBadges()}
          </div>
        </div>

        {/* Price & Action Buttons */}
        <div className="pt-3 border-t border-zinc-800/80 mt-auto">
          <div className="flex items-baseline gap-2 mb-3">
            <span className={`text-xl font-extrabold font-mono tracking-tight ${
              isOutOfStock ? 'text-zinc-400' : 'text-white'
            }`}>
              {formatINR(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs font-mono text-zinc-500 line-through">
                {formatINR(product.originalPrice)}
              </span>
            )}
            <span className="text-[10px] font-mono text-zinc-500 ml-auto">
              Inc. 18% GST
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-colors ${
                isOutOfStock
                  ? 'bg-zinc-900 text-zinc-600 border-zinc-800 cursor-not-allowed'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white border-zinc-700 active:scale-95'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5 text-zinc-400" />
              <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
            </button>

            <button
              onClick={handleAddToBuild}
              disabled={isOutOfStock}
              className={`py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                isOutOfStock
                  ? 'bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed'
                  : isCurrentBuildSelection
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 active:scale-95'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-zinc-950 font-bold shadow-glow-cyan active:scale-95'
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
