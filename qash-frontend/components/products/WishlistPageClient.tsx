"use client";
import { useState, useTransition, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Trash2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { removeFromWishlistAction } from "@/actions/wishlist.actions";
import ProductCard from "./ProductCard";
import { useWishlistStore } from "@/stores/wishlist.store";
import type { WishlistItem } from "@/types";

interface Props {
  initialItems: WishlistItem[];
  messages: Record<string, Record<string, string>>;
  locale: string;
  currency: string;
}

export default function WishlistPageClient({ initialItems, messages, locale, currency }: Props) {
  const [items, setItems] = useState<WishlistItem[]>(initialItems);
  const [isPending, startTransition] = useTransition();
  const { removeProduct, setProductIds } = useWishlistStore();

  // Seed wishlist store with server-fetched product IDs
  useEffect(() => {
    setProductIds(initialItems.map((i) => i.product.id));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // SVG: back arrow at cx=60 cy=163.5 (left arrow icon)
  const handleRemove = (productId: number) => {
    startTransition(async () => {
      const result = await removeFromWishlistAction(productId);
      if (result.error) { toast.error(result.error); return; }
      setItems(prev => prev.filter(i => i.product.id !== productId));
      removeProduct(productId);
      toast.success("Removed from wishlist");
    });
  };

  return (
    <div style={{ backgroundColor: "var(--bg)" }} className="min-h-screen">
      <div className="px-8 py-8">
        {/* Back navigation — SVG has back arrow */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/categories" className="flex items-center gap-2 text-[#313131]/60 hover:text-[#313131] transition-colors">
            <ArrowLeft size={20} />
            <span className="text-sm">{locale === "ar" ? "العودة للمتجر" : "Back to Shop"}</span>
          </Link>
        </div>

        <h1
          className="text-3xl font-semibold text-[#1A1A1A] mb-8"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          {locale === "ar" ? "المفضلة" : "Favourites"}
          {items.length > 0 && (
            <span className="text-[#313131]/40 text-xl ml-3">({items.length})</span>
          )}
        </h1>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Heart size={64} className="text-[#D5C9BC] mb-6" />
            <p className="text-[#313131]/60 text-lg mb-6">
              {locale === "ar" ? "قائمة المفضلة فارغة" : "Your wishlist is empty"}
            </p>
            <Link
              href="/categories"
              className="text-white text-sm font-medium px-8 py-3 rounded-full"
              style={{ backgroundColor: "#88B0BE" }}
            >
              {locale === "ar" ? "تصفح المنتجات" : "Browse Products"}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {items.map((item) => (
              <div key={item.id} className="relative group">
                <ProductCard
                  product={item.product}
                  locale={locale}
                  currency={currency}
                  messages={messages}
                  onWishlistRemove={() => handleRemove(item.product.id)}
                />
                <button
                  onClick={() => handleRemove(item.product.id)}
                  disabled={isPending}
                  className="absolute top-3 right-3 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={13} className="text-red-500" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
