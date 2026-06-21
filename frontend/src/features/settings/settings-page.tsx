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
import { toast } from "sonner";
import { useDialogs } from "@/features/shared/components/dialogs-provider";
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
	const [newCat, setNewCat] = useState("");
	const counts = categoryCounts();

	const addCat = () => {
		const ok = addCategory(newCat);
		if (ok) {
			toast.success("Category added");
			setNewCat("");
		} else if (newCat.trim()) {
			toast.warning("Category already exists");
		}
	};

	return (
		<div className="mx-auto w-full max-w-[680px] p-4 md:px-8 md:py-7">
			<header>
				<h1 className="font-heading text-2xl font-bold">Settings</h1>
				<p className="text-sm text-muted-foreground">
					Preferences and data management
				</p>
			</header>

			<div className="mt-6 flex flex-col gap-4">
				<Card>
					<CardHeader>
						<CardTitle>Expiration warning</CardTitle>
						<CardDescription>
							Products are flagged "Expiring soon" within this many days.
						</CardDescription>
					</CardHeader>
					<CardContent className="flex items-center gap-3">
						<InputGroup className="h-10 w-32">
							<InputGroupAddon>
								<InputGroupButton
									size="icon-sm"
									onClick={() => setWarningDays(data.settings.warningDays - 1)}
									aria-label="Decrease"
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
									aria-label="Increase"
								>
									<PlusIcon />
								</InputGroupButton>
							</InputGroupAddon>
						</InputGroup>
						<span className="text-sm text-muted-foreground">days</span>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Categories</CardTitle>
						<CardDescription>
							Used to organise and filter your inventory.
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
										aria-label={`Remove ${c}`}
										onClick={() => {
											removeCategory(c);
											toast.success("Category removed");
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
								placeholder="New category…"
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
								Add
							</Button>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Data</CardTitle>
						<CardDescription>
							Everything is stored locally on this device. Back up or move it
							with JSON.
						</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-wrap gap-2">
						<Button variant="outline" onClick={() => exportJSON()}>
							<DownloadIcon data-icon="inline-start" />
							Export JSON
						</Button>
						<Button variant="outline" onClick={() => dialogs.importData()}>
							<UploadIcon data-icon="inline-start" />
							Import JSON
						</Button>
						<Button
							variant="ghost"
							onClick={() => {
								reloadSample();
								toast.success("Sample data loaded");
								navigate({ to: "/inventory" });
							}}
						>
							<RotateCcwIcon data-icon="inline-start" />
							Reload sample data
						</Button>
					</CardContent>
				</Card>

				<Card className="border-destructive/30 bg-destructive/5">
					<CardHeader>
						<CardTitle className="text-destructive">Danger zone</CardTitle>
						<CardDescription>
							Permanently remove every product and batch from this device.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button
							variant="outline"
							className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
							onClick={() =>
								dialogs.confirm({
									title: "Delete all data?",
									message:
										"Every product and batch on this device will be permanently erased. This cannot be undone.",
									confirmLabel: "Delete everything",
									danger: true,
									onConfirm: () => {
										deleteAll();
										toast.success("All data deleted");
										navigate({ to: "/" });
									},
								})
							}
						>
							Delete all data
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
