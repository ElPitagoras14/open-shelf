import type { Batch, Product, StatusKey } from "@/lib/types";

export const STATUS_LABELS: Record<StatusKey, string> = {
	fresh: "Fresh",
	soon: "Expiring soon",
	expired: "Expired",
};

export const UNITS = [
	"units",
	"kg",
	"g",
	"L",
	"ml",
	"cans",
	"cups",
	"loaf",
	"boxes",
	"pcs",
] as const;

const MON = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];

// ---------- date helpers ----------
function midnight(d: Date): Date {
	const x = new Date(d);
	x.setHours(0, 0, 0, 0);
	return x;
}

/** ISO date (YYYY-MM-DD) for today + n days. */
export function addDays(n: number): string {
	const d = midnight(new Date());
	d.setDate(d.getDate() + n);
	return d.toISOString().slice(0, 10);
}

export function daysUntil(iso: string): number {
	const a = midnight(new Date(`${iso}T00:00:00`));
	const b = midnight(new Date());
	return Math.round((a.getTime() - b.getTime()) / 86400000);
}

export function fmtDate(iso: string): string {
	const d = new Date(`${iso}T00:00:00`);
	const thisYear = new Date().getFullYear();
	const s = `${d.getDate()} ${MON[d.getMonth()]}`;
	return d.getFullYear() === thisYear ? s : `${s} ${d.getFullYear()}`;
}

export function daysShort(d: number): string {
	return d < 0 ? `${d}d` : d === 0 ? "0d" : `+${d}d`;
}

export function daysVerbose(d: number): string {
	if (d < 0) return `${Math.abs(d)} ${Math.abs(d) === 1 ? "day" : "days"} ago`;
	if (d === 0) return "Today";
	if (d === 1) return "Tomorrow";
	return `In ${d} days`;
}

export function statusKey(days: number, warningDays: number): StatusKey {
	if (days < 0) return "expired";
	if (days <= warningDays) return "soon";
	return "fresh";
}

/** Round to 2 decimals to avoid floating-point noise. */
export function nf(n: number): number {
	return Math.round(Number(n) * 100) / 100;
}

export function uid(prefix: string): string {
	return (
		prefix +
		Math.random().toString(36).slice(2, 8) +
		Date.now().toString(36).slice(-3)
	);
}

// ---------- view models ----------
export interface BatchVM {
	id: string;
	qty: number;
	unit: string;
	exp: string;
	expLabel: string;
	days: number;
	daysLabel: string;
	daysShort: string;
	statusKey: StatusKey;
	statusLabel: string;
}

export function batchVM(b: Batch, warningDays: number): BatchVM {
	const days = daysUntil(b.exp);
	const key = statusKey(days, warningDays);
	return {
		id: b.id,
		qty: nf(b.qty),
		unit: b.unit,
		exp: b.exp,
		expLabel: fmtDate(b.exp),
		days,
		daysLabel: daysVerbose(days),
		daysShort: daysShort(days),
		statusKey: key,
		statusLabel: STATUS_LABELS[key],
	};
}

export interface ProductVM {
	id: string;
	name: string;
	category: string;
	total: number;
	unit: string;
	batchCount: number;
	batchCountLabel: string;
	totalLabel: string;
	batches: BatchVM[];
	worst: StatusKey;
	statusLabel: string;
	nearestExp: string | null;
	nearestLabel: string;
	nearestDays: number | null;
	nearestDaysShort: string;
	fifoId: string | null;
}

function byExpAsc(a: { exp: string }, b: { exp: string }): number {
	return a.exp < b.exp ? -1 : a.exp > b.exp ? 1 : 0;
}

export function productVM(p: Product, warningDays: number): ProductVM {
	const all = p.batches
		.map((b) => batchVM(b, warningDays))
		.filter((b) => b.qty > 0)
		.sort(byExpAsc);
	const total = nf(all.reduce((s, b) => s + b.qty, 0));
	const unit = all.length ? all[0].unit : p.batches[0] ? p.batches[0].unit : "";
	let worst: StatusKey = "fresh";
	if (all.some((b) => b.statusKey === "expired")) worst = "expired";
	else if (all.some((b) => b.statusKey === "soon")) worst = "soon";
	const nearest = all[0] ?? null;
	return {
		id: p.id,
		name: p.name,
		category: p.category,
		total,
		unit,
		batchCount: all.length,
		batchCountLabel: `${all.length} ${all.length === 1 ? "batch" : "batches"}`,
		totalLabel: `${total} ${unit}`,
		batches: all,
		worst,
		statusLabel: STATUS_LABELS[worst],
		nearestExp: nearest ? nearest.exp : null,
		nearestLabel: nearest ? nearest.expLabel : "—",
		nearestDays: nearest ? nearest.days : null,
		nearestDaysShort: nearest ? nearest.daysShort : "",
		fifoId: nearest ? nearest.id : null,
	};
}

// ---------- attention selectors ----------
export interface AttentionItem extends BatchVM {
	productName: string;
	category: string;
	productId: string;
}

/** All non-fresh batches across all products, sorted by days ascending. */
export function attentionItems(
	products: Product[],
	warningDays: number,
): AttentionItem[] {
	return products
		.flatMap((p) => {
			const pv = productVM(p, warningDays);
			return pv.batches
				.filter((b) => b.statusKey !== "fresh")
				.map((b) => ({
					...b,
					productName: p.name,
					category: p.category,
					productId: p.id,
				}));
		})
		.sort((a, b) => a.days - b.days);
}

/** Count of non-fresh batches across all products. */
export function attentionCount(
	products: Product[],
	warningDays: number,
): number {
	return products.reduce((sum, p) => {
		const pv = productVM(p, warningDays);
		return sum + pv.batches.filter((b) => b.statusKey !== "fresh").length;
	}, 0);
}

/**
 * Consume `amountRaw` units of a product, drawing from the oldest (nearest
 * expiry) batches first. Returns the new batch list (empty batches removed)
 * and how much was actually taken.
 */
export function consumeFifo(
	product: Product,
	amountRaw: number,
): { batches: Batch[]; taken: number; total: number } {
	const total = nf(
		product.batches.filter((b) => b.qty > 0).reduce((s, b) => s + b.qty, 0),
	);
	const amount = Number(amountRaw);
	const take = Math.min(amount, total);
	const order = product.batches
		.map((b, i) => ({ b, i }))
		.filter((x) => x.b.qty > 0)
		.sort((a, c) => byExpAsc(a.b, c.b));
	const nb = product.batches.map((b) => ({ ...b }));
	let rem = take;
	for (const { i } of order) {
		if (rem <= 0) break;
		const t = Math.min(nb[i].qty, rem);
		nb[i].qty = nf(nb[i].qty - t);
		rem -= t;
	}
	return { batches: nb.filter((b) => b.qty > 0), taken: nf(take), total };
}
