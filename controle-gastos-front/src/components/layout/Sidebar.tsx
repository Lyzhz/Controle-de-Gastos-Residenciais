import { NavLink } from "react-router-dom";
import logo from "../../assets/logo.png";
import {
  LayoutDashboard,
  Users,
  Tags,
  CreditCard,
  ChevronLeft,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sidebar");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved) setCollapsed(saved === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebar", String(collapsed));
  }, [collapsed]);

  return (
    <aside
      className={`min-h-screen flex flex-col transition-all duration-300
      ${collapsed ? "w-20" : "w-64"}
      bg-white dark:bg-gray-900 
      border-r border-gray-200 dark:border-gray-800 p-4`}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col items-start">
  <img
    src={logo}
    alt="Logo"
    className={`transition-all ${
      collapsed ? "w-8 h-8" : "w-32"
    } object-contain`}
  />

{!collapsed && (
  <div>
    <p className="text-xs text-gray-500 mt-1">Controle</p>
  </div>
)}
</div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
          <ChevronLeft
  size={30}
  className={`text-gray-600 dark:text-gray-300 transition ${
    collapsed ? "rotate-180" : ""
  }`}
/>
        </button>
      </div>

      {/* NAV */}
      <nav className="flex flex-col gap-2">
        <Item collapsed={collapsed} to="/" label="Dashboard" icon={<LayoutDashboard size={18} />} />
        <Item collapsed={collapsed} to="/pessoas" label="Pessoas" icon={<Users size={18} />} />
        <Item collapsed={collapsed} to="/categorias" label="Categorias" icon={<Tags size={18} />} />
        <Item collapsed={collapsed} to="/transacoes" label="Transações" icon={<CreditCard size={18} />} />
      </nav>

      <div className="mt-auto text-xs text-gray-400">
        {!collapsed && "© Desenvolvido por Luis Nunes"}
      </div>
    </aside>
  );
}

function Item({ to, label, icon, collapsed }: { to: string; label: string; icon: React.ReactNode; collapsed: boolean }) {
  return (
    <NavLink to={to} className="group relative">
      {({ isActive }) => (
        <div
          className={`flex items-center gap-3 px-3 py-2 rounded-lg
          transition-all
          ${
            isActive
              ? "bg-blue-500/10 text-blue-600"
              : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          {icon}

          {!collapsed && <span>{label}</span>}

          {/* TOOLTIP */}
          {collapsed && (
            <span
              className="absolute left-14 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
            >
              {label}
            </span>
          )}
        </div>
      )}
    </NavLink>
  );
}