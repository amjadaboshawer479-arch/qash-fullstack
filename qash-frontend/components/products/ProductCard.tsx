"use client";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useWishlistStore } from "@/stores/wishlist.store";
import { useCartStore } from "@/stores/cart.store";
import { addToCartAction } from "@/actions/cart.actions";
import { addToWishlistAction, removeFromWishlistAction } from "@/actions/wishlist.actions";
import type { ProductListItem } from "@/types";

interface Props {
  product: ProductListItem;
  locale?: string;
  currency?: string;
  messages?: Record<string, Record<string, string>>;
  onWishlistRemove?: () => void;
}

export default function ProductCard({ product, locale = "en", currency = "JD", messages, onWishlistRemove }: Props) {
  const { hasProduct, addProduct, removeProduct } = useWishlistStore();
  const { incrementCount } = useCartStore();
  const isWishlisted = hasProduct(product.id);

  const productWithAr = product as typeof product & { name_ar?: string };
  const name = locale === "ar" && productWithAr.name_ar ? productWithAr.name_ar : product.name;
  const price = product.discount_price || product.base_price;
  const hasDiscount = product.has_discount && product.discount_price;
  const isBestSeller = product.best_seller;

  async function handleCart(e: React.MouseEvent) {
    e.preventDefault();
    const result = await addToCartAction({ product_id: product.id, quantity: 1 });
    if (result.error) { toast.error(result.error); return; }
    incrementCount();
    toast.success("Added to cart");
  }

  async function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    if (isWishlisted) {
      const r = await removeFromWishlistAction(product.id);
      if (r.error) { toast.error(r.error); return; }
      removeProduct(product.id);
      onWishlistRemove?.();
      toast.success("Removed from wishlist");
    } else {
      const r = await addToWishlistAction(product.id);
      if (r.error) { toast.error(r.error); return; }
      addProduct(product.id);
      toast.success("Added to wishlist");
    }
  }

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      {/* Image container — SVG: 233×301px */}
      <div className="relative overflow-hidden bg-[#F4F1EA]" style={{ height: 301 }}>
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="233px"
          />
        ) : (
          <div className="w-full h-full bg-[#F4F1EA] flex items-center justify-center">
            <ShoppingBag size={40} className="text-[#D88F65]/30" />
          </div>
        )}

        {/* Best seller badge */}
        {isBestSeller && (
          <div
            className="absolute top-3 left-3 px-2 py-0.5 text-white text-[11px] font-medium tracking-wide"
            style={{ backgroundColor: "#D88E63" }}
          >
            Best Seller
          </div>
        )}

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-colors shadow-sm opacity-0 group-hover:opacity-100"
        >
          <Heart
            size={15}
            className={isWishlisted ? "fill-[#D88F65] text-[#D88F65]" : "text-[#313131]"}
          />
        </button>

        {/* Add to cart overlay */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleCart}
            className="w-full py-2.5 text-white text-[12px] font-medium tracking-wider flex items-center justify-center gap-2"
            style={{ backgroundColor: "#D88F65" }}
          >
            <ShoppingBag size={14} />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Product info — below image */}
      <div className="pt-3 pb-2">
        <h3
          className="text-[#313131] text-[13px] font-medium leading-tight mb-1 line-clamp-2"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          {name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-[#D88F65] text-[14px] font-semibold">
            {currency} {parseFloat(price).toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-[#999] text-[12px] line-through">
              {currency} {parseFloat(product.base_price).toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
