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
    },
    {
      id: "pro",
      name: "Pro",
      price: {
        monthly: 29,
        yearly: 24,
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
    },
  ]
  
