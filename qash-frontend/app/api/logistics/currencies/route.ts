import { NextResponse } from "next/server";
export async function GET() { return NextResponse.json({ results: [{ code: "JOD", symbol: "JD", name: "Jordanian Dinar", exchange_rate: "1.000" }, { code: "USD", symbol: "$", name: "US Dollar", exchange_rate: "1.41" }, { code: "EUR", symbol: "€", name: "Euro", exchange_rate: "1.30" }] }); }
