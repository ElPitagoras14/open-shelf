import { Link } from "@tanstack/react-router";
import {
	ChevronLeftIcon,
	MinusIcon,
	PlusIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { BatchCard } from "./components/batch-card";
import { Timeline } from "./components/timeline";
import { useDialogs } from "@/features/shared/components/dialogs-provider";
import { StatusBadge } from "@/features/shared/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
} from "@/components/ui/empty";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@/components/ui/input-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { fmtDate, nf, productVM } from "@/lib/pantry";
import {
	consume,
	consumeBatch,
	deleteBatch,
	getProduct,
	useAppData,
} from "@/lib/store";

interface ProductPageProps {
	productId: string;
}

export function ProductPage({ productId }: ProductPageProps) {
	const data = useAppData();
	const dialogs = useDialogs();

	const [consumeStyle, setConsumeStyle] = useState<"quick" | "guided">("quick");
	const [batchView, setBatchView] = useState<"list" | "timeline">("list");
	const [quickAmt, setQuickAmt] = useState("1");

	const product = getProduct(productId);

	if (!product) {
		return (
			<div className="mx-auto w-full max-w-[1180px] p-4 md:px-8 md:py-7">
				<Empty className="mt-10">
					<EmptyHeader>
						<EmptyTitle>Product not found</EmptyTitle>
						<EmptyDescription>
							It may have been deleted.{" "}
							<Link to="/inventory">Back to inventory</Link>
						</EmptyDescription>
					</EmptyHeader>
				</Empty>
			</div>
		);
	}

	const pv = productVM(product, data.settings.warningDays);
	const fifoExp = pv.batches[0]?.exp ?? null;

	const quickConsume = () => {
		const amt = Number(quickAmt);
		if (!amt || amt <= 0) {
			toast.error("Enter an amount to consume");
			return;
		}
		const res = consume(product.id, amt);
		if (res) {
			const msg = `Consumed ${res.taken} ${res.unit} of ${product.name}`;
			if (res.clearedAll) toast.warning(msg);
			else toast.success(msg);
		}
		setQuickAmt("1");
	};

	const bump = (delta: number) =>
		setQuickAmt(String(Math.max(0, nf((Number(quickAmt) || 0) + delta))));

	return (
		<div className="mx-auto w-full max-w-[1180px] p-4 md:px-8 md:py-7">
			<Link
				to="/inventory"
				className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
			>
				<ChevronLeftIcon className="size-4" />
				Inventory
			</Link>

			<header className="mt-3 flex flex-wrap items-start justify-between gap-4">
				<div>
					<div className="flex items-center gap-2">
						<h1 className="font-heading text-2xl font-bold">{product.name}</h1>
						{pv.batchCount > 0 && <StatusBadge status={pv.worst} />}
					</div>
					<p className="text-sm text-muted-foreground">
						{product.category} · {pv.batchCountLabel}
					</p>
				</div>
				<div className="flex gap-2">
					<Button
						variant="outline"
						onClick={() => dialogs.editProduct(product)}
					>
						Edit product
					</Button>
					<Button onClick={() => dialogs.addBatch(product.id)}>
						<PlusIcon data-icon="inline-start" />
						Add batch
					</Button>
				</div>
			</header>

			<div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-[1fr_1.4fr]">
				<Card>
					<CardHeader>
						<CardTitle className="text-sm font-medium text-muted-foreground">
							Total stock
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex items-baseline gap-1.5">
							<span className="font-mono text-4xl font-semibold tabular-nums">
								{pv.total}
							</span>
							<span className="text-base text-muted-foreground">{pv.unit}</span>
						</div>
						<p className="mt-1 text-xs text-muted-foreground">
							across {pv.batchCountLabel}
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							Consume
						</CardTitle>
						<ToggleGroup
							type="single"
							variant="outline"
							size="sm"
							value={consumeStyle}
							onValueChange={(v) =>
								v && setConsumeStyle(v as "quick" | "guided")
							}
						>
							<ToggleGroupItem value="quick">Quick</ToggleGroupItem>
							<ToggleGroupItem value="guided">Guided</ToggleGroupItem>
						</ToggleGroup>
					</CardHeader>
					<CardContent>
						{pv.batchCount === 0 ? (
							<p className="text-sm text-muted-foreground">
								No stock to consume.
							</p>
						) : consumeStyle === "quick" ? (
							<div className="flex flex-col gap-3">
								<p className="text-sm text-muted-foreground">
									Takes from{" "}
									<span className="font-medium text-foreground">
										{fifoExp ? `exp ${fmtDate(fifoExp)}` : "oldest batch"}
									</span>{" "}
									first (FIFO).
								</p>
								<div className="flex items-center justify-between gap-3">
									<div className="flex items-center gap-2">
										<InputGroup className="h-10 w-32">
											<InputGroupAddon>
												<InputGroupButton
													size="icon-sm"
													onClick={() => bump(-1)}
													aria-label="Decrease"
												>
													<MinusIcon />
												</InputGroupButton>
											</InputGroupAddon>
											<InputGroupInput
												type="number"
												min="0"
												step="any"
												className="text-center font-mono tabular-nums"
												value={quickAmt}
												onChange={(e) => setQuickAmt(e.target.value)}
											/>
											<InputGroupAddon align="inline-end">
												<InputGroupButton
													size="icon-sm"
													onClick={() => bump(1)}
													aria-label="Increase"
												>
													<PlusIcon />
												</InputGroupButton>
											</InputGroupAddon>
										</InputGroup>
										<span className="text-sm text-muted-foreground">
											{pv.unit}
										</span>
									</div>
									<Button onClick={quickConsume}>Consume</Button>
								</div>
							</div>
						) : (
							<Button onClick={() => dialogs.consume(product.id)}>
								Consume…
							</Button>
						)}
					</CardContent>
				</Card>
			</div>

			<section className="mt-8">
				<div className="mb-3 flex items-center justify-between">
					<h2 className="font-heading text-base font-semibold">Batches</h2>
					{pv.batchCount > 0 && (
						<ToggleGroup
							type="single"
							variant="outline"
							size="sm"
							value={batchView}
							onValueChange={(v) => v && setBatchView(v as "list" | "timeline")}
						>
							<ToggleGroupItem value="list">List</ToggleGroupItem>
							<ToggleGroupItem value="timeline">Timeline</ToggleGroupItem>
						</ToggleGroup>
					)}
				</div>

				{pv.batchCount === 0 ? (
					<Empty>
						<EmptyHeader>
							<EmptyTitle>No active batches</EmptyTitle>
							<EmptyDescription>
								Add a batch to start tracking stock.
							</EmptyDescription>
						</EmptyHeader>
						<Button onClick={() => dialogs.addBatch(product.id)}>
							Add batch
						</Button>
					</Empty>
				) : batchView === "list" ? (
					<div className="flex flex-col gap-2.5">
						{pv.batches.map((b) => (
							<BatchCard
								key={b.id}
								batch={b}
								isFifo={b.id === pv.fifoId}
								onConsume={() => {
									const res = consumeBatch(product.id, b.id, 1);
									if (res)
										toast.success(
											`Consumed ${res.taken} ${res.unit} of ${product.name}`,
										);
								}}
								onEdit={() =>
									dialogs.editBatch(product.id, {
										id: b.id,
										qty: b.qty,
										unit: b.unit,
										exp: b.exp,
										added: "",
									})
								}
								onDelete={() =>
									dialogs.confirm({
										title: "Delete batch?",
										message: `This batch of ${b.qty} ${b.unit} will be removed.`,
										confirmLabel: "Delete",
										danger: true,
										onConfirm: () => {
											deleteBatch(product.id, b.id);
											toast.success("Batch deleted");
										},
									})
								}
							/>
						))}
					</div>
				) : (
					<Timeline batches={pv.batches} fifoId={pv.fifoId} />
				)}
			</section>
		</div>
	);
}
