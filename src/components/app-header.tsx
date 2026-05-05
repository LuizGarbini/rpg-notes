import {
	Bell,
	CheckCircle2,
	CreditCard,
	Info,
	LogOut,
	PanelLeftClose,
	PanelLeftOpen,
	Search,
	Settings,
	User,
} from "lucide-react";
import { Button, buttonVariants } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";

interface AppHeaderProps {
	isSidebarOpen: boolean;
	onToggleSidebar: () => void;
}

export function AppHeader({ isSidebarOpen, onToggleSidebar }: AppHeaderProps) {
	return (
		<header className="sticky top-0 z-50 flex h-14 w-full items-center justify-between border-b border-border/40 bg-background/20 px-6 backdrop-blur-md">
			<div className="flex flex-1 items-center gap-4">
				<Button
					variant="ghost"
					size="icon"
					onClick={onToggleSidebar}
					className="h-8 w-8 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
				>
					{isSidebarOpen ? (
						<PanelLeftClose className="h-4 w-4" />
					) : (
						<PanelLeftOpen className="h-4 w-4" />
					)}
				</Button>

				<div className="h-4 w-[1px] bg-border/40" />

				<div className="relative w-full max-w-sm">
					<Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
					<div className="flex h-9 w-full items-center gap-2 rounded-md border border-input bg-background/50 px-8 text-[13px] text-muted-foreground transition-all focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/30">
						<span>Pesquisar no Grimório...</span>
						<kbd className="pointer-events-none ml-auto hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
							<span className="text-xs">⌘</span>K
						</kbd>
					</div>
				</div>
			</div>

			<div className="flex items-center gap-3">
				<Popover>
					<PopoverTrigger
						className={cn(
							buttonVariants({ variant: "ghost", size: "icon" }),
							"relative h-8 w-8 text-muted-foreground hover:bg-muted/60 hover:text-foreground",
						)}
					>
						<Bell className="h-4 w-4" />
						<span className="absolute right-2 top-2 flex h-1.5 w-1.5 rounded-full bg-primary" />
					</PopoverTrigger>
					<PopoverContent className="w-80 p-0" align="end">
						<div className="flex items-center justify-between border-b border-border/50 px-4 py-2.5">
							<span className="text-xs font-bold uppercase tracking-wider text-foreground">
								Notificações
							</span>
							<button className="text-[10px] font-bold text-primary hover:underline">
								Marcar todas como lidas
							</button>
						</div>
						<div className="max-h-[300px] overflow-y-auto">
							<NotificationItem
								icon={<CheckCircle2 className="h-3 w-3 text-emerald-400" />}
								time="12 min atrás"
								title="Ficha Sincronizada"
								description="As alterações de Elara Moonwhisper foram salvas no reino."
							/>
							<NotificationItem
								icon={<Info className="h-3 w-3 text-blue-400" />}
								time="2 horas atrás"
								title="Nova Lore Disponível"
								description="Um novo fragmento de história foi adicionado pelo Mestre."
							/>
						</div>
					</PopoverContent>
				</Popover>

				<div className="h-4 w-[1px] bg-border/40 mx-1" />

				<DropdownMenu>
					<DropdownMenuTrigger
						className={cn(
							"flex h-8 w-8 items-center justify-center rounded-full transition-opacity hover:opacity-80 focus:outline-none",
							"border border-border/60 overflow-hidden",
						)}
					>
						<Avatar className="h-full w-full">
							<AvatarImage src="" />
							<AvatarFallback className="bg-primary/10 text-[10px] font-bold text-primary">
								LG
							</AvatarFallback>
						</Avatar>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-56" align="end">
						<DropdownMenuGroup>
							<DropdownMenuLabel className="font-normal">
								<div className="flex items-center gap-3 px-1 py-1.5">
									<Avatar className="h-9 w-9 border border-border/60">
										<AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
											LG
										</AvatarFallback>
									</Avatar>
									<div className="flex flex-col space-y-0.5">
										<p className="text-sm font-bold text-foreground">
											Luiz Garbini
										</p>
										<p className="text-xs text-muted-foreground truncate">
											luiz@grimoire.rpg
										</p>
									</div>
								</div>
							</DropdownMenuLabel>
						</DropdownMenuGroup>
						<DropdownMenuSeparator className="bg-border/50" />
						<DropdownMenuGroup>
							<DropdownMenuItem className="gap-2 text-xs font-medium focus:bg-primary/10 focus:text-primary cursor-pointer">
								<User className="h-3.5 w-3.5" />
								<span>Minha Conta</span>
							</DropdownMenuItem>
							<DropdownMenuItem className="gap-2 text-xs font-medium focus:bg-primary/10 focus:text-primary cursor-pointer">
								<Settings className="h-3.5 w-3.5" />
								<span>Configurações</span>
							</DropdownMenuItem>
							<DropdownMenuItem className="gap-2 text-xs font-medium focus:bg-primary/10 focus:text-primary cursor-pointer">
								<CreditCard className="h-3.5 w-3.5" />
								<span>Plano & Assinatura</span>
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator className="bg-border/50" />
						<DropdownMenuItem
							variant="destructive"
							className="gap-2 text-xs font-bold cursor-pointer"
						>
							<LogOut className="h-3.5 w-3.5" />
							<span>Sair do Grimório</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	);
}

function NotificationItem({
	icon,
	time,
	title,
	description,
}: { icon: React.ReactNode; time: string; title: string; description: string }) {
	return (
		<div className="flex gap-3 border-b border-border/40 p-3 transition-colors hover:bg-muted/30">
			<div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-background/50 ring-1 ring-border/60">
				{icon}
			</div>
			<div className="flex flex-1 flex-col gap-0.5">
				<div className="flex items-center justify-between gap-2">
					<span className="text-[11px] font-bold text-foreground">{title}</span>
					<span className="text-[9px] text-muted-foreground whitespace-nowrap">
						{time}
					</span>
				</div>
				<p className="text-[11px] leading-relaxed text-muted-foreground">
					{description}
				</p>
			</div>
		</div>
	);
}
