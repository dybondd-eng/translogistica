import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Truck, Menu, X, Lock } from "lucide-react";

const links = [
  { to: "/", label: "Início" },
  { to: "/rastrear", label: "Rastrear Pedido" },
  { to: "/sobre", label: "Sobre Nós" },
  { to: "/contato", label: "Contato" },
];

export const SiteHeader = () => {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10">
        <Link to="/" className="flex items-center gap-3" data-testid="logo-link">
          <span className="flex h-10 w-10 items-center justify-center bg-[#FF5A00] text-white">
            <Truck size={22} strokeWidth={2.4} />
          </span>
          <span className="font-display text-xl font-black tracking-tight text-zinc-950">
            Trans<span className="text-[#FF5A00]">Log</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              data-testid={`nav-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
              className={({ isActive }) =>
                `label-caps transition-colors duration-200 ${
                  isActive ? "text-[#FF5A00]" : "text-zinc-500 hover:text-zinc-950"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <Link
            to="/admin/login"
            data-testid="nav-admin"
            className="flex items-center gap-2 border border-zinc-900 px-4 py-2 label-caps text-zinc-900 transition-all duration-200 hover:-translate-y-[2px] hover:bg-zinc-900 hover:text-white"
          >
            <Lock size={13} /> Admin
          </Link>
        </nav>

        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          data-testid="mobile-menu-toggle"
          aria-label="Menu"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-zinc-200 bg-white px-5 py-4 md:hidden" data-testid="mobile-menu">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              onClick={() => setOpen(false)}
              className="block py-3 text-base font-medium text-zinc-800"
            >
              {l.label}
            </NavLink>
          ))}
          <Link to="/admin/login" onClick={() => setOpen(false)} className="block py-3 text-base font-medium text-[#FF5A00]">
            Área do Administrador
          </Link>
        </nav>
      )}
    </header>
  );
};
