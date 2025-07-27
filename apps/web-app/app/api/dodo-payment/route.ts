// app/api/webhook/subscription/route.ts
import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { randomUUID } from 'crypto'
import { prisma } from '@repo/db/prisma'

export async function POST(req: Request) {
    try {
        const body = await req.json()

        console.log(body)

        if (body.type !== 'subscription.active') {
            return NextResponse.json({ error: 'Invalid event type' }, { status: 400 })
        }

        if (body.type === 'payment.succeeded') {
            const subscription = body.data
            const { email, name } = subscription.customer

            // Check if user exists
            let user = await prisma.user.findFirst({ where: { email } })

            if (!user) {
                // Create user with random password (since no auth flow)
                user = await prisma.user.create({
                    data: {
                        email,
                        username: name,
                        //   password: await hash(randomUUID(), 10), // hashed random string
                        plan: 'PRO',
                    },
                })
            }

            // Create billing
            const billing = await prisma.billing.create({
                data: {
                    city: subscription.billing.city,
                    country: subscription.billing.country,
                    state: subscription.billing.state,
                    street: subscription.billing.street,
                    zipcode: subscription.billing.zipcode,
                },
            })

            // Create subscription
            await prisma.subscription.create({
                data: {
                    customerId: subscription.customer.customer_id,
                    userId: user.id,
                    paymentId: subscription.subscription_id,
                    paymentType: 'CARD', // Assuming only card for now, else use metadata or pass it
                    nextBillingDate: new Date(subscription.next_billing_date),
                    status: subscription.status,
                    cardIssuingCountry: null,
                    cardNetwork: null,
                    billingId: billing.id,
                    startDate: new Date(subscription.created_at),
                },
            })

            return NextResponse.json({ message: 'Subscription recorded' }, { status: 200 })
        }
    } catch (err) {
        console.error('Webhook error:', err)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
