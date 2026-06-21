import { useNavigate } from "@tanstack/react-router";
import {
	DownloadIcon,
	MinusIcon,
	PlusIcon,
	RotateCcwIcon,
	UploadIcon,
	XIcon,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useDialogs } from "@/features/shared/components/dialogs-provider";
import { LanguageToggle } from "@/features/shared/components/language-toggle";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@/components/ui/input-group";
import {
	addCategory,
	categoryCounts,
	deleteAll,
	exportJSON,
	reloadSample,
	removeCategory,
	setWarningDays,
	useAppData,
} from "@/lib/store";

export function SettingsPage() {
	const data = useAppData();
	const dialogs = useDialogs();
	const navigate = useNavigate();
	const { t } = useTranslation();
	const [newCat, setNewCat] = useState("");
	const counts = categoryCounts();

	const addCat = () => {
		const ok = addCategory(newCat);
		if (ok) {
			toast.success(t("settings.categories.addedToast"));
			setNewCat("");
		} else if (newCat.trim()) {
			toast.warning(t("settings.categories.existsToast"));
		}
	};

	return (
		<div className="mx-auto w-full max-w-[680px] p-4 md:px-8 md:py-7">
			<header>
				<h1 className="font-heading text-2xl font-bold">{t("settings.title")}</h1>
				<p className="text-sm text-muted-foreground">
					{t("settings.subtitle")}
				</p>
			</header>

			<div className="mt-6 flex flex-col gap-4">
				<Card>
					<CardHeader>
						<CardTitle>{t("settings.language.title")}</CardTitle>
						<CardDescription>{t("settings.language.description")}</CardDescription>
					</CardHeader>
					<CardContent>
						<LanguageToggle className="w-48" />
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>{t("settings.warning.title")}</CardTitle>
						<CardDescription>
							{t("settings.warning.description")}
						</CardDescription>
					</CardHeader>
					<CardContent className="flex items-center gap-3">
						<InputGroup className="h-10 w-32">
							<InputGroupAddon>
								<InputGroupButton
									size="icon-sm"
									onClick={() => setWarningDays(data.settings.warningDays - 1)}
									aria-label={t("common.decrease")}
								>
									<MinusIcon />
								</InputGroupButton>
							</InputGroupAddon>
							<InputGroupInput
								type="number"
								min="1"
								max="365"
								className="text-center font-mono tabular-nums"
								value={data.settings.warningDays}
								onChange={(e) => setWarningDays(Number(e.target.value))}
							/>
							<InputGroupAddon align="inline-end">
								<InputGroupButton
									size="icon-sm"
									onClick={() => setWarningDays(data.settings.warningDays + 1)}
									aria-label={t("common.increase")}
								>
									<PlusIcon />
								</InputGroupButton>
							</InputGroupAddon>
						</InputGroup>
						<span className="text-sm text-muted-foreground">{t("settings.warning.unit")}</span>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>{t("settings.categories.title")}</CardTitle>
						<CardDescription>
							{t("settings.categories.description")}
						</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col gap-4">
						<div className="flex flex-wrap gap-2">
							{data.categories.map((c) => (
								<Badge
									key={c}
									variant="secondary"
									className="gap-1.5 py-1 pr-1 pl-2.5"
								>
									{c}
									<span className="font-mono text-muted-foreground tabular-nums">
										{counts[c] ?? 0}
									</span>
									<button
										type="button"
										aria-label={t("common.remove", { name: c })}
										onClick={() => {
											removeCategory(c);
											toast.success(t("settings.categories.removedToast"));
										}}
										className="flex size-4 items-center justify-center rounded-full hover:bg-foreground/10"
									>
										<XIcon className="size-3" />
									</button>
								</Badge>
							))}
						</div>
						<div className="flex gap-2">
							<Input
								placeholder={t("settings.categories.placeholder")}
								value={newCat}
								onChange={(e) => setNewCat(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										e.preventDefault();
										addCat();
									}
								}}
							/>
							<Button variant="outline" onClick={addCat}>
								{t("common.add")}
							</Button>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>{t("settings.data.title")}</CardTitle>
						<CardDescription>
							{t("settings.data.description")}
						</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-wrap gap-2">
						<Button variant="outline" onClick={() => exportJSON()}>
							<DownloadIcon data-icon="inline-start" />
							{t("settings.data.exportJSON")}
						</Button>
						<Button variant="outline" onClick={() => dialogs.importData()}>
							<UploadIcon data-icon="inline-start" />
							{t("settings.data.importJSON")}
						</Button>
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button variant="ghost">
									<RotateCcwIcon data-icon="inline-start" />
									{t("settings.data.loadSample")}
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>{t("settings.data.loadSampleTitle")}</AlertDialogTitle>
									<AlertDialogDescription>
										{t("settings.data.loadSampleMsg")}
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
									<AlertDialogAction
										variant="destructive"
										onClick={() => {
											reloadSample();
											toast.success(t("settings.data.loadedToast"));
											navigate({ to: "/inventory" });
										}}
									>
										{t("settings.data.loadSampleConfirm")}
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</CardContent>
				</Card>

				<Card className="border-destructive/30 bg-destructive/5">
					<CardHeader>
						<CardTitle className="text-destructive">{t("settings.danger.title")}</CardTitle>
						<CardDescription>
							{t("settings.danger.description")}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button
							variant="outline"
							className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
							onClick={() =>
								dialogs.confirm({
									title: t("settings.danger.deleteAllTitle"),
									message: t("settings.danger.deleteAllMsg"),
									confirmLabel: t("settings.danger.deleteAllConfirm"),
									danger: true,
									onConfirm: () => {
										deleteAll();
										toast.success(t("settings.danger.deletedToast"));
										navigate({ to: "/" });
									},
								})
							}
						>
							{t("settings.danger.deleteAll")}
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
