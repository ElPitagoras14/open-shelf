import { describe, expect, it } from "vitest";
import {
	addDays,
	consumeFifo,
	daysShort,
	daysVerbose,
	productVM,
	statusKey,
} from "@/lib/pantry";
import type { Product } from "@/lib/types";

describe("statusKey", () => {
	it("classifies by days until expiry against the warning window", () => {
		expect(statusKey(-1, 7)).toBe("expired");
		expect(statusKey(0, 7)).toBe("soon");
		expect(statusKey(7, 7)).toBe("soon");
		expect(statusKey(8, 7)).toBe("fresh");
	});
});

describe("day formatting", () => {
	it("daysShort", () => {
		expect(daysShort(-2)).toBe("-2d");
		expect(daysShort(0)).toBe("0d");
		expect(daysShort(5)).toBe("+5d");
	});
	it("daysVerbose", () => {
		expect(daysVerbose(-1)).toBe("1 day ago");
		expect(daysVerbose(-3)).toBe("3 days ago");
		expect(daysVerbose(0)).toBe("Today");
		expect(daysVerbose(1)).toBe("Tomorrow");
		expect(daysVerbose(4)).toBe("In 4 days");
	});
});

function milk(): Product {
	return {
		id: "p2",
		name: "Whole Milk",
		category: "Dairy",
		batches: [
			{ id: "b3", qty: 1, unit: "L", exp: addDays(2), added: addDays(-4) },
			{ id: "b4", qty: 1, unit: "L", exp: addDays(-1), added: addDays(-9) },
		],
	};
}

describe("productVM", () => {
	it("sorts batches by nearest expiry, sums stock and picks worst status + fifo", () => {
		const vm = productVM(milk(), 7);
		expect(vm.total).toBe(2);
		expect(vm.unit).toBe("L");
		expect(vm.batchCount).toBe(2);
		expect(vm.worst).toBe("expired"); // one batch already expired
		// oldest (expired, -1d) sorts first and is the fifo / consume-first batch
		expect(vm.batches[0].id).toBe("b4");
		expect(vm.fifoId).toBe("b4");
	});
});

describe("consumeFifo", () => {
	it("draws from the oldest batch first and drops emptied batches", () => {
		const res = consumeFifo(milk(), 1);
		expect(res.taken).toBe(1);
		expect(res.total).toBe(2);
		// the expired oldest batch (b4) is emptied and removed; b3 survives
		expect(res.batches).toHaveLength(1);
		expect(res.batches[0].id).toBe("b3");
		expect(res.batches[0].qty).toBe(1);
	});

	it("caps consumption at available total", () => {
		const res = consumeFifo(milk(), 99);
		expect(res.taken).toBe(2);
		expect(res.batches).toHaveLength(0);
	});

	it("spans multiple batches when needed", () => {
		const p = milk();
		p.batches[0].qty = 1; // b3 fresh
		p.batches[1].qty = 1; // b4 oldest
		const res = consumeFifo(p, 1.5);
		expect(res.taken).toBe(1.5);
		// oldest fully consumed, newest partially (0.5 left)
		expect(res.batches).toHaveLength(1);
		expect(res.batches[0].id).toBe("b3");
		expect(res.batches[0].qty).toBe(0.5);
	});
});
