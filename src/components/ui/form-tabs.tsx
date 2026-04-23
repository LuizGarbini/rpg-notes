import { cn } from "@/lib/utils";

interface Tab {
	id: string;
	label: string;
	hint?: string;
}

interface FormTabsProps {
	tabs: Tab[];
	value: string;
	onChange: (id: string) => void;
}

export function FormTabs({ tabs, value, onChange }: FormTabsProps) {
	return (
		<div className="-mx-1 flex flex-wrap gap-1 border-b border-border pb-1.5">
			{tabs.map((t) => {
				const active = t.id === value;
				return (
					<button
						key={t.id}
						type="button"
						onClick={() => onChange(t.id)}
						className={cn(
							"relative rounded-md px-2.5 py-1.5 text-[12px] font-medium transition-colors",
							active
								? "bg-primary/12 text-primary"
								: "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
						)}
					>
						{t.label}
						{active && (
							<span className="absolute -bottom-1.5 left-1/2 h-[2px] w-6 -translate-x-1/2 rounded-full bg-primary" />
						)}
					</button>
				);
			})}
		</div>
	);
}

interface FormSectionProps {
	title: string;
	description?: string;
	children: React.ReactNode;
}

export function FormSection({ title, description, children }: FormSectionProps) {
	return (
		<section className="space-y-3">
			<div>
				<h4 className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground heading-rule">
					{title}
				</h4>
				{description && (
					<p className="mt-2 text-[12px] text-muted-foreground">{description}</p>
				)}
			</div>
			<div className="space-y-3">{children}</div>
		</section>
	);
}

interface FieldProps {
	label: string;
	htmlFor?: string;
	hint?: string;
	className?: string;
	children: React.ReactNode;
}

export function Field({ label, htmlFor, hint, className, children }: FieldProps) {
	return (
		<div className={cn("flex flex-col gap-1.5", className)}>
			<label
				htmlFor={htmlFor}
				className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground"
			>
				{label}
			</label>
			{children}
			{hint && (
				<span className="text-[10px] text-muted-foreground/70">{hint}</span>
			)}
		</div>
	);
}
