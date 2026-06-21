import { Badge } from "@/components/ui/badge";
import { STATUS_LABELS } from "@/lib/pantry";
import type { StatusKey } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUS_BADGE: Record<StatusKey, string> = {
	fresh: "bg-status-fresh text-status-fresh-fg",
	soon: "bg-status-soon text-status-soon-fg",
	expired: "bg-status-expired text-status-expired-fg",
};

/** Tailwind text-color class per status (semaphore foreground). */
export const STATUS_TEXT: Record<StatusKey, string> = {
	fresh: "text-status-fresh-fg",
	soon: "text-status-soon-fg",
	expired: "text-status-expired-fg",
};

/** Solid fill class per status (dots, timeline bars). */
export const STATUS_SOLID: Record<StatusKey, string> = {
	fresh: "bg-status-fresh-solid",
	soon: "bg-status-soon-solid",
	expired: "bg-status-expired-solid",
};

export function StatusBadge({
	status,
	className,
}: {
	status: StatusKey;
	className?: string;
}) {
	return (
		<Badge
			className={cn("border-transparent", STATUS_BADGE[status], className)}
		>
			{STATUS_LABELS[status]}
		</Badge>
	);
}

export function StatusDot({
	status,
	className,
}: {
	status: StatusKey;
	className?: string;
}) {
	return (
		<span
			className={cn(
				"inline-block size-2 shrink-0 rounded-full",
				STATUS_SOLID[status],
				className,
			)}
		/>
	);
}
