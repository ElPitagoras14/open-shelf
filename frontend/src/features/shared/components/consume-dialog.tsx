import { MinusIcon, PlusIcon } from "lucide-react";
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
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@/components/ui/input-group";
import { nf, productVM } from "@/lib/pantry";
import { consume, getProduct, useAppData } from "@/lib/store";

export function ConsumeDialog({
	productId,
	onClose,
}: {
	productId: string;
	onClose: () => void;
}) {
	const { settings } = useAppData();
	const product = getProduct(productId);
	const { t } = useTranslation();
	const [amount, setAmount] = useState("1");

	if (!product) return null;
	const pv = productVM(product, settings.warningDays);
	const amt = Number(amount) || 0;
	const after = nf(Math.max(0, pv.total - amt));
	const fifo = pv.batches[0] ?? null;
	const over = amt > pv.total && pv.total > 0;

	const bump = (delta: number) =>
		setAmount(String(Math.max(0, nf((Number(amount) || 0) + delta))));

	const submit = () => {
		if (!amt || amt <= 0) {
			toast.error(t("consume.consumeError"));
			return;
		}
		const res = consume(productId, amt);
		if (res) {
			const msg = t("consume.consumedToast", { count: res.taken, unit: res.unit, product: product.name });
			if (res.clearedAll) toast.warning(msg);
			else toast.success(msg);
		}
		onClose();
	};

	return (
		<Dialog open onOpenChange={(o) => !o && onClose()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("consume.title", { product: product.name })}</DialogTitle>
					<DialogDescription>
						{t("consume.description")}
					</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col gap-4 py-4">
					{fifo && (
						<div className="rounded-lg bg-status-fresh/60 p-3">
							<div className="text-xs font-medium tracking-wide text-status-fresh-fg uppercase">
								{t("consume.consumeFirst")}
							</div>
							<div className="mt-1 flex items-baseline justify-between">
								<span className="font-mono text-lg font-semibold tabular-nums">
									{fifo.qty} {fifo.unit}
								</span>
								<span className="font-mono text-sm text-muted-foreground tabular-nums">
									{t("product.expDate", { date: fifo.expLabel })} · {fifo.daysLabel}
								</span>
							</div>
						</div>
					)}

					<div className="flex flex-col gap-2">
						<span className="text-sm font-medium">{t("consume.amountToConsume")}</span>
						<div className="flex items-center gap-3">
							<InputGroup className="h-10 max-w-44">
								<InputGroupAddon>
									<InputGroupButton
										size="icon-sm"
										onClick={() => bump(-1)}
										aria-label={t("common.decrease")}
									>
										<MinusIcon />
									</InputGroupButton>
								</InputGroupAddon>
								<InputGroupInput
									type="number"
									inputMode="decimal"
									min="0"
									step="any"
									className="text-center font-mono tabular-nums"
									value={amount}
									onChange={(e) => setAmount(e.target.value)}
								/>
								<InputGroupAddon align="inline-end">
									<InputGroupButton
										size="icon-sm"
										onClick={() => bump(1)}
										aria-label={t("common.increase")}
									>
										<PlusIcon />
									</InputGroupButton>
								</InputGroupAddon>
							</InputGroup>
							<span className="text-sm text-muted-foreground">{pv.unit}</span>
						</div>
					</div>

					<div className="flex items-center justify-between rounded-lg bg-muted p-3">
						<span className="text-sm text-muted-foreground">
							{t("consume.remainingAfter")}
						</span>
						<span
							className="font-mono text-base font-semibold tabular-nums"
							style={
								after === 0 ? { color: "var(--status-expired-fg)" } : undefined
							}
						>
							{after} {pv.unit}
						</span>
					</div>

					{over && (
						<p className="text-sm text-status-soon-fg">
							{t("consume.overWarning", { total: pv.total, unit: pv.unit })}
						</p>
					)}
				</div>

				<DialogFooter>
					<Button type="button" variant="outline" onClick={onClose}>
						{t("common.cancel")}
					</Button>
					<Button type="button" onClick={submit}>
						{t("consume.consumeButton")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
