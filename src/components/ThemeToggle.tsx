import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

/**
 * Componente de alternância de tema (Light/Dark Mode)
 * - Exibe ícone ☀️ no modo escuro e 🌙 no modo claro
 * - Alterna entre os temas ao clicar
 * - Guarda preferência no localStorage via next-themes
 */
export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Evitar hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 right-4 z-50"
        aria-label="Alternar tema"
      >
        <span className="text-xl">🌙</span>
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="fixed top-4 right-4 z-50 hover:bg-accent/10"
      aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
    >
      <span className="text-xl">{theme === "dark" ? "☀️" : "🌙"}</span>
    </Button>
  );
};
