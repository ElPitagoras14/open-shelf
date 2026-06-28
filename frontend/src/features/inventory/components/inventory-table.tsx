import { useTranslation } from "react-i18next";
import { STATUS_TEXT, StatusBadge, StatusDot } from "@/features/shared/components/status-badge";
import { Card } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { fmtDate, type ProductVM } from "@/lib/pantry";
import { cn } from "@/lib/utils";

interface InventoryTableProps {
	rows: ProductVM[];
	onOpen: (id: string) => void;
}

export function InventoryTable({ rows, onOpen }: InventoryTableProps) {
	const { t } = useTranslation();
	return (
		<Card className="overflow-hidden py-0">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>{t("inventory.colProduct")}</TableHead>
						<TableHead>{t("inventory.colCategory")}</TableHead>
						<TableHead className="text-right">{t("inventory.colInStock")}</TableHead>
						<TableHead>{t("inventory.colNearestExpiry")}</TableHead>
						<TableHead>{t("inventory.colStatus")}</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{rows.map((p) => (
						<TableRow
							key={p.id}
							className="cursor-pointer"
							onClick={() => onOpen(p.id)}
						>
							<TableCell>
								<div className="flex items-center gap-2">
									<StatusDot status={p.worst} />
									<span className="font-medium">{p.name}</span>
									<span className="font-mono text-xs text-muted-foreground tabular-nums">
										{t("common.batches", { count: p.batchCount })}
									</span>
								</div>
							</TableCell>
							<TableCell className="text-muted-foreground">
								{p.category}
							</TableCell>
							<TableCell className="text-right font-mono font-semibold tabular-nums">
								{p.total} {p.unit}
							</TableCell>
							<TableCell className="font-mono tabular-nums">
								<span>{p.nearestExp ? fmtDate(p.nearestExp) : "—"}</span>{" "}
								<span className={cn("text-xs", STATUS_TEXT[p.worst])}>
									{p.nearestDaysShort}
								</span>
							</TableCell>
							<TableCell>
								<StatusBadge status={p.batchCount > 0 ? p.worst : "empty"} />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</Card>
	);
}
