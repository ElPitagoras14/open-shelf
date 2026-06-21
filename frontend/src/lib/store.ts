import { useSyncExternalStore } from "react";
import { consumeFifo, nf, uid } from "@/lib/pantry";
import { seedData } from "@/lib/sample-data";
import { importSchema } from "@/lib/schemas";
import type { AppData, Batch, Product, Settings } from "@/lib/types";
import i18n from "@/i18n";
import type { Language } from "@/i18n/resources";

const KEY = "openshelf.v1";
const VERSION = "1.0.0";

const EMPTY: AppData = {
	products: [],
	categories: [],
	settings: { warningDays: 7, language: "en" },
};

function load(): AppData {
	try {
		const raw = localStorage.getItem(KEY);
		if (raw) {
			const d = JSON.parse(raw);
			if (d && Array.isArray(d.products)) {
				return {
					products: d.products,
					categories: Array.isArray(d.categories) ? d.categories : [],
					settings: { ...EMPTY.settings, ...(d.settings ?? {}) },
				};
			}
		}
	} catch {
		// fall through to empty
	}
	// First run: seed language from browser
	const initialLang: Language =
		typeof navigator !== "undefined" && navigator.language?.slice(0, 2) === "es"
			? "es"
			: "en";
	return {
		...EMPTY,
		settings: { ...EMPTY.settings, language: initialLang },
	};
}

function persist(data: AppData) {
	try {
		localStorage.setItem(KEY, JSON.stringify(data));
	} catch {
		// ignore quota / unavailable storage
	}
}

let state: AppData = load();
void i18n.changeLanguage(state.settings.language); // seed on module init
const listeners = new Set<() => void>();

function setState(next: AppData) {
	state = next;
	persist(state);
	for (const l of listeners) l();
}

function update(partial: Partial<AppData>) {
	setState({ ...state, ...partial });
}

function mapProducts(fn: (p: Product) => Product) {
	update({ products: state.products.map(fn) });
}

// ---------- read ----------
export function subscribe(listener: () => void) {
	listeners.add(listener);
	return () => listeners.delete(listener);
}

export function getSnapshot(): AppData {
	return state;
}

export function useAppData(): AppData {
	return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function getProduct(id: string | null | undefined): Product | undefined {
	return id ? state.products.find((p) => p.id === id) : undefined;
}

// ---------- product mutations ----------
export function addProduct(name: string, category: string): string {
	const id = uid("p");
	update({
		products: [
			...state.products,
			{ id, name: name.trim(), category, batches: [] },
		],
	});
	return id;
}

export function updateProduct(id: string, name: string, category: string) {
	mapProducts((p) => (p.id === id ? { ...p, name: name.trim(), category } : p));
}

export function deleteProduct(id: string) {
	update({ products: state.products.filter((p) => p.id !== id) });
}

// ---------- batch mutations ----------
export function addBatch(
	productId: string,
	batch: { qty: number; unit: string; exp: string },
) {
	const b: Batch = {
		id: uid("b"),
		qty: nf(batch.qty),
		unit: batch.unit,
		exp: batch.exp,
		added: new Date().toISOString().slice(0, 10),
	};
	mapProducts((p) =>
		p.id === productId ? { ...p, batches: [...p.batches, b] } : p,
	);
}

export function updateBatch(
	productId: string,
	batchId: string,
	batch: { qty: number; unit: string; exp: string },
) {
	mapProducts((p) =>
		p.id !== productId
			? p
			: {
					...p,
					batches: p.batches.map((x) =>
						x.id === batchId
							? { ...x, qty: nf(batch.qty), unit: batch.unit, exp: batch.exp }
							: x,
					),
				},
	);
}

export function deleteBatch(productId: string, batchId: string) {
	mapProducts((p) =>
		p.id !== productId
			? p
			: { ...p, batches: p.batches.filter((x) => x.id !== batchId) },
	);
}

// ---------- consume ----------
export function consume(productId: string, amountRaw: number) {
	const p = getProduct(productId);
	if (!p) return null;
	const { batches, taken, total } = consumeFifo(p, amountRaw);
	mapProducts((pp) => (pp.id === productId ? { ...pp, batches } : pp));
	return {
		taken,
		total,
		unit: p.batches[0]?.unit ?? "",
		clearedAll: taken >= total,
	};
}

export function consumeBatch(
	productId: string,
	batchId: string,
	amount: number,
) {
	const p = getProduct(productId);
	const b = p?.batches.find((x) => x.id === batchId);
	if (!p || !b) return null;
	const take = Math.min(amount, b.qty);
	mapProducts((pp) =>
		pp.id !== productId
			? pp
			: {
					...pp,
					batches: pp.batches
						.map((x) =>
							x.id === batchId ? { ...x, qty: nf(x.qty - take) } : x,
						)
						.filter((x) => x.qty > 0),
				},
	);
	return { taken: nf(take), unit: b.unit };
}

// ---------- categories ----------
export function addCategory(name: string): boolean {
	const c = name.trim();
	if (!c) return false;
	if (state.categories.includes(c)) return false;
	update({ categories: [...state.categories, c] });
	return true;
}

export function removeCategory(name: string) {
	update({ categories: state.categories.filter((c) => c !== name) });
}

export function categoryCounts(): Record<string, number> {
	const counts: Record<string, number> = {};
	for (const p of state.products)
		counts[p.category] = (counts[p.category] ?? 0) + 1;
	return counts;
}

// ---------- settings ----------
export function setWarningDays(value: number) {
	const n = Math.max(1, Math.min(365, Math.round(Number(value) || 0)));
	update({ settings: { ...state.settings, warningDays: n } as Settings });
}

export function setLanguage(language: Language) {
	update({ settings: { ...state.settings, language } });
	void i18n.changeLanguage(language);
}

// ---------- data management ----------
export function exportJSON() {
	const data = {
		app: "Open Shelf",
		version: VERSION,
		exportedAt: new Date().toISOString(),
		settings: state.settings,
		categories: state.categories,
		products: state.products,
	};
	const blob = new Blob([JSON.stringify(data, null, 2)], {
		type: "application/json",
	});
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = "open-shelf-backup.json";
	document.body.appendChild(a);
	a.click();
	a.remove();
	setTimeout(() => URL.revokeObjectURL(url), 500);
}

export function importJSON(text: string): { ok: boolean; error?: string } {
	let parsed: unknown;
	try {
		parsed = JSON.parse(text);
	} catch {
		return { ok: false, error: i18n.t("validation.invalidJson") };
	}
	const result = importSchema.safeParse(parsed);
	if (!result.success) {
		return { ok: false, error: i18n.t("validation.needsProducts") };
	}
	const data = result.data;
	setState({
		products: data.products as Product[],
		categories: data.categories ?? state.categories,
		settings: { ...state.settings, ...(data.settings ?? {}) },
	});
	return { ok: true };
}

export function reloadSample() {
	const s = seedData();
	update({ products: s.products, categories: s.categories });
}

export function deleteAll() {
	update({ products: [] });
}
