import { MoonIcon, SunIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/features/shared/components/theme-provider";
import { Button } from "@/components/ui/button";

export function ThemeToggle({ className }: { className?: string }) {
	const { theme, toggle } = useTheme();
	const { t } = useTranslation();
	return (
		<Button
			variant="ghost"
			size="icon-sm"
			onClick={toggle}
			aria-label={
				theme === "dark" ? t("theme.switchToLight") : t("theme.switchToDark")
			}
			className={className}
		>
			{theme === "dark" ? <SunIcon /> : <MoonIcon />}
		</Button>
	);
}
