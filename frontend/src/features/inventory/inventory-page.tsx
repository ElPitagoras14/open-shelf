import { useNavigate } from "@tanstack/react-router";
import {
	LayoutGridIcon,
	PackageIcon,
	PlusIcon,
	SearchIcon,
	TableIcon,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { InventoryCards } from "./components/inventory-cards";
import { InventoryTable } from "./components/inventory-table";
import { SORTS, STATUS_FILTERS, STATUS_MAP, URGENCY } from "./constants";
import type { StatusFilterKey } from "./constants";
import { useDialogs } from "@/features/shared/components/dialogs-provider";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { productVM } from "@/lib/pantry";
import { reloadSample, useAppData } from "@/lib/store";

export function InventoryPage() {
	const data = useAppData();
	const dialogs = useDialogs();
	const navigate = useNavigate();
	const { t } = useTranslation();
	const [q, setQ] = useState("");
	const [catFilter, setCatFilter] = useState("All");
	const [statusFilter, setStatusFilter] = useState<StatusFilterKey>("all");
	const [sortBy, setSortBy] = useState("expiration");
	const [layout, setLayout] = useState<"table" | "cards">("table");

	const pvms = data.products.map((p) =>
		productVM(p, data.settings.warningDays),
	);

	const query = q.trim().toLowerCase();
	const rows = pvms
		.filter((p) => {
			if (query && !p.name.toLowerCase().includes(query)) return false;
			if (catFilter !== "All" && p.category !== catFilter) return false;
			const sf = STATUS_MAP[statusFilter];
			if (sf && p.worst !== sf) return false;
			return true;
		})
		.sort((a, b) => {
			if (sortBy === "name") return a.name.localeCompare(b.name);
			if (sortBy === "quantity") return b.total - a.total;
			if (sortBy === "status")
				return (
					URGENCY[a.worst] - URGENCY[b.worst] ||
					(a.nearestExp ?? "").localeCompare(b.nearestExp ?? "")
				);
			return (a.nearestExp ?? "9999").localeCompare(b.nearestExp ?? "9999");
		});

	const open = (id: string) =>
		navigate({ to: "/product/$productId", params: { productId: id } });

	return (
		<div className="mx-auto w-full max-w-[1180px] p-4 md:px-8 md:py-7">
			<header className="flex flex-wrap items-start justify-between gap-4">
				<div>
					<h1 className="font-heading text-2xl font-bold">{t("inventory.title")}</h1>
					<p className="text-sm text-muted-foreground">
						{t("inventory.subtitle", { count: rows.length, total: pvms.length })}
					</p>
				</div>
				<Button onClick={() => dialogs.addProduct()}>
					<PlusIcon data-icon="inline-start" />
					{t("inventory.addProduct")}
				</Button>
			</header>

			<div className="mt-5 flex flex-wrap items-center gap-2">
				<InputGroup className="h-9 w-full min-w-44 sm:w-auto sm:flex-1">
					<InputGroupAddon>
						<SearchIcon />
					</InputGroupAddon>
					<InputGroupInput
						placeholder={t("inventory.searchPlaceholder")}
						value={q}
						onChange={(e) => setQ(e.target.value)}
					/>
				</InputGroup>

				<Select value={catFilter} onValueChange={setCatFilter}>
					<SelectTrigger className="h-9">
						<SelectValue />
					</SelectTrigger>
					<SelectContent position="popper">
						<SelectGroup>
							<SelectItem value="All">{t("inventory.allCategories")}</SelectItem>
							{data.categories.map((c) => (
								<SelectItem key={c} value={c}>
									{c}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>

				<Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilterKey)}>
					<SelectTrigger className="h-9">
						<SelectValue />
					</SelectTrigger>
					<SelectContent position="popper">
						<SelectGroup>
							{STATUS_FILTERS.map((s) => (
								<SelectItem key={s} value={s}>
									{s === "all" ? t("inventory.allStatuses") : t(`status.${s}`)}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>

				<Select value={sortBy} onValueChange={setSortBy}>
					<SelectTrigger className="h-9">
						<SelectValue />
					</SelectTrigger>
					<SelectContent position="popper">
						<SelectGroup>
							{SORTS.map((s) => (
								<SelectItem key={s.v} value={s.v}>
									{t(s.label)}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>

				<ToggleGroup
					type="single"
					variant="outline"
					value={layout}
					onValueChange={(v) => v && setLayout(v as "table" | "cards")}
					className="hidden md:flex"
				>
					<ToggleGroupItem value="table" aria-label={t("inventory.tableView")}>
						<TableIcon />
					</ToggleGroupItem>
					<ToggleGroupItem value="cards" aria-label={t("inventory.cardsView")}>
						<LayoutGridIcon />
					</ToggleGroupItem>
				</ToggleGroup>
			</div>

			<div className="mt-4">
				{rows.length === 0 && pvms.length > 0 && (
					<Empty>
						<EmptyHeader>
							<EmptyTitle>{t("inventory.noMatch")}</EmptyTitle>
							<EmptyDescription>
								{t("inventory.noMatchDesc")}
							</EmptyDescription>
						</EmptyHeader>
						<EmptyContent>
							<Button
								variant="outline"
								onClick={() => {
									setQ("");
									setCatFilter("All");
									setStatusFilter("all");
								}}
							>
								{t("inventory.clearFilters")}
							</Button>
						</EmptyContent>
					</Empty>
				)}

				{pvms.length === 0 && (
					<Empty>
						<EmptyHeader>
							<EmptyMedia variant="icon">
								<PackageIcon />
							</EmptyMedia>
							<EmptyTitle>{t("inventory.emptyTitle")}</EmptyTitle>
							<EmptyDescription>
								{t("inventory.emptyDesc")}
							</EmptyDescription>
						</EmptyHeader>
						<EmptyContent>
							<div className="flex gap-2">
								<Button onClick={() => dialogs.addProduct()}>
									{t("inventory.addProduct")}
								</Button>
								<Button variant="outline" onClick={() => reloadSample()}>
									{t("inventory.loadSample")}
								</Button>
							</div>
						</EmptyContent>
					</Empty>
				)}

				{rows.length > 0 && (
					<>
						{layout === "table" && (
							<div className="hidden md:block">
								<InventoryTable rows={rows} onOpen={open} />
							</div>
						)}
						<div className={layout === "table" ? "md:hidden" : ""}>
							<InventoryCards rows={rows} onOpen={open} />
						</div>
					</>
				)}
			</div>
		</div>
	);
}
