import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: 'Razorpay credentials not configured' },
        { status: 500 }
      )
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    })

    const { amount, items } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      )
    }

    // Amount in paisa (1 INR = 100 paisa)
    const amountInPaisa = Math.round(amount)

    // Generate unique receipt code
    const receiptCode = `SUITBLISS-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amountInPaisa,
      currency: 'INR',
      receipt: receiptCode,
      notes: {
        items_count: items?.length || 0,
        app: 'Suit Bliss',
      },
    })

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
    })
  } catch (error) {
    console.error('Razorpay Order Creation Error:', error)
    return NextResponse.json(
      { error: 'Failed to create order', details: String(error) },
      { status: 500 }
    )
  }
}
