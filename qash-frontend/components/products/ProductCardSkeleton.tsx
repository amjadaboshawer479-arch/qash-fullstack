export default function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Image placeholder — matches SVG card height 301px */}
      <div className="bg-[#F4F1EA]" style={{ height: 301 }} />
      <div className="pt-3 pb-2 space-y-2">
        <div className="h-3.5 bg-[#E8DED4] rounded w-3/4" />
        <div className="h-3.5 bg-[#E8DED4] rounded w-1/3" />
      </div>
    </div>
  );
}
