import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
	Icon: LucideIcon;
	title: string;
	description: string;
}

export function EmptyState({ Icon, title, description }: EmptyStateProps) {
	return (
		<div className="col-span-full">
			<div className="flex max-w-sm flex-col items-start justify-center rounded-lg border border-dashed border-border px-6 py-10 text-left">
				<div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary ring-1 ring-primary/20">
					<Icon className="h-4 w-4" strokeWidth={1.7} />
				</div>
				<h3 className="text-[13px] font-semibold text-foreground">{title}</h3>
				<p className="mt-1 max-w-xs text-[12px] text-muted-foreground">
					{description}
				</p>
			</div>
		</div>
	);
}
