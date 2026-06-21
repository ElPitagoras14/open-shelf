import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "@/features/shared/components/theme-provider";
import { Button } from "@/components/ui/button";

export function ThemeToggle({ className }: { className?: string }) {
	const { theme, toggle } = useTheme();
	return (
		<Button
			variant="ghost"
			size="icon-sm"
			onClick={toggle}
			aria-label={
				theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
			}
			className={className}
		>
			{theme === "dark" ? <SunIcon /> : <MoonIcon />}
		</Button>
	);
}
