import { CheckIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
	STATUS_TEXT,
	StatusBadge,
} from "@/features/shared/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { BatchVM } from "@/lib/pantry";
import { cn } from "@/lib/utils";

interface BatchCardProps {
	batch: BatchVM;
	isFifo: boolean;
	onConsume: () => void;
	onEdit: () => void;
	onDelete: () => void;
}

export function BatchCard({
	batch,
	isFifo,
	onConsume,
	onEdit,
	onDelete,
}: BatchCardProps) {
	const { t } = useTranslation();

	return (
		<Card
			className={cn(
				"gap-0 p-4",
				isFifo && "border-primary ring-2 ring-primary/15",
			)}
		>
			{isFifo && (
				<Badge className="mb-3 w-fit gap-1">
					<CheckIcon />
					{t("common.consumeFirst")}
				</Badge>
			)}
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div className="flex flex-wrap items-center gap-6">
					<div>
						<div className="text-xs text-muted-foreground">{t("batchCard.remaining")}</div>
						<div className="font-mono text-xl font-semibold tabular-nums">
							{batch.qty}{" "}
							<span className="text-sm font-normal text-muted-foreground">
								{batch.unit}
							</span>
						</div>
					</div>
					<div>
						<div className="text-xs text-muted-foreground">{t("batchCard.expiration")}</div>
						<div className="font-mono font-semibold tabular-nums">
							{batch.expLabel}
						</div>
					</div>
					<div>
						<div className="text-xs text-muted-foreground">{t("batchCard.daysLeft")}</div>
						<div
							className={cn(
								"font-mono font-semibold tabular-nums",
								STATUS_TEXT[batch.statusKey],
							)}
						>
							{batch.daysLabel}
						</div>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<StatusBadge status={batch.statusKey} />
					<Button variant="outline" size="sm" onClick={onConsume}>
						{t("common.consume")}
					</Button>
					<Button
						variant="ghost"
						size="icon-sm"
						onClick={onEdit}
						aria-label={t("common.editBatch")}
					>
						<PencilIcon />
					</Button>
					<Button
						variant="ghost"
						size="icon-sm"
						onClick={onDelete}
						aria-label={t("common.deleteBatch")}
						className="text-destructive hover:text-destructive"
					>
						<Trash2Icon />
					</Button>
				</div>
			</div>
		</Card>
	);
}
