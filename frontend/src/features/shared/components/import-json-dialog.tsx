import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
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
	const [text, setText] = useState("");
	const [error, setError] = useState<string | null>(null);

	const submit = () => {
		const res = importJSON(text);
		if (!res.ok) {
			setError(res.error ?? "Could not import this file.");
			return;
		}
		toast.success("Data imported");
		onClose();
		navigate({ to: "/inventory" });
	};

	return (
		<Dialog open onOpenChange={(o) => !o && onClose()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Import JSON</DialogTitle>
					<DialogDescription>
						Paste a previously exported backup. This replaces your current data.
					</DialogDescription>
				</DialogHeader>

				<div className="py-4">
					<Textarea
						autoFocus
						className="h-40 font-mono text-xs"
						placeholder='{ "products": [ … ] }'
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
						Cancel
					</Button>
					<Button type="button" onClick={submit}>
						Import &amp; replace
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
