import { createRootRoute, Outlet } from "@tanstack/react-router";
import { I18nextProvider } from "react-i18next";
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
import i18n from "@/i18n";
import "../styles.css";

export const Route = createRootRoute({
	component: RootComponent,
});

function RootComponent() {
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
