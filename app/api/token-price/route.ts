import { NextResponse } from 'next/server'

export const revalidate = 60 // revalidate every 60 seconds

export async function GET() {
  try {
    // TODO: fetch live data from CoinGecko or BSC on-chain price feed
    // const res = await fetch(
    //   `https://api.coingecko.com/api/v3/simple/price?ids=xdinar&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`,
    //   { headers: { 'x-cg-demo-api-key': process.env.COINGECKO_API_KEY ?? '' } }
    // )

    return NextResponse.json({
      success: true,
      data: {
        price: 0.0,
        change24h: 0.0,
        volume24h: 0,
        marketCap: 0,
        symbol: 'xDINAR',
        lastUpdated: new Date().toISOString(),
      },
    })
  } catch {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch token price.' },
      { status: 500 }
    )
  }
}
