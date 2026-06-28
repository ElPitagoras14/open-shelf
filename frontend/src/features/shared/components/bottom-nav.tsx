import { Link } from "@tanstack/react-router";
import { useNavItems } from "@/features/shared/components/use-nav-items";
import { cn } from "@/lib/utils";

/** Mobile-only bottom navigation bar mirroring the desktop sidebar items. */
export function BottomNav() {
	const items = useNavItems();

	return (
		<nav className="fixed inset-x-0 bottom-0 z-50 shrink-0 border-t bg-sidebar pb-[env(safe-area-inset-bottom)] text-sidebar-foreground md:hidden">
			<ul className="flex items-stretch">
				{items.map((item) => (
					<li key={item.to} className="flex-1">
						<Link
							to={item.to}
							aria-current={item.active ? "page" : undefined}
							className={cn(
								"relative flex flex-col items-center gap-1 px-1 py-2 text-xs transition-colors",
								item.active
									? "text-sidebar-accent-foreground"
									: "text-muted-foreground hover:text-foreground",
							)}
						>
							<span className="relative">
								<item.icon className="size-5" />
								{item.badge != null && (
									<span
										className={cn(
											"absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-medium tabular-nums",
											item.alert
												? "bg-status-expired text-status-expired-fg"
												: "bg-sidebar-accent text-sidebar-accent-foreground",
										)}
									>
										{item.badge}
									</span>
								)}
							</span>
							<span className="truncate">{item.label}</span>
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
}
