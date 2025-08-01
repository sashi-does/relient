import { NextResponse } from 'next/server'
import { prisma } from '@repo/db/prisma'

export async function POST(req: Request) {
    try {
        const body = await req.json()

        console.log(body)

        if (body.type !== 'subscription.active') {
            return NextResponse.json({ error: 'Invalid event type' }, { status: 400 })
        }

        const subscription = body.data

        const billing = await prisma.billing.create({
            data: {
                city: subscription.billing.city,
                country: subscription.billing.country,
                state: subscription.billing.state,
                street: subscription.billing.street,
                zipcode: subscription.billing.zipcode,
            },
        })

        await prisma.subscription.create({
            data: {
                customerId: subscription.customer.customer_id,
                userId: subscription.customer.user_id,
                paymentId: subscription.subscription_id,
                paymentType: 'CARD',
                nextBillingDate: new Date(subscription.next_billing_date),
                status: subscription.status,
                cardIssuingCountry: null,
                cardNetwork: null,
                billingId: billing.id,
                startDate: new Date(subscription.created_at),
            },
        })

        return NextResponse.json({ message: 'Subscription recorded' }, { status: 200 })

    } catch (err) {
        console.error('Webhook error:', err)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
