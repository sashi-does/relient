export interface BentoItem {
    title: string;
    description: string;
    icon: React.ReactNode;
    status?: string;
    tags?: string[];
    meta?: string;
    cta?: string;
    colSpan?: number;
    hasPersistentHover?: boolean;
}

export interface BentoGridProps {
    items: BentoItem[];
}

export type ViewAnimationProps = {
	delay?: number;
	className?: React.ComponentProps<typeof motion.div>['className'];
	children: React.ReactNode;
};

export type FeatureType = {
	title: string;
	icon: string;
	description: string;
};

export type FeatureCardProps = React.ComponentProps<'div'> & {
	feature: FeatureType;
};