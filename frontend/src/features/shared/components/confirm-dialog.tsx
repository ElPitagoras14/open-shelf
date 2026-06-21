import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ConfirmOptions {
	title: string;
	message: string;
	confirmLabel: string;
	danger?: boolean;
	onConfirm: () => void;
}

export function ConfirmDialog({
	options,
	onClose,
}: {
	options: ConfirmOptions;
	onClose: () => void;
}) {
	return (
		<AlertDialog open onOpenChange={(o) => !o && onClose()}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{options.title}</AlertDialogTitle>
					<AlertDialogDescription>{options.message}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						className={cn(
							options.danger && buttonVariants({ variant: "destructive" }),
						)}
						onClick={() => {
							options.onConfirm();
							onClose();
						}}
					>
						{options.confirmLabel}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
