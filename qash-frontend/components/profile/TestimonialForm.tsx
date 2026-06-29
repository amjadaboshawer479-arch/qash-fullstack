"use client";
import { useState, useTransition } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";

interface Props {
  locale: string;
  messages: Record<string, Record<string, string>>;
}

export default function TestimonialForm({ locale, messages }: Props) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);
  const isAr = locale === "ar";

  const t = (key: string) => {
    const [ns, k] = key.split(".");
    return (messages[ns]?.[k]) ?? k;
  };

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const title   = (form.elements.namedItem("title")   as HTMLInputElement).value;
    const content = (form.elements.namedItem("content") as HTMLTextAreaElement).value;

    startTransition(async () => {
      try {
        const res = await fetch("/api/testimonials/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content, rating }),
        });
        if (!res.ok) throw new Error("Failed");
        setSubmitted(true);
        toast.success(isAr ? "تم إرسال تقييمك! سيظهر بعد المراجعة." : "Review submitted! It will appear after approval.");
      } catch {
        toast.error(isAr ? "فشل الإرسال، حاول مجدداً" : "Submission failed, please try again.");
      }
    });
  }

  if (submitted) {
    return (
      <div className="bg-white p-6 text-center" style={{ border: "1px solid #E8DED4" }}>
        <p className="text-[#D88F65] font-semibold text-sm">
          {isAr ? "شكراً! تقييمك قيد المراجعة." : "Thank you! Your review is pending approval."}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 mt-6" style={{ border: "1px solid #E8DED4" }}>
      <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4" style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}>
        {isAr ? "اكتب تقييماً" : "Write a Review"}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star rating */}
        <div>
          <p className="text-[11px] font-semibold tracking-widest uppercase text-[#313131] mb-2">
            {isAr ? "التقييم" : "Rating"}
          </p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  size={24}
                  className={
                    star <= (hoverRating || rating)
                      ? "fill-[#D88F65] text-[#D88F65]"
                      : "text-[#D5C9BC] fill-[#D5C9BC]"
                  }
                />
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-[11px] font-semibold tracking-widest uppercase text-[#313131] mb-2">
            {isAr ? "العنوان" : "Title"} *
          </label>
          <input
            name="title"
            required
            minLength={3}
            className="w-full border py-2.5 px-4 text-sm text-[#313131] outline-none focus:border-[#D88F65]"
            style={{ borderColor: "#E8DED4", backgroundColor: "var(--card-bg)" }}
            placeholder={isAr ? "ملخص تجربتك" : "Summarize your experience"}
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-[11px] font-semibold tracking-widest uppercase text-[#313131] mb-2">
            {isAr ? "التقييم" : "Review"} *
          </label>
          <textarea
            name="content"
            required
            minLength={10}
            rows={4}
            className="w-full border py-2.5 px-4 text-sm text-[#313131] outline-none focus:border-[#D88F65] resize-none"
            style={{ borderColor: "#E8DED4", backgroundColor: "var(--card-bg)" }}
            placeholder={isAr ? "شاركنا تجربتك..." : "Share your experience..."}
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 text-white text-sm font-semibold tracking-widest uppercase px-6 py-3 transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: "#D88F65" }}
        >
          <Star size={14} />
          {isPending ? (isAr ? "جاري الإرسال..." : "Submitting...") : (isAr ? "إرسال التقييم" : "Submit Review")}
        </button>
      </form>
    </div>
  );
}
