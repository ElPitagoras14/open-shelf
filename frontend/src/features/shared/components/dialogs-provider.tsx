import { useNavigate } from "@tanstack/react-router";
import { createContext, useContext, useMemo, useState } from "react";
import { toast } from "sonner";
import { BatchDialog } from "./batch-dialog";
import {
	ConfirmDialog,
	type ConfirmOptions,
} from "./confirm-dialog";
import { ConsumeDialog } from "./consume-dialog";
import { ImportJsonDialog } from "./import-json-dialog";
import { ProductDialog } from "./product-dialog";
import { deleteProduct } from "@/lib/store";
import type { Batch, Product } from "@/lib/types";

type Modal =
	| { kind: "product"; mode: "add" | "edit"; product?: Product }
	| { kind: "batch"; mode: "add" | "edit"; productId?: string; batch?: Batch }
	| { kind: "consume"; productId: string }
	| { kind: "import" }
	| { kind: "confirm"; options: ConfirmOptions }
	| null;

interface DialogsApi {
	addProduct: () => void;
	editProduct: (product: Product) => void;
	addBatch: (productId?: string) => void;
	editBatch: (productId: string, batch: Batch) => void;
	consume: (productId: string) => void;
	importData: () => void;
	confirm: (options: ConfirmOptions) => void;
}

const DialogsContext = createContext<DialogsApi | null>(null);

export function useDialogs(): DialogsApi {
	const ctx = useContext(DialogsContext);
	if (!ctx) throw new Error("useDialogs must be used within DialogsProvider");
	return ctx;
}

export function DialogsProvider({ children }: { children: React.ReactNode }) {
	const [modal, setModal] = useState<Modal>(null);
	const navigate = useNavigate();
	const close = () => setModal(null);

	const api = useMemo<DialogsApi>(
		() => ({
			addProduct: () => setModal({ kind: "product", mode: "add" }),
			editProduct: (product) =>
				setModal({ kind: "product", mode: "edit", product }),
			addBatch: (productId) =>
				setModal({ kind: "batch", mode: "add", productId }),
			editBatch: (productId, batch) =>
				setModal({ kind: "batch", mode: "edit", productId, batch }),
			consume: (productId) => setModal({ kind: "consume", productId }),
			importData: () => setModal({ kind: "import" }),
			confirm: (options) => setModal({ kind: "confirm", options }),
		}),
		[],
	);

	const requestDeleteProduct = (product: Product) =>
		setModal({
			kind: "confirm",
			options: {
				title: "Delete product?",
				message: `“${product.name}” and all of its batches will be permanently removed.`,
				confirmLabel: "Delete",
				danger: true,
				onConfirm: () => {
					deleteProduct(product.id);
					toast.success("Product deleted");
					navigate({ to: "/inventory" });
				},
			},
		});

	return (
		<DialogsContext.Provider value={api}>
			{children}
			{modal?.kind === "product" && (
				<ProductDialog
					mode={modal.mode}
					product={modal.product}
					onClose={close}
					onDelete={requestDeleteProduct}
				/>
			)}
			{modal?.kind === "batch" && (
				<BatchDialog
					mode={modal.mode}
					productId={modal.productId}
					batch={modal.batch}
					onClose={close}
				/>
			)}
			{modal?.kind === "consume" && (
				<ConsumeDialog productId={modal.productId} onClose={close} />
			)}
			{modal?.kind === "import" && <ImportJsonDialog onClose={close} />}
			{modal?.kind === "confirm" && (
				<ConfirmDialog options={modal.options} onClose={close} />
			)}
		</DialogsContext.Provider>
	);
}

