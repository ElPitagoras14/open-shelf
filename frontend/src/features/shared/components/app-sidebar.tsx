import { Link, useRouterState } from "@tanstack/react-router";
import {
	BellIcon,
	LayoutDashboardIcon,
	PackageIcon,
	Settings2Icon,
	SproutIcon,
} from "lucide-react";
import { ThemeToggle } from "@/features/shared/components/theme-toggle";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuBadge,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { attentionCount } from "@/lib/pantry";
import { useAppData } from "@/lib/store";
import { cn } from "@/lib/utils";

const APP_VERSION = "1.0.0";

export function AppSidebar() {
	const data = useAppData();
	const pathname = useRouterState({ select: (s) => s.location.pathname });

	const productCount = data.products.length;
	const attnCount = attentionCount(data.products, data.settings.warningDays);

	const isInventory =
		pathname === "/inventory" || pathname.startsWith("/product");

	const items = [
		{
			label: "Dashboard",
			to: "/",
			icon: LayoutDashboardIcon,
			active: pathname === "/",
			badge: null as number | null,
		},
		{
			label: "Inventory",
			to: "/inventory",
			icon: PackageIcon,
			active: isInventory,
			badge: productCount || null,
		},
		{
			label: "Alerts",
			to: "/alerts",
			icon: BellIcon,
			active: pathname === "/alerts",
			badge: attnCount || null,
			alert: true,
		},
		{
			label: "Settings",
			to: "/settings",
			icon: Settings2Icon,
			active: pathname === "/settings",
			badge: null as number | null,
		},
	];

	return (
		<Sidebar>
			<SidebarHeader className="p-4">
				<div className="flex items-center gap-3">
					<div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
						<SproutIcon className="size-5" />
					</div>
					<div className="flex flex-col leading-tight">
						<span className="font-heading text-sm font-bold">Open Shelf</span>
						<span className="text-xs text-muted-foreground">
							Pantry tracker
						</span>
					</div>
					<ThemeToggle className="ml-auto" />
				</div>
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarMenu className="gap-1">
						{items.map((item) => (
							<SidebarMenuItem key={item.to}>
								<SidebarMenuButton
									asChild
									isActive={item.active}
									tooltip={item.label}
								>
									<Link to={item.to}>
										<item.icon />
										<span>{item.label}</span>
									</Link>
								</SidebarMenuButton>
								{item.badge != null && (
									<SidebarMenuBadge
										className={cn(
											"tabular-nums",
											item.alert
												? "bg-status-expired text-status-expired-fg"
												: "bg-sidebar-accent text-sidebar-accent-foreground",
										)}
									>
										{item.badge}
									</SidebarMenuBadge>
								)}
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter className="p-4">
				<p className="text-xs text-muted-foreground">
					Offline · local-first
					<br />v{APP_VERSION}
				</p>
			</SidebarFooter>
		</Sidebar>
	);
}
