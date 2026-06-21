import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { importJSON } from "@/lib/store";

export function ImportJsonDialog({ onClose }: { onClose: () => void }) {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const [text, setText] = useState("");
	const [error, setError] = useState<string | null>(null);

	const submit = () => {
		const res = importJSON(text);
		if (!res.ok) {
			setError(res.error ?? t("importDialog.importError"));
			return;
		}
		toast.success(t("importDialog.importedToast"));
		onClose();
		navigate({ to: "/inventory" });
	};

	return (
		<Dialog open onOpenChange={(o) => !o && onClose()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("importDialog.title")}</DialogTitle>
					<DialogDescription>
						{t("importDialog.description")}
					</DialogDescription>
				</DialogHeader>

				<div className="py-4">
					<Textarea
						autoFocus
						className="h-40 font-mono text-xs"
						placeholder={t("importDialog.placeholder")}
						value={text}
						onChange={(e) => {
							setText(e.target.value);
							setError(null);
						}}
					/>
					{error && <p className="mt-2 text-sm text-destructive">{error}</p>}
				</div>

				<DialogFooter>
					<Button type="button" variant="outline" onClick={onClose}>
						{t("common.cancel")}
					</Button>
					<Button type="button" onClick={submit}>
						{t("importDialog.importButton")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
