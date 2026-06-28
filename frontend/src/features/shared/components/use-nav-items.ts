import { useRouterState } from "@tanstack/react-router";
import {
	BellIcon,
	LayoutDashboardIcon,
	PackageIcon,
	Settings2Icon,
	type LucideIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { attentionCount } from "@/lib/pantry";
import { useAppData } from "@/lib/store";

export interface NavItem {
	label: string;
	to: string;
	icon: LucideIcon;
	active: boolean;
	badge: number | null;
	alert?: boolean;
}

/** Navigation items shared by the desktop sidebar and the mobile bottom nav. */
export function useNavItems(): NavItem[] {
	const data = useAppData();
	const { t } = useTranslation();
	const pathname = useRouterState({ select: (s) => s.location.pathname });

	const productCount = data.products.length;
	const attnCount = attentionCount(data.products, data.settings.warningDays);

	const isInventory =
		pathname === "/inventory" || pathname.startsWith("/product");

	return [
		{
			label: t("sidebar.dashboard"),
			to: "/",
			icon: LayoutDashboardIcon,
			active: pathname === "/",
			badge: null,
		},
		{
			label: t("sidebar.inventory"),
			to: "/inventory",
			icon: PackageIcon,
			active: isInventory,
			badge: productCount || null,
		},
		{
			label: t("sidebar.alerts"),
			to: "/alerts",
			icon: BellIcon,
			active: pathname === "/alerts",
			badge: attnCount || null,
			alert: true,
		},
		{
			label: t("sidebar.settings"),
			to: "/settings",
			icon: Settings2Icon,
			active: pathname === "/settings",
			badge: null,
		},
	];
}
