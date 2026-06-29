import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({
    count: 2,
    next: null,
    previous: null,
    results: [
      { id: 1, name: "Color", name_ar: "اللون", values: [{ id: 1, value: "Red", value_ar: "أحمر" }, { id: 2, value: "Blue", value_ar: "أزرق" }, { id: 3, value: "White", value_ar: "أبيض" }, { id: 4, value: "Black", value_ar: "أسود" }] },
      { id: 2, name: "Size", name_ar: "المقاس", values: [{ id: 5, value: "S", value_ar: "S" }, { id: 6, value: "M", value_ar: "M" }, { id: 7, value: "L", value_ar: "L" }, { id: 8, value: "XL", value_ar: "XL" }] },
    ],
  });
}
