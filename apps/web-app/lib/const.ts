export const PAYMENT_FREQUENCIES = ["monthly", "yearly"]

export const TIERS = [
    {
      id: "free",
      name: "Free",
      price: {
        monthly: "Free",
        yearly: "Free",
      },
      description: "For individuals or early-stage agencies exploring Relient.",
      features: [
        "Tasks & Leads modules",
        "Email notifications",
        "Up to 3 client portals",
        "Up to 3 client seats",
      ],
      cta: "Start for Free",
      redirect: `${process.env.NEXTAUTH_URL}/signup`,
    },
    {
      id: "pro",
      name: "Pro",
      price: {
        monthly: 19,
        yearly: 14,
      },
      description: "Designed for small agencies with growing client needs.",
      features: [
        "Tasks, Leads, Feedback & Payments modules",
        "Email & in-app notifications",
        "Up to 10 client portals",
        "Client feedback collection",
        "Custom branding",
        "Up to 5 team seats",
      ],
      cta: "Upgrade to Pro",
      popular: true,
      redirect: 'https://test.checkout.dodopayments.com/buy/pdt_0gs459yHsoatjXdY2OEB8?quantity=1&redirect_url=https://relient.in%2Fdashboard'
    },
    {
      id: "scale",
      name: "Scale",
      price: {
        monthly: 59,
        yearly: 49,
      },
      description: "Best for scaling agencies that need unlimited flexibility.",
      features: [
        "Everything in Pro",
        "Unlimited client portals",
        "Fully customizable portal design",
        "Advanced permissions & roles",
        "White-label branding",
        "Priority support",
      ],
      cta: "Get Scale",
      highlighted: true,
      redirect: 'https://test.checkout.dodopayments.com/buy/pdt_0gs459yHsoatjXdY2OEB8?quantity=1&redirect_url=https://relient.in%2Fdashboard'
    },
  ]
  
