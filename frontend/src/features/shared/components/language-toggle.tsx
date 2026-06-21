import { useTranslation } from "react-i18next";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { SUPPORTED_LANGUAGES, type Language } from "@/i18n/resources";
import { setLanguage, useAppData } from "@/lib/store";

const LABELS: Record<Language, string> = { en: "English", es: "Español" };

export function LanguageToggle({ className }: { className?: string }) {
	const { settings } = useAppData();
	const { t } = useTranslation();
	return (
		<Select value={settings.language} onValueChange={(v) => setLanguage(v as Language)}>
			<SelectTrigger className={className} aria-label={t("settings.language.title")}>
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				{SUPPORTED_LANGUAGES.map((l) => (
					<SelectItem key={l} value={l}>
						{LABELS[l]}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
