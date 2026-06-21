import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
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
import { addDays, UNITS } from "@/lib/pantry";
import { batchSchema } from "@/lib/schemas";
import { addBatch, updateBatch, useAppData } from "@/lib/store";
import type { Batch } from "@/lib/types";

export function BatchDialog({
	mode,
	productId,
	batch,
	onClose,
}: {
	mode: "add" | "edit";
	productId?: string;
	batch?: Batch;
	onClose: () => void;
}) {
	const { products } = useAppData();
	const navigate = useNavigate();
	const { t } = useTranslation();
	const showProductSelect = mode === "add" && !productId;

	const form = useForm({
		defaultValues: {
			productId: productId ?? "",
			qty: batch ? String(batch.qty) : "",
			unit: batch?.unit ?? "units",
			exp: batch?.exp ?? addDays(7),
		},
		validators: { onChange: batchSchema },
		onSubmit: ({ value }) => {
			const payload = {
				qty: Number(value.qty),
				unit: value.unit,
				exp: value.exp,
			};
			if (mode === "add") {
				addBatch(value.productId, payload);
				toast.success(t("batchDialog.addedToast"));
				onClose();
				navigate({
					to: "/product/$productId",
					params: { productId: value.productId },
				});
			} else if (productId && batch) {
				updateBatch(productId, batch.id, payload);
				toast.success(t("batchDialog.updatedToast"));
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
							{mode === "add" ? t("batchDialog.addTitle") : t("batchDialog.editTitle")}
						</DialogTitle>
						<DialogDescription>
							{t("batchDialog.description")}
						</DialogDescription>
					</DialogHeader>

					<FieldGroup className="py-4">
						{showProductSelect && (
							<form.Field name="productId">
								{(field) => {
									const invalid =
										field.state.meta.isTouched &&
										field.state.meta.errors.length > 0;
									return (
										<Field data-invalid={invalid}>
											<FieldLabel htmlFor={field.name}>{t("batchDialog.productLabel")}</FieldLabel>
											<Select
												value={field.state.value}
												onValueChange={(v) => field.handleChange(v)}
											>
												<SelectTrigger
													id={field.name}
													className="w-full"
													aria-invalid={invalid}
												>
													<SelectValue placeholder={t("batchDialog.productPlaceholder")} />
												</SelectTrigger>
												<SelectContent position="popper">
													<SelectGroup>
														{products.map((p) => (
															<SelectItem key={p.id} value={p.id}>
																{p.name}
															</SelectItem>
														))}
													</SelectGroup>
												</SelectContent>
											</Select>
											{invalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									);
								}}
							</form.Field>
						)}

						<div className="grid grid-cols-2 gap-4">
							<form.Field name="qty">
								{(field) => {
									const invalid =
										field.state.meta.isTouched &&
										field.state.meta.errors.length > 0;
									return (
										<Field data-invalid={invalid}>
											<FieldLabel htmlFor={field.name}>{t("batchDialog.qtyLabel")}</FieldLabel>
											<Input
												id={field.name}
												type="number"
												inputMode="decimal"
												min="0"
												step="any"
												autoFocus={!showProductSelect}
												placeholder="0"
												className="font-mono tabular-nums"
												value={field.state.value}
												aria-invalid={invalid}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
											/>
											{invalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									);
								}}
							</form.Field>

							<form.Field name="unit">
								{(field) => (
									<Field>
										<FieldLabel htmlFor={field.name}>{t("batchDialog.unitLabel")}</FieldLabel>
										<Select
											value={field.state.value}
											onValueChange={(v) => field.handleChange(v)}
										>
											<SelectTrigger id={field.name} className="w-full">
												<SelectValue />
											</SelectTrigger>
											<SelectContent position="popper">
												<SelectGroup>
													{UNITS.map((u) => (
														<SelectItem key={u} value={u}>
															{u}
														</SelectItem>
													))}
												</SelectGroup>
											</SelectContent>
										</Select>
									</Field>
								)}
							</form.Field>
						</div>

						<form.Field name="exp">
							{(field) => {
								const invalid =
									field.state.meta.isTouched &&
									field.state.meta.errors.length > 0;
								return (
									<Field data-invalid={invalid}>
										<FieldLabel htmlFor={field.name}>
											{t("batchDialog.expLabel")}
										</FieldLabel>
										<Input
											id={field.name}
											type="date"
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
					</FieldGroup>

					<DialogFooter>
						<Button type="button" variant="outline" onClick={onClose}>
							{t("common.cancel")}
						</Button>
						<Button type="submit">
							{mode === "add" ? t("batchDialog.addButton") : t("common.saveChanges")}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
