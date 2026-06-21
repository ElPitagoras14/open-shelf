import { addDays } from "@/lib/pantry";
import type { AppData, Batch, Product } from "@/lib/types";

const mk = (
	id: string,
	qty: number,
	unit: string,
	days: number,
	ago: number,
): Batch => ({
	id,
	qty,
	unit,
	exp: addDays(days),
	added: addDays(-(ago || 3)),
});

/** Fresh sample inventory, with batch dates relative to today. */
export function seedData(): AppData {
	const products: Product[] = [
		{
			id: "p1",
			name: "White Rice",
			category: "Grains",
			batches: [mk("b1", 2, "kg", 180, 40), mk("b2", 1, "kg", 400, 10)],
		},
		{
			id: "p2",
			name: "Whole Milk",
			category: "Dairy",
			batches: [mk("b3", 1, "L", 2, 4), mk("b4", 1, "L", -1, 9)],
		},
		{
			id: "p3",
			name: "Eggs",
			category: "Dairy",
			batches: [mk("b5", 12, "units", 5, 6)],
		},
		{
			id: "p4",
			name: "Sourdough Bread",
			category: "Bakery",
			batches: [mk("b6", 1, "loaf", -2, 5)],
		},
		{
			id: "p5",
			name: "Bananas",
			category: "Produce",
			batches: [mk("b7", 5, "units", 1, 3)],
		},
		{
			id: "p6",
			name: "Greek Yogurt",
			category: "Dairy",
			batches: [mk("b8", 4, "cups", 3, 5), mk("b9", 2, "cups", 12, 2)],
		},
		{
			id: "p7",
			name: "Canned Tomatoes",
			category: "Pantry",
			batches: [mk("b10", 6, "cans", 520, 30)],
		},
		{
			id: "p8",
			name: "Olive Oil",
			category: "Pantry",
			batches: [mk("b11", 750, "ml", 300, 25)],
		},
		{
			id: "p9",
			name: "Black Beans",
			category: "Pantry",
			batches: [mk("b12", 4, "cans", 365, 20), mk("b13", 2, "cans", 210, 12)],
		},
		{
			id: "p10",
			name: "Baby Spinach",
			category: "Produce",
			batches: [mk("b14", 200, "g", 2, 3)],
		},
		{
			id: "p11",
			name: "Butter",
			category: "Dairy",
			batches: [mk("b15", 250, "g", 40, 8)],
		},
		{
			id: "p12",
			name: "Spaghetti",
			category: "Grains",
			batches: [mk("b16", 500, "g", 600, 15)],
		},
		{
			id: "p13",
			name: "Orange Juice",
			category: "Beverages",
			batches: [mk("b17", 1, "L", -4, 10)],
		},
		{
			id: "p14",
			name: "Cheddar Cheese",
			category: "Dairy",
			batches: [mk("b18", 300, "g", 25, 7), mk("b19", 150, "g", 6, 3)],
		},
		{
			id: "p15",
			name: "Frozen Peas",
			category: "Frozen",
			batches: [mk("b20", 1000, "g", 400, 18)],
		},
		{
			id: "p16",
			name: "Carrots",
			category: "Produce",
			batches: [mk("b21", 8, "units", 14, 4)],
		},
		{
			id: "p17",
			name: "Ketchup",
			category: "Condiments",
			batches: [mk("b22", 500, "ml", 250, 22)],
		},
		{
			id: "p18",
			name: "All-Purpose Flour",
			category: "Grains",
			batches: [mk("b23", 2, "kg", 95, 16)],
		},
	];
	return {
		products,
		categories: [
			"Grains",
			"Dairy",
			"Bakery",
			"Produce",
			"Pantry",
			"Beverages",
			"Frozen",
			"Condiments",
		],
		settings: { warningDays: 7 },
	};
}
