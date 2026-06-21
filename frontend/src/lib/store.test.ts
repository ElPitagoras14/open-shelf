// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import {
	addProduct,
	consume,
	getProduct,
	getSnapshot,
	importJSON,
	reloadSample,
} from "@/lib/store";

beforeEach(() => {
	reloadSample();
});

describe("store", () => {
	it("seeds the sample inventory", () => {
		expect(getSnapshot().products.length).toBe(18);
	});

	it("persists changes to localStorage", () => {
		addProduct("Tofu", "Pantry");
		const raw = localStorage.getItem("openshelf.v1");
		expect(raw).toBeTruthy();
		const parsed = JSON.parse(raw as string);
		expect(parsed.products.some((p: { name: string }) => p.name === "Tofu")).toBe(true);
	});

	it("consumes FIFO across the store", () => {
		// Whole Milk (p2): 2 L across two batches, oldest expired.
		const before = getProduct("p2");
		expect(before?.batches.length).toBe(2);
		const res = consume("p2", 1);
		expect(res?.taken).toBe(1);
		const after = getProduct("p2");
		expect(after?.batches.length).toBe(1); // oldest batch emptied + removed
	});

	it("imports a valid backup and rejects junk", () => {
		const ok = importJSON(
			JSON.stringify({
				products: [{ id: "x1", name: "Salt", category: "Pantry", batches: [] }],
				categories: ["Pantry"],
				settings: { warningDays: 14 },
			}),
		);
		expect(ok.ok).toBe(true);
		expect(getSnapshot().products).toHaveLength(1);
		expect(getSnapshot().settings.warningDays).toBe(14);

		const bad = importJSON("not json");
		expect(bad.ok).toBe(false);

		const missing = importJSON(JSON.stringify({ categories: [] }));
		expect(missing.ok).toBe(false);
	});
});
