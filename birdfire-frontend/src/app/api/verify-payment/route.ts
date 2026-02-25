import Stripe from 'stripe'
import { NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const { clientSecret } = await req.json()
  const id = clientSecret.split('_secret')[0]

  const intent = await stripe.paymentIntents.retrieve(id)
  
  const charges = await stripe.charges.list({ payment_intent: id })
  let invoiceUrl = null
  if (charges.data[0] && (charges.data[0] as any).invoice) {
    const invoice = await stripe.invoices.retrieve((charges.data[0] as any).invoice as string)
    invoiceUrl = invoice.hosted_invoice_url
  }

  return NextResponse.json({
    status: intent.status,
    orderNumber: intent.id.slice(-8).toUpperCase(),
    created: new Date(intent.created * 1000).toLocaleDateString(),
    invoiceUrl: invoiceUrl
  })
}