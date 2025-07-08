import { cn } from '@repo/ui/utils';
import React from 'react';
import Image from 'next/image';
import { Button } from '@repo/ui/button';
import GridPattern from "@repo/ui/grid-pattern"
import { FeatureCardProps } from '@repo/types/ui-types';



export function FeatureCard({ feature, className, ...props }: FeatureCardProps) {
	const p = genRandomPattern();

	return (
		<div className={cn('relative overflow-hidden p-6 text-center', className)} {...props}>
			<div className="pointer-events-none absolute top-0 left-1/2 -mt-2 -ml-20 h-full w-full [mask-image:linear-gradient(white,transparent)]">
				<div className="from-foreground/5 to-foreground/1 absolute inset-0 bg-gradient-to-r [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] opacity-100">
					<GridPattern
						width={20}
						height={20}
						x="-12"
						y="4"
						squares={p}
						className="fill-foreground/5 stroke-foreground/25 absolute inset-0 h-full w-full mix-blend-overlay"
					/>
				</div>
			</div>
			<div className='flex flex-col items-center'>
				<Image
					alt="logo"
					src={feature.icon}
					height={30}
					width={30}
					className="text-foreground/75 size-6"
					aria-hidden
				/>
				<h3 className="mt-10 text-sm md:text-base">{feature.title}</h3>
				<p className="text-muted-foreground relative z-20 mt-2 text-xs font-light">{feature.description}</p>
				<Button className='m-auto my-5 mx-auto bg-white text-black cursor-pointer text-center'>See plans</Button>
			</div>
		</div>
	);
}


function genRandomPattern(length?: number): number[][] {
	length = length ?? 5;
	return Array.from({ length }, () => [
		Math.floor(Math.random() * 4) + 7, 
		Math.floor(Math.random() * 6) + 1,
	]);
}
