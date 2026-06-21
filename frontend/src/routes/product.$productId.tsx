import { createFileRoute } from "@tanstack/react-router";
import { ProductPage } from "@/features/product/product-page";

export const Route = createFileRoute("/product/$productId")({
	component: RouteComponent,
});

function RouteComponent() {
	const { productId } = Route.useParams();
	return <ProductPage productId={productId} />;
}
