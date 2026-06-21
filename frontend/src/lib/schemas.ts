import { z } from "zod";

export const productSchema = z.object({
	name: z.string().trim().min(1, "Please enter a product name."),
	category: z.string().min(1, "Pick a category."),
});
export type ProductFormValues = z.infer<typeof productSchema>;

// Form-friendly schema: every field stays a string so the input types match
// TanStack Form's controlled string values. qty is validated as a positive number.
export const batchSchema = z.object({
	productId: z.string().min(1, "Select a product."),
	qty: z
		.string()
		.refine((v) => Number(v) > 0, "Quantity must be greater than zero."),
	unit: z.string().min(1, "Pick a unit."),
	exp: z.string().min(1, "Pick an expiration date."),
});
export type BatchFormValues = z.infer<typeof batchSchema>;

export const settingsSchema = z.object({
	warningDays: z.coerce.number().int().min(1).max(365),
});

const batchDataSchema = z.object({
	id: z.string(),
	qty: z.number(),
	unit: z.string(),
	exp: z.string(),
	added: z.string().optional().default(""),
});

const productDataSchema = z.object({
	id: z.string(),
	name: z.string(),
	category: z.string(),
	batches: z.array(batchDataSchema),
});

export const importSchema = z.object({
	products: z.array(productDataSchema),
	categories: z.array(z.string()).optional(),
	settings: settingsSchema.optional(),
});
