'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { FeatureCard } from '@/components/blocks/grid-feature-cards';
import { ViewAnimationProps } from '@repo/types/ui-types';

const features = [
	{
		title: 'Try Relient Pro',
		icon: '/relient.png',
		description: 'It supports an entire helping developers and innovate.',
	}
];

export default function SubscriptionCard() {
	return (
		<section className="py-16 w-[100%]">
			<div className="mx-auto space-y-8 px-4">
				
				<AnimatedContainer
					delay={0}
					className="divide-dashed border border-dashed sm:grid-cols-2 md:grid-cols-3"
				>
					{features.map((feature, i) => (
						<FeatureCard key={i} feature={feature} />
					))}
				</AnimatedContainer>
			</div>
		</section>
	);
}



function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return children;
	}

	return (
		<motion.div
  initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
  whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
  viewport={{ once: true }}
  transition={{ delay, duration: 0.8 }}
  className={`${className} bg-gradient-to-b border-0 rounded-md from-[#171717] to-[#171717]`}
>
  {children}
</motion.div>
	);
}
