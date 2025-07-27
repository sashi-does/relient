import { NextResponse } from "next/server"


// #### FROM DODO DOCUMENTATION

export async function POST(req: Request) {
    const data = await req.json()
    console.log(data)
    const event = data.event // Example: 'payment.succeeded'
    console.log(event)
  
    switch (event) {
      case 'payment.succeeded':
        // Create user account or activate subscription
        break
      case 'payment.failed':
        //  Log or notify user
        break
      case 'payment.cancelled':
        // Maybe cleanup or track behavior
        break
      default:
        console.log('Unhandled Dodo event:', event)
    }
  
    return NextResponse.json({ status: 'ok' })
  }