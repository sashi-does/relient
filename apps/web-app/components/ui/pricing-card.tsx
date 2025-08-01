"use client";

import { BadgeCheck, ArrowRight } from "lucide-react";
import NumberFlow from "@number-flow/react";
import { cn } from "@repo/ui/utils";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export interface PricingTier {
  name: string;
  price: Record<string, number | string>;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  popular?: boolean;
  redirect: string;
}

interface PricingCardProps {
  tier: PricingTier;
  paymentFrequency: string;
  isMiddleCard?: boolean;
  at: "landing" | "onboarding";
}

export function PricingCard({
  tier,
  paymentFrequency,
  isMiddleCard,
  at,
}: PricingCardProps) {
  const price = tier.price[paymentFrequency];
  const router = useRouter();
  const isPopular = tier.popular;

  let backgroundClass = "";
  if (isMiddleCard) {
    backgroundClass =
      "bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:45px_45px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]";
  } else if (tier.name.toLowerCase() !== "pro") {
    backgroundClass = "";
  }

  function navigateTo(at: "landing" | "onboarding") {
    console.log("SASASS")
    toast.success("Hehe");
    if (at === "onboarding") {
      return router.push(tier?.redirect as string);
    }
    return router.push("/auth/signin");
  }

  return (
    <Card
      className={cn(
        "relative flex flex-col w-[300px] gap-8 overflow-hidden p-6 rounded-lg shadow-lg bg-background text-foreground",
        isPopular && "ring-2 ring-primary",
        backgroundClass
      )}
    >
      {isMiddleCard && isPopular && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
      )}
      {isPopular && (
        <Badge variant="secondary" className="mt-1 z-10 w-fit">
          🔥 Most Popular
        </Badge>
      )}

      <h2 className="flex items-center gap-3 text-xl font-medium capitalize">
        {tier.name}
      </h2>

      <div className="relative h-12">
        {typeof price === "number" ? (
          <>
            <div className="flex items-baseline gap-1">
              <NumberFlow
                format={{
                  style: "currency",
                  currency: "USD",
                  currencyDisplay: "narrowSymbol",
                  trailingZeroDisplay: "stripIfInteger",
                }}
                value={price}
                className="text-4xl font-medium"
              />
              <span className="text-muted-foreground text-sm mt-1">USD</span>
            </div>
            <p className="-mt-2 text-xs text-muted-foreground">
              Per month/user
            </p>
          </>
        ) : (
          <h1 className="text-4xl font-medium">{price}</h1>
        )}
      </div>

      <div className="flex-1 space-y-2">
        <h3 className="text-sm font-medium">{tier.description}</h3>
        <ul className="space-y-2">
          {tier.features.map((feature, index) => (
            <li
              key={index}
              className={cn(
                "flex items-center gap-2 text-sm font-medium",
                "text-muted-background"
              )}
            >
              <BadgeCheck className="h-4 w-4" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <Button onClick={() => navigateTo(at)} variant={"default"} className="w-full">
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </Card>
  );
}
