import { ExpiryRow } from "@/features/shared/components/expiry-row";
import { StatusDot } from "@/features/shared/components/status-badge";
import { Badge } from "@/components/ui/badge";
import type { AttentionItem } from "@/lib/pantry";
import type { StatusKey } from "@/lib/types";
import { cn } from "@/lib/utils";

interface AlertGroupProps {
	title: string;
	status: StatusKey;
	items: AttentionItem[];
	onOpen: (productId: string) => void;
}

export function AlertGroup({ title, status, items, onOpen }: AlertGroupProps) {
	if (items.length === 0) return null;
	return (
		<section>
			<div className="mb-3 flex items-center gap-2">
				<StatusDot status={status} />
				<h2 className="font-heading text-base font-semibold">{title}</h2>
				<Badge
					className={cn(
						"border-transparent tabular-nums",
						status === "expired"
							? "bg-status-expired text-status-expired-fg"
							: "bg-status-soon text-status-soon-fg",
					)}
				>
					{items.length}
				</Badge>
			</div>
			<div className="flex flex-col gap-2">
				{items.map((item) => (
					<ExpiryRow
						key={item.id}
						bordered
						name={item.productName}
						category={item.category}
						qtyLabel={`${item.qty} ${item.unit}`}
						daysLabel={item.daysLabel}
						dateLabel={item.expLabel}
						status={item.statusKey}
						onClick={() => onOpen(item.productId)}
					/>
				))}
			</div>
		</section>
	);
}
