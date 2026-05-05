import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";

interface SidebarNavProps {
	title?: string;
	isCollapsed?: boolean;
	items: {
		to: string;
		label: string;
		Icon: LucideIcon;
		exact?: boolean;
	}[];
}

export function SidebarNav({ title, isCollapsed, items }: SidebarNavProps) {
	return (
		<div className="space-y-1">
			{title && !isCollapsed && (
				<div className="mb-2 px-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/60">
					{title}
				</div>
			)}
			<div className="space-y-0.5">
				{items.map(({ to, label, Icon, exact }) => (
					<Link
						key={to}
						to={to}
						activeOptions={{ exact: exact ?? to === "/dashboard" }}
						activeProps={{
							className: "bg-primary/10 text-primary",
						}}
						inactiveProps={{
							className:
								"text-muted-foreground hover:bg-muted/60 hover:text-foreground",
						}}
						className={`group/nav relative flex items-center gap-2.5 rounded-md transition-all ${
							isCollapsed ? "justify-center px-0 py-2" : "px-3 py-1.5"
						}`}
						title={isCollapsed ? label : undefined}
					>
						{({ isActive }) => (
							<>
								{isActive && (
									<span className="absolute left-0 top-1/2 h-4 w-[2.5px] -translate-y-1/2 rounded-r-full bg-primary shadow-[0_0_8px_var(--primary)]" />
								)}
								<Icon
									className={`h-4 w-4 shrink-0 transition-transform group-hover/nav:scale-110 ${isActive ? "text-primary" : "text-muted-foreground"}`}
									strokeWidth={isActive ? 2 : 1.6}
								/>
								{!isCollapsed && <span className="truncate">{label}</span>}
							</>
						)}
					</Link>
				))}
			</div>
		</div>
	);
}
