// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { ThemeProvider } from "@/features/shared/components/theme-provider";
import { ThemeToggle } from "@/features/shared/components/theme-toggle";

beforeEach(() => {
	localStorage.clear();
	document.documentElement.classList.remove("dark");
	// jsdom has no matchMedia; stub it so getInitialTheme defaults to light.
	window.matchMedia = (query: string) =>
		({
			matches: false,
			media: query,
			onchange: null,
			addEventListener: () => {},
			removeEventListener: () => {},
			addListener: () => {},
			removeListener: () => {},
			dispatchEvent: () => false,
		}) as unknown as MediaQueryList;
});

describe("ThemeToggle", () => {
	it("toggles the dark class and persists the choice", () => {
		render(
			<ThemeProvider>
				<ThemeToggle />
			</ThemeProvider>,
		);

		// starts light
		expect(document.documentElement.classList.contains("dark")).toBe(false);

		fireEvent.click(screen.getByRole("button", { name: /switch to dark theme/i }));
		expect(document.documentElement.classList.contains("dark")).toBe(true);
		expect(localStorage.getItem("openshelf.theme")).toBe("dark");

		fireEvent.click(screen.getByRole("button", { name: /switch to light theme/i }));
		expect(document.documentElement.classList.contains("dark")).toBe(false);
		expect(localStorage.getItem("openshelf.theme")).toBe("light");
	});
});
