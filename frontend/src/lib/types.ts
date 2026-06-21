import type { Language } from "@/i18n/resources";

export type StatusKey = "fresh" | "soon" | "expired";

export interface Batch {
	id: string;
	qty: number;
	unit: string;
	exp: string; // ISO date (YYYY-MM-DD)
	added: string; // ISO date (YYYY-MM-DD)
}

export interface Product {
	id: string;
	name: string;
	category: string;
	batches: Batch[];
}

export interface Settings {
	warningDays: number;
	language: Language;
}

export interface AppData {
	products: Product[];
	categories: string[];
	settings: Settings;
}
