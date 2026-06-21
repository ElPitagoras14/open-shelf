// @vitest-environment jsdom
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useInstallPrompt } from "./use-install-prompt";

function makePromptEvent() {
	const promptFn = vi.fn().mockResolvedValue(undefined);
	const event = new Event("beforeinstallprompt") as Event & {
		prompt: () => Promise<void>;
		userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
	};
	event.preventDefault = vi.fn();
	Object.assign(event, {
		prompt: promptFn,
		userChoice: Promise.resolve({ outcome: "accepted" as const }),
	});
	return { event, promptFn };
}

describe("useInstallPrompt", () => {
	it("canInstall is false initially", () => {
		const { result } = renderHook(() => useInstallPrompt());
		expect(result.current.canInstall).toBe(false);
	});

	it("canInstall becomes true when beforeinstallprompt fires", async () => {
		const { result } = renderHook(() => useInstallPrompt());
		const { event } = makePromptEvent();

		await act(async () => {
			window.dispatchEvent(event);
		});

		expect(result.current.canInstall).toBe(true);
	});

	it("install() calls prompt() and resets canInstall", async () => {
		const { result } = renderHook(() => useInstallPrompt());
		const { event, promptFn } = makePromptEvent();

		await act(async () => {
			window.dispatchEvent(event);
		});

		await act(async () => {
			await result.current.install();
		});

		expect(promptFn).toHaveBeenCalledOnce();
		expect(result.current.canInstall).toBe(false);
	});

	it("install() is a no-op when canInstall is false", async () => {
		const { result } = renderHook(() => useInstallPrompt());
		// no event dispatched — should not throw
		await act(async () => {
			await result.current.install();
		});
		expect(result.current.canInstall).toBe(false);
	});

	it("removes the event listener on unmount", async () => {
		const removeSpy = vi.spyOn(window, "removeEventListener");
		const { unmount } = renderHook(() => useInstallPrompt());
		unmount();
		expect(removeSpy).toHaveBeenCalledWith(
			"beforeinstallprompt",
			expect.any(Function),
		);
		removeSpy.mockRestore();
	});
});
