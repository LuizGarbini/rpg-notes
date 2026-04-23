import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface PageHeaderProps {
	title: string;
	description: string;
	Icon: LucideIcon;
	iconColor?: string;
	action?: ReactNode;
	count?: number;
	eyebrow?: string;
}

export function PageHeader({
	title,
	description,
	Icon,
	iconColor = "text-primary",
	action,
	count,
	eyebrow,
}: PageHeaderProps) {
	return (
		<header className="flex flex-col gap-3 border-b border-border/70 px-6 py-5 sm:flex-row sm:items-end sm:justify-between">
			<div className="min-w-0">
				<div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
					<Icon className={`h-3 w-3 ${iconColor}`} strokeWidth={1.8} />
					<span>{eyebrow ?? "Coleção"}</span>
				</div>
				<div className="mt-1 flex items-center gap-2.5">
					<h1 className="font-display text-2xl font-bold tracking-tight">
						<span className="text-gradient-primary">{title}</span>
					</h1>
					{typeof count === "number" && (
						<span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-primary ring-1 ring-primary/20">
							{count}
						</span>
					)}
				</div>
				<p className="mt-1 text-[13px] text-muted-foreground">{description}</p>
			</div>

			{action && <div className="shrink-0">{action}</div>}
		</header>
	);
}
