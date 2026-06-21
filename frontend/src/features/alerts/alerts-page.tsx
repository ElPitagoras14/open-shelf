import { useNavigate } from "@tanstack/react-router";
import { CheckCircle2Icon } from "lucide-react";
import { AlertGroup } from "./components/alert-group";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { attentionItems } from "@/lib/pantry";
import { useAppData } from "@/lib/store";

export function AlertsPage() {
	const data = useAppData();
	const navigate = useNavigate();
	const w = data.settings.warningDays;

	const attention = attentionItems(data.products, w);
	const expired = attention.filter((x) => x.statusKey === "expired");
	const soon = attention.filter((x) => x.statusKey === "soon");

	const openProduct = (productId: string) =>
		navigate({ to: "/product/$productId", params: { productId } });

	return (
		<div className="mx-auto w-full max-w-[1180px] p-4 md:px-8 md:py-7">
			<header>
				<h1 className="font-heading text-2xl font-bold">Alerts</h1>
				<p className="text-sm text-muted-foreground">
					Batches that need attention, by urgency
				</p>
			</header>

			{attention.length === 0 ? (
				<Empty className="mt-10">
					<EmptyHeader>
						<EmptyMedia
							variant="icon"
							className="bg-status-fresh text-status-fresh-fg"
						>
							<CheckCircle2Icon />
						</EmptyMedia>
						<EmptyTitle>All clear</EmptyTitle>
						<EmptyDescription>
							Nothing is expired or expiring within {w} days.
						</EmptyDescription>
					</EmptyHeader>
				</Empty>
			) : (
				<div className="mt-6 flex flex-col gap-8">
					<AlertGroup
						title="Expired"
						status="expired"
						items={expired}
						onOpen={openProduct}
					/>
					<AlertGroup
						title="Expiring soon"
						status="soon"
						items={soon}
						onOpen={openProduct}
					/>
				</div>
			)}
		</div>
	);
}
