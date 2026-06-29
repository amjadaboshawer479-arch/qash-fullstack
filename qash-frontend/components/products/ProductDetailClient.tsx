"use client";
import { useState } from "react";
import Image from "next/image";
import { ShoppingBag, Heart, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { toast } from "sonner";
import { addToCartAction } from "@/actions/cart.actions";
import { addToWishlistAction, removeFromWishlistAction } from "@/actions/wishlist.actions";
import { useCartStore } from "@/stores/cart.store";
import { useWishlistStore } from "@/stores/wishlist.store";
import ProductCard from "./ProductCard";
import type { Product } from "@/types";

interface Props {
  product: Product;
  recommended: Product[];
  locale: string;
  currency: string;
  messages: Record<string, Record<string, string>>;
}

export default function ProductDetailClient({ product, recommended, locale, currency, messages }: Props) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariation, setSelectedVariation] = useState<number | null>(null);
  const [selectedCombination, setSelectedCombination] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const { incrementCount } = useCartStore();
  const { hasProduct, addProduct, removeProduct } = useWishlistStore();
  const isWishlisted = hasProduct(product.id);

  const name = locale === "ar" && product.name_ar ? product.name_ar : product.name;
  const description = locale === "ar" && product.description_ar ? product.description_ar : product.description;
  const price = product.discount_price || product.base_price;

  // Build gallery: main image + gallery items
  const galleryImages = [
    ...(product.thumbnail ? [{ image: product.thumbnail }] : []),
    ...(product.gallery || []),
  ];
  // Use all the real product images for the gallery
  const DEMO_GALLERY = [
    "/images/product-table-lamp.png",
    "/images/product-ceramic-lamp.png",
    "/images/product-pendant.png",
    "/images/product-lighting.png",
  ];

  const displayImages = galleryImages.length > 0
    ? galleryImages.map((g, i) => g.image || DEMO_GALLERY[i] || DEMO_GALLERY[0])
    : DEMO_GALLERY;

  // Color swatches from SVG: 3 circles at cx=750.5,705.5,795.5 cy=637.5 r=16.5
  // Colors: #353551 (dark navy), #DEDEDE (light gray), #1E1E1E (black)
  const colorSwatches = ["#353551", "#DEDEDE", "#1E1E1E"];
  const [selectedColor, setSelectedColor] = useState(0);

  async function handleAddToCart() {
    if (product.inventory_mode === "variation" && !selectedVariation && product.available_variations.length > 0) {
      toast.error("Please select a variation");
      return;
    }
    setAdding(true);
    const result = await addToCartAction({
      product_id: product.id,
      quantity,
      ...(selectedVariation ? { variation_id: selectedVariation } : {}),
      ...(selectedCombination ? { combination_id: selectedCombination } : {}),
    });
    setAdding(false);
    if (result.error) { toast.error(result.error); return; }
    incrementCount(quantity);
    toast.success("Added to cart!");
  }

  async function handleWishlist() {
    if (isWishlisted) {
      const r = await removeFromWishlistAction(product.id);
      if (r.error) { toast.error(r.error); return; }
      removeProduct(product.id);
      toast.success("Removed from wishlist");
    } else {
      const r = await addToWishlistAction(product.id);
      if (r.error) { toast.error(r.error); return; }
      addProduct(product.id);
      toast.success("Added to wishlist!");
    }
  }

  return (
    <div style={{ backgroundColor: "var(--bg)" }}>
      {/* MAIN PRODUCT SECTION */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          
          {/* LEFT: Images — SVG: main 599×595 + 4 thumbnails 140×161 below */}
          <div className="w-full lg:shrink-0 lg:w-auto">
            {/* Main image */}
            <div className="relative overflow-hidden bg-[#F4F1EA] mb-3 w-full" style={{ maxWidth: 599, aspectRatio: "599/595" }}>
              <Image
                src={displayImages[selectedImage] || "/images/product-table-lamp.png"}
                alt={name}
                fill
                className="object-cover"
                sizes="599px"
                priority
              />
              {/* Prev/Next */}
              {displayImages.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage(i => (i - 1 + displayImages.length) % displayImages.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setSelectedImage(i => (i + 1) % displayImages.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center"
                  >
                    <ChevronRight size={16} />
                  </button>
                </>
              )}
            </div>
            {/* Thumbnails — SVG: 4 thumbnails 140×161 each */}
            <div className="flex gap-2 sm:gap-3 flex-wrap">
              {displayImages.slice(0, 4).map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className="relative overflow-hidden shrink-0"
                  style={{
                    width: 140, height: 161,
                    outline: selectedImage === i ? "2px solid #D88F65" : "none",
                    outlineOffset: 2,
                  }}
                >
                  <Image src={img} alt="" fill className="object-cover" sizes="140px" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: Product Info */}
          <div className="flex-1 pt-2">
            {/* Best seller */}
            {product.best_seller && (
              <span
                className="inline-block text-white text-[11px] font-medium tracking-wide px-3 py-1 mb-3"
                style={{ backgroundColor: "#D88E63" }}
              >
                Best Seller
              </span>
            )}

            <h1
              className="text-3xl font-semibold text-[#1A1A1A] mb-2 leading-tight"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              {name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-2xl font-semibold text-[#D88F65]">
                {currency} {parseFloat(price).toFixed(2)}
              </span>
              {product.has_discount && product.discount_price && (
                <span className="text-[#999] text-base line-through">
                  {currency} {parseFloat(product.base_price).toFixed(2)}
                </span>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-5">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: product.is_available ? "#057B03" : "#E53E3E" }}
              />
              <span
                className="text-sm font-medium"
                style={{ color: product.is_available ? "#057B03" : "#E53E3E" }}
              >
                {product.is_available ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            {/* Description */}
            {description && (
              <p className="text-[#313131]/70 text-sm leading-relaxed mb-6 max-w-md">
                {description}
              </p>
            )}

            {/* Color swatches — SVG shows 3 circles */}
            {product.inventory_mode === "variation" && product.available_variations.length > 0 ? (
              <div className="mb-5">
                <p className="text-[11px] font-semibold tracking-widest uppercase text-[#313131] mb-3">
                  {product.available_variations[0]?.attribute?.name || "Color"}
                </p>
                <div className="flex gap-2 sm:gap-3 flex-wrap">
                  {product.available_variations.map((v, i) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariation(v.id)}
                      className="relative w-9 h-9 rounded-full border-2 transition-colors flex items-center justify-center"
                      style={{
                        backgroundColor: colorSwatches[i % colorSwatches.length],
                        borderColor: selectedVariation === v.id ? "#D88F65" : "transparent",
                      }}
                      title={locale === "ar" && v.value_ar ? v.value_ar : v.value}
                    >
                      {selectedVariation === v.id && (
                        <Check size={14} className="text-white" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ) : product.inventory_mode === "simple" ? (
              /* For simple products, show color circles as decorative like SVG */
              <div className="flex gap-3 mb-5">
                {colorSwatches.map((color, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(i)}
                    className="w-[33px] h-[33px] rounded-full border-2 transition-all"
                    style={{
                      backgroundColor: color,
                      borderColor: selectedColor === i ? "#D88F65" : "transparent",
                      outline: selectedColor === i ? "2px solid #D88F65" : "none",
                      outlineOffset: 2,
                    }}
                  />
                ))}
              </div>
            ) : null}

            {/* Combinations */}
            {product.inventory_mode === "combination" && product.available_combinations.length > 0 && (
              <div className="mb-5">
                <p className="text-[11px] font-semibold tracking-widest uppercase text-[#313131] mb-3">Options</p>
                <div className="flex flex-wrap gap-2">
                  {product.available_combinations.map((combo) => (
                    <button
                      key={combo.id}
                      onClick={() => setSelectedCombination(combo.id)}
                      className="px-4 py-1.5 text-sm border rounded transition-colors"
                      style={{
                        borderColor: selectedCombination === combo.id ? "#D88F65" : "#D5C9BC",
                        color: selectedCombination === combo.id ? "#D88F65" : "#313131",
                        backgroundColor: selectedCombination === combo.id ? "#FFF5EE" : "white",
                      }}
                    >
                      {combo.label || combo.attributes?.map(a => a.value).join(" / ")}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add to Cart — SVG: teal #88B0BE button w=396 h=52 rx=26 */}
            <div className="flex items-center gap-3 mb-4">
              {/* Quantity — SVG shows +/- circles with D9D9D9 bg */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-[#313131] font-medium"
                  style={{ backgroundColor: "#D9D9D9" }}
                >
                  −
                </button>
                <span className="w-8 text-center text-[#313131] font-medium text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-[#313131] font-medium"
                  style={{ backgroundColor: "#D9D9D9" }}
                >
                  +
                </button>
              </div>

              {/* Add to Cart — SVG: teal #88B0BE, w=396, h=52, rx=26 */}
              <button
                onClick={handleAddToCart}
                disabled={adding || !product.is_available}
                className="flex items-center justify-center gap-2 text-white font-medium text-sm tracking-wide transition-opacity disabled:opacity-50"
                style={{ backgroundColor: "#88B0BE", borderRadius: 26, width: 396, height: 52 }}
              >
                <ShoppingBag size={18} />
                {adding ? "Adding..." : !product.is_available ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>

            {/* Wishlist */}
            <button
              onClick={handleWishlist}
              className="flex items-center gap-2 text-[#313131]/60 hover:text-[#D88F65] transition-colors text-sm"
            >
              <Heart
                size={16}
                className={isWishlisted ? "fill-[#D88F65] text-[#D88F65]" : ""}
              />
              {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            </button>
          </div>
        </div>
      </div>

      {/* RECOMMENDED — SVG: 4-col grid at y=1129 same as homepage */}
      {recommended.length > 0 && (
        <section className="px-8 py-10" style={{ backgroundColor: "#F4F1EA" }}>
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-2xl font-semibold text-[#1A1A1A]"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              You May Also Like
            </h2>
            <a href="/products" className="text-[#D88F65] text-sm font-medium hover:underline flex items-center gap-1">
              View All →
            </a>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {recommended.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} locale={locale} currency={currency} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
