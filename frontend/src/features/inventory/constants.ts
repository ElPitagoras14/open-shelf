export const STATUS_FILTERS = ["All", "Fresh", "Expiring soon", "Expired"] as const;

export const STATUS_MAP: Record<string, string | null> = {
	All: null,
	Fresh: "fresh",
	"Expiring soon": "soon",
	Expired: "expired",
};

export const SORTS = [
	{ v: "expiration", label: "Sort: Nearest expiry" },
	{ v: "name", label: "Sort: Name (A–Z)" },
	{ v: "quantity", label: "Sort: Quantity" },
	{ v: "status", label: "Sort: Status" },
];

export const URGENCY: Record<string, number> = { expired: 0, soon: 1, fresh: 2 };
