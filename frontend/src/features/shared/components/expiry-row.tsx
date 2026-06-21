import { STATUS_TEXT } from "@/features/shared/components/status-badge";
import type { StatusKey } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ExpiryRow({
	name,
	category,
	qtyLabel,
	daysLabel,
	dateLabel,
	status,
	onClick,
	bordered = false,
}: {
	name: string;
	category: string;
	qtyLabel: string;
	daysLabel: string;
	dateLabel: string;
	status: StatusKey;
	onClick: () => void;
	bordered?: boolean;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"flex w-full items-center justify-between gap-3 rounded-md px-3 py-2.5 text-left transition-colors hover:bg-muted/60",
				bordered && "border border-l-4 bg-card",
			)}
			style={
				bordered
					? { borderLeftColor: `var(--status-${status}-solid)` }
					: undefined
			}
		>
			<div className="min-w-0">
				<div className="truncate text-sm font-semibold">{name}</div>
				<div className="truncate text-xs text-muted-foreground">
					{category} · {qtyLabel}
				</div>
			</div>
			<div className="shrink-0 text-right">
				<div
					className={cn(
						"font-mono text-sm font-semibold tabular-nums",
						STATUS_TEXT[status],
					)}
				>
					{daysLabel}
				</div>
				<div className="font-mono text-xs text-muted-foreground tabular-nums">
					{dateLabel}
				</div>
			</div>
		</button>
	);
}
