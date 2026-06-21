import { StatusDot } from "@/features/shared/components/status-badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
} from "@/components/ui/card";
import type { StatusKey } from "@/lib/types";
import { cn } from "@/lib/utils";

interface StatCardProps {
	label: string;
	value: number;
	sub: string;
	status: StatusKey;
	color?: string;
}

export function StatCard({ label, value, sub, status, color = "" }: StatCardProps) {
	return (
		<Card className="gap-2 py-4">
			<CardHeader className="px-4">
				<CardDescription className="flex items-center gap-2">
					<StatusDot status={status} />
					{label}
				</CardDescription>
			</CardHeader>
			<CardContent className="px-4">
				<div
					className={cn(
						"font-mono text-3xl font-semibold tabular-nums",
						color,
					)}
				>
					{value}
				</div>
				<p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
			</CardContent>
		</Card>
	);
}
