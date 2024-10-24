import axios from 'axios'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const body = await req.json()
    const { weatherLocation } = body
    const response = await axios.get(
      `https://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHER_API_KEY}&q=${weatherLocation}&days=14&lang=de`,
      {
        validateStatus: (status) => {
          return status >= 200 && status < 500
        }
      }
    )

    if (response.data?.error?.code === 1006) {
      return NextResponse.json({}, { status: 404 })
    }

    if (response.status === 200) {
      return NextResponse.json({ data: response.data }, { status: 200 })
    } else {
      return NextResponse.json({}, { status: response.status })
    }
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}