import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
const STORAGE_KEY = "openshelf.theme";

interface ThemeApi {
	theme: Theme;
	setTheme: (theme: Theme) => void;
	toggle: () => void;
}

const ThemeContext = createContext<ThemeApi | null>(null);

function getInitialTheme(): Theme {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored === "light" || stored === "dark") return stored;
	} catch {
		// ignore
	}
	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

export function useTheme(): ThemeApi {
	const ctx = useContext(ThemeContext);
	if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
	return ctx;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setThemeState] = useState<Theme>(getInitialTheme);

	useEffect(() => {
		document.documentElement.classList.toggle("dark", theme === "dark");
		try {
			localStorage.setItem(STORAGE_KEY, theme);
		} catch {
			// ignore
		}
	}, [theme]);

	const value: ThemeApi = {
		theme,
		setTheme: setThemeState,
		toggle: () => setThemeState((t) => (t === "dark" ? "light" : "dark")),
	};

	return (
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	);
}
