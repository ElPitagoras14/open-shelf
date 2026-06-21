import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { productSchema } from "@/lib/schemas";
import { addProduct, updateProduct, useAppData } from "@/lib/store";
import type { Product } from "@/lib/types";

export function ProductDialog({
	mode,
	product,
	onClose,
	onDelete,
}: {
	mode: "add" | "edit";
	product?: Product;
	onClose: () => void;
	onDelete?: (product: Product) => void;
}) {
	const { categories } = useAppData();
	const navigate = useNavigate();

	const form = useForm({
		defaultValues: {
			name: product?.name ?? "",
			category: product?.category ?? categories[0] ?? "Pantry",
		},
		validators: { onChange: productSchema },
		onSubmit: ({ value }) => {
			if (mode === "add") {
				const id = addProduct(value.name, value.category);
				toast.success("Product added");
				onClose();
				navigate({ to: "/product/$productId", params: { productId: id } });
			} else if (product) {
				updateProduct(product.id, value.name, value.category);
				toast.success("Product updated");
				onClose();
			}
		},
	});

	return (
		<Dialog open onOpenChange={(o) => !o && onClose()}>
			<DialogContent
				onInteractOutside={(e) => {
					// Clicking inside a portalled Select popper shouldn't close the dialog.
					const t = e.detail.originalEvent.target as Element | null;
					if (
						t?.closest(
							"[data-radix-popper-content-wrapper],[data-slot=select-content]",
						)
					) {
						e.preventDefault();
					}
				}}
			>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}
				>
					<DialogHeader>
						<DialogTitle>
							{mode === "add" ? "Add product" : "Edit product"}
						</DialogTitle>
						<DialogDescription>
							Name and category. Add batches next.
						</DialogDescription>
					</DialogHeader>

					<FieldGroup className="py-4">
						<form.Field name="name">
							{(field) => {
								const invalid =
									field.state.meta.isTouched &&
									field.state.meta.errors.length > 0;
								return (
									<Field data-invalid={invalid}>
										<FieldLabel htmlFor={field.name}>Product name</FieldLabel>
										<Input
											id={field.name}
											autoFocus
											placeholder="e.g. Whole Milk"
											value={field.state.value}
											aria-invalid={invalid}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
										/>
										{invalid && <FieldError errors={field.state.meta.errors} />}
									</Field>
								);
							}}
						</form.Field>

						<form.Field name="category">
							{(field) => (
								<Field>
									<FieldLabel htmlFor={field.name}>Category</FieldLabel>
									<Select
										value={field.state.value}
										onValueChange={(v) => field.handleChange(v)}
									>
										<SelectTrigger id={field.name} className="w-full">
											<SelectValue />
										</SelectTrigger>
										<SelectContent position="popper">
											<SelectGroup>
												{categories.map((c) => (
													<SelectItem key={c} value={c}>
														{c}
													</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
									</Select>
								</Field>
							)}
						</form.Field>
					</FieldGroup>

					<DialogFooter className="sm:justify-between">
						{mode === "edit" && product ? (
							<Button
								type="button"
								variant="ghost"
								className="text-destructive hover:text-destructive"
								onClick={() => onDelete?.(product)}
							>
								Delete product
							</Button>
						) : (
							<span />
						)}
						<div className="flex gap-2">
							<Button type="button" variant="outline" onClick={onClose}>
								Cancel
							</Button>
							<Button type="submit">
								{mode === "add" ? "Add product" : "Save changes"}
							</Button>
						</div>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
