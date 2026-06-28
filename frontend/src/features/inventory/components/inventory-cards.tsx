import { useTranslation } from "react-i18next";
import { StatusBadge } from "@/features/shared/components/status-badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { fmtDate, type ProductVM } from "@/lib/pantry";

interface InventoryCardsProps {
	rows: ProductVM[];
	onOpen: (id: string) => void;
}

export function InventoryCards({ rows, onOpen }: InventoryCardsProps) {
	const { t } = useTranslation();
	return (
		<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
			{rows.map((p) => (
				<Card
					key={p.id}
					className="cursor-pointer gap-3 p-4 transition-colors hover:bg-muted/40"
					onClick={() => onOpen(p.id)}
				>
					<div className="flex items-start justify-between gap-2">
						<span className="font-medium">{p.name}</span>
						<StatusBadge status={p.batchCount > 0 ? p.worst : "empty"} />
					</div>
					<div className="text-xs text-muted-foreground">
						{p.category} · {t("common.batches", { count: p.batchCount })}
					</div>
					<Separator />
					<div className="flex items-end justify-between">
						<div>
							<div className="text-xs text-muted-foreground">{t("inventory.colInStock")}</div>
							<div className="font-mono font-semibold tabular-nums">
								{p.total} {p.unit}
							</div>
						</div>
						<div className="text-right">
							<div className="text-xs text-muted-foreground">
								{t("inventory.colNearestExpiry")}
							</div>
							<div className="font-mono font-semibold tabular-nums">
								{p.nearestExp ? fmtDate(p.nearestExp) : "—"}
							</div>
						</div>
					</div>
				</Card>
			))}
		</div>
	);
}
