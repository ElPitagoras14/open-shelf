import { Link } from "@tanstack/react-router";
import { SproutIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ThemeToggle } from "@/features/shared/components/theme-toggle";
import { useNavItems } from "@/features/shared/components/use-nav-items";
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
import { cn } from "@/lib/utils";

const APP_VERSION = __APP_VERSION__;

export function AppSidebar() {
	const { t } = useTranslation();
	const items = useNavItems();

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
							{t("sidebar.tagline")}
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
					{t("sidebar.footer")}
					<br />v{APP_VERSION}
				</p>
			</SidebarFooter>
		</Sidebar>
	);
}
