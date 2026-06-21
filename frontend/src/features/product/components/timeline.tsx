import { STATUS_SOLID } from "@/features/shared/components/status-badge";
import { Badge } from "@/components/ui/badge";
import type { BatchVM } from "@/lib/pantry";
import { cn } from "@/lib/utils";

interface TimelineProps {
	batches: BatchVM[];
	fifoId: string | null;
}

export function Timeline({ batches, fifoId }: TimelineProps) {
	const maxDays = batches.reduce((m, b) => Math.max(m, b.days), 1);
	return (
		<div className="flex flex-col gap-4">
			{batches.map((b) => {
				const width = Math.max(
					8,
					Math.min(100, Math.round((b.days / (maxDays || 1)) * 100)),
				);
				return (
					<div key={b.id} className="flex items-center gap-3">
						<span
							className={cn(
								"size-3 shrink-0 rounded-full ring-2 ring-background",
								STATUS_SOLID[b.statusKey],
							)}
						/>
						<div className="min-w-0 flex-1">
							<div className="flex items-center justify-between gap-2">
								<div className="flex items-center gap-2">
									<span className="font-mono text-sm font-semibold tabular-nums">
										{b.expLabel}
									</span>
									<span className="font-mono text-xs text-muted-foreground tabular-nums">
										{b.daysLabel}
									</span>
									{b.id === fifoId && (
										<Badge className="h-4 px-1.5 text-[10px]">FIRST</Badge>
									)}
								</div>
								<span className="font-mono text-sm tabular-nums">
									{b.qty} {b.unit}
								</span>
							</div>
							<div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
								<div
									className={cn(
										"h-full rounded-full",
										STATUS_SOLID[b.statusKey],
									)}
									style={{ width: `${width}%` }}
								/>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}
