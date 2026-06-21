import { createRootRoute, Outlet } from "@tanstack/react-router";
import { useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import { toast } from "sonner";
import { AppSidebar } from "@/features/shared/components/app-sidebar";
import { DialogsProvider } from "@/features/shared/components/dialogs-provider";
import { ThemeProvider } from "@/features/shared/components/theme-provider";
import { ThemedToaster } from "@/features/shared/components/themed-toaster";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useInstallPrompt } from "@/hooks/use-install-prompt";
import i18n from "@/i18n";
import "../styles.css";

export const Route = createRootRoute({
	component: RootComponent,
});

function RootComponent() {
	const { canInstall, install } = useInstallPrompt();

	useEffect(() => {
		if (canInstall) {
			toast("Install Open Shelf", {
				description: "Add to your home screen for offline access",
				action: { label: "Install", onClick: install },
				duration: Number.POSITIVE_INFINITY,
			});
		}
	}, [canInstall, install]);

	return (
		<I18nextProvider i18n={i18n}>
		<ThemeProvider>
			<TooltipProvider delayDuration={300}>
				<SidebarProvider>
					<AppSidebar />
					<SidebarInset>
						<DialogsProvider>
							<header className="flex h-12 shrink-0 items-center gap-2 border-b px-3 md:hidden">
								<SidebarTrigger />
								<span className="font-heading text-sm font-semibold">
									Open Shelf
								</span>
							</header>
							<div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
								<Outlet />
							</div>
						</DialogsProvider>
					</SidebarInset>
					<ThemedToaster />
				</SidebarProvider>
			</TooltipProvider>
		</ThemeProvider>
		</I18nextProvider>
	);
}
