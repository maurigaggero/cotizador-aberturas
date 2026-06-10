import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import { Calculator, DatabaseZap, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CatalogPage } from "@/pages/CatalogPage";
import { QuotePage } from "@/pages/QuotePage";
import { cn } from "@/lib/utils";

export default function App() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <NavLink to="/cotizador" className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-cyan-950/50">
              <Calculator className="size-5" />
            </span>
            <div>
              <p className="font-bold leading-tight text-white">AluQuote Argentina</p>
              <p className="text-xs text-muted-foreground">MVP hardcodeado</p>
            </div>
          </NavLink>

          <nav className="hidden items-center gap-2 md:flex">
            <NavItem to="/cotizador" icon={<Calculator className="size-4" />}>
              Cotizador
            </NavItem>
            <NavItem to="/catalogos" icon={<DatabaseZap className="size-4" />}>
              Catálogos
            </NavItem>
          </nav>

          <Button variant="outline" size="sm" className="md:hidden" aria-label="Menú">
            <Menu className="size-4" />
          </Button>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<Navigate to="/cotizador" replace />} />
        <Route path="/cotizador" element={<QuotePage />} />
        <Route path="/catalogos" element={<CatalogPage />} />
        <Route path="*" element={<Navigate to="/cotizador" replace />} />
      </Routes>
    </div>
  );
}

function NavItem({
  to,
  icon,
  children,
}: {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-white/10 hover:text-white",
          isActive && "bg-white/10 text-white",
        )
      }
    >
      {icon}
      {children}
    </NavLink>
  );
}
