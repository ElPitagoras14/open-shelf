import { Link, useNavigate } from "@tanstack/react-router";
import { CheckCircle2Icon, PlusIcon, TriangleAlertIcon } from "lucide-react";
import { StatCard } from "./components/stat-card";
import { useDialogs } from "@/features/shared/components/dialogs-provider";
import { ExpiryRow } from "@/features/shared/components/expiry-row";
import { StatusDot } from "@/features/shared/components/status-badge";
import { Alert, AlertAction, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { addDays, attentionItems, fmtDate, productVM } from "@/lib/pantry";
import { useAppData } from "@/lib/store";

export function DashboardPage() {
	const data = useAppData();
	const dialogs = useDialogs();
	const navigate = useNavigate();
	const w = data.settings.warningDays;

	const pvms = data.products.map((p) => productVM(p, w));
	const totalBatches = pvms.reduce((s, p) => s + p.batchCount, 0);
	const soonCount = pvms.filter((p) => p.worst === "soon").length;
	const expiredCount = pvms.filter((p) => p.worst === "expired").length;

	const soonItems = attentionItems(data.products, w).filter(
		(x) => x.statusKey === "soon",
	);

	const stats = [
		{
			label: "Total products",
			value: pvms.length,
			sub: "tracked items",
			status: "fresh" as const,
			color: "",
		},
		{
			label: "Active batches",
			value: totalBatches,
			sub: "with stock",
			status: "fresh" as const,
			color: "",
		},
		{
			label: "Expiring soon",
			value: soonCount,
			sub: `within ${w} days`,
			status: "soon" as const,
			color: soonCount ? "text-status-soon-fg" : "",
		},
		{
			label: "Expired",
			value: expiredCount,
			sub: "needs action",
			status: "expired" as const,
			color: expiredCount ? "text-status-expired-fg" : "",
		},
	];

	return (
		<div className="mx-auto w-full max-w-[1180px] p-4 md:px-8 md:py-7">
			<header className="flex flex-wrap items-start justify-between gap-4">
				<div>
					<h1 className="font-heading text-2xl font-bold">Dashboard</h1>
					<p className="text-sm text-muted-foreground">
						{fmtDate(addDays(0))} · inventory at a glance
					</p>
				</div>
				<div className="flex gap-2">
					<Button variant="outline" onClick={() => dialogs.addBatch()}>
						<PlusIcon data-icon="inline-start" />
						Add batch
					</Button>
					<Button onClick={() => dialogs.addProduct()}>
						<PlusIcon data-icon="inline-start" />
						Add product
					</Button>
				</div>
			</header>

			<div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
				{stats.map((s) => (
					<StatCard key={s.label} {...s} />
				))}
			</div>

			{expiredCount > 0 && (
				<Alert
					variant="destructive"
					className="mt-4 items-center bg-status-expired/40"
				>
					<TriangleAlertIcon />
					<AlertTitle>{expiredCount} product(s) have expired stock</AlertTitle>
					<AlertAction>
						<Link
							to="/alerts"
							className="text-sm font-medium text-destructive hover:underline"
						>
							Review →
						</Link>
					</AlertAction>
				</Alert>
			)}

			<Card className="mt-4">
				<CardHeader className="flex flex-row items-center justify-between">
					<div className="flex items-center gap-2 font-heading text-base font-semibold">
						<StatusDot status="soon" />
						Expiring soon
						<span className="font-mono text-sm font-normal text-muted-foreground tabular-nums">
							{soonItems.length}
						</span>
					</div>
					<Link
						to="/alerts"
						className="text-sm font-medium text-muted-foreground hover:text-foreground"
					>
						All alerts →
					</Link>
				</CardHeader>
				<CardContent>
					{soonItems.length > 0 ? (
						<div className="flex flex-col">
							{soonItems.map((item) => (
								<ExpiryRow
									key={item.id}
									name={item.productName}
									category={item.category}
									qtyLabel={`${item.qty} ${item.unit}`}
									daysLabel={item.daysLabel}
									dateLabel={item.expLabel}
									status={item.statusKey}
									onClick={() =>
										navigate({
											to: "/product/$productId",
											params: { productId: item.productId },
										})
									}
								/>
							))}
						</div>
					) : (
						<Empty className="border-0">
							<EmptyHeader>
								<EmptyMedia variant="icon">
									<CheckCircle2Icon />
								</EmptyMedia>
								<EmptyTitle>Nothing expiring soon</EmptyTitle>
								<EmptyDescription>
									Everything on your shelf is fresh.
								</EmptyDescription>
							</EmptyHeader>
						</Empty>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
