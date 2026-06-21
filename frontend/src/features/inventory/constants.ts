import type { StatusKey } from "@/lib/types";

export type StatusFilterKey = "all" | StatusKey; // "all" | "fresh" | "soon" | "expired"

export const STATUS_FILTERS: StatusFilterKey[] = ["all", "fresh", "soon", "expired"];

export const STATUS_MAP: Record<StatusFilterKey, StatusKey | null> = {
	all: null,
	fresh: "fresh",
	soon: "soon",
	expired: "expired",
};

export const SORTS = [
	{ v: "expiration", label: "inventory.sortExpiry" },
	{ v: "name",       label: "inventory.sortName" },
	{ v: "quantity",   label: "inventory.sortQuantity" },
	{ v: "status",     label: "inventory.sortStatus" },
] as const;

export const URGENCY: Record<string, number> = { expired: 0, soon: 1, fresh: 2 };
