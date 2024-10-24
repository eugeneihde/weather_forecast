import { NextRequest, NextResponse } from 'next/server'

import { emailTransporter } from '@/config/nodemailer.config'
import { formatDate } from '@/config/config'

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const body = await req.json()
    const { email, weatherData } = body

    await emailTransporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: `14-Tage Wettervorhersage für ${weatherData.location.name}, ${weatherData.location.country}`,
      ...generateEmailContent(weatherData.forecast.forecastday)
    })

    return NextResponse.json({}, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
  }
}

const generateEmailContent = (weatherData: any[]) => {
  const renderedData = weatherData.map((item) => {
    return `
      <div style='margin-bottom: 1rem; display: flex; flex-direction: column; justify-content: center; align-items: center; border-bottom: 1px solid gray'>
        <h3>${formatDate(item.date)}</h5>
        <div style='display: flex; align-items: center; justify-content: center;'>
          <img
            src='https:${item.day.condition.icon}'
            alt='${item.day.condition.text} Icon'
          />
          <p><b>${item.day.maxtemp_c}°</b> / ${item.day.mintemp_c}°</p>
        </div>
        <h3>${item.day.condition.text}</h6>
        <br />
        <p><b>Wind:</b> bis zu ${item.day.maxwind_kph}km/h</p>
        <p><b>Regenwahrscheinlichkeit:</b> ${item.day.daily_chance_of_rain}%</p>
      </div>
    `
  }).join('')

  return {
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <title></title>
          <meta charset="utf-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
          <style type="text/css"> body, table, td, a{-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;}table{border-collapse: collapse !important;}body{height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important;}@media screen and (max-width: 525px){.wrapper{width: 100% !important; max-width: 100% !important;}.responsive-table{width: 100% !important;}.padding{padding: 10px 5% 15px 5% !important;}.section-padding{padding: 0 15px 50px 15px !important;}}.form-container{margin-bottom: 24px; padding: 20px; border: 1px dashed #ccc;}.form-heading{color: #2a2a2a; font-family: "Helvetica Neue", "Helvetica", "Arial", sans-serif; font-weight: 400; text-align: left; line-height: 20px; font-size: 18px; margin: 0 0 8px; padding: 0;}.form-answer{color: #2a2a2a; font-family: "Helvetica Neue", "Helvetica", "Arial", sans-serif; font-weight: 300; text-align: left; line-height: 20px; font-size: 16px; margin: 0 0 24px; padding: 0;}div[style*="margin: 16px 0;"]{margin: 0 !important;}</style>
        </head>
        <body style="margin: 0 !important; padding: 0 !important; background: #fff">
          <div style='display: flex; flex-direction: column; justify-content: center; align-items: center;'>
            ${renderedData}
          </div>
        </body>
      </html>
    `
  }
}