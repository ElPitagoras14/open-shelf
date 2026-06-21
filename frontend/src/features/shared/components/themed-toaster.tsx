import { Toaster } from "@/components/ui/sonner";
import { useTheme } from "./theme-provider";

export function ThemedToaster() {
	const { theme } = useTheme();
	return <Toaster theme={theme} position="bottom-left" richColors />;
}
