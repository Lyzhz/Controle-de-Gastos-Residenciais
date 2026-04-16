import { useLocation } from "react-router-dom";

export function Header() {
  const location = useLocation();

  function getHeaderContent() {
    const path = location.pathname;

    if (path.startsWith("/pessoas")) {
      return {
        titulo: "Pessoas",
        descricao: "Ranking financeiro por pessoa"
      };
    }

    if (path.startsWith("/categorias")) {
      return {
        titulo: "Categorias",
        descricao: "Organize receitas e despesas"
      };
    }

    if (path.startsWith("/transacoes")) {
      return {
        titulo: "Transações",
        descricao: "Registre receitas e despesas"
      };
    }

    return {
      titulo: "Dashboard",
      descricao: "Visão geral financeira"
    };
  }

  const { titulo, descricao } = getHeaderContent();

  return (
    <header className="w-full flex items-center justify-between px-6 py-4 
    bg-white/80 dark:bg-gray-900/80 backdrop-blur
    border-b border-gray-200 dark:border-gray-800">

      {/* LEFT */}
      <div>
        <h1 className="text-4xl font-semibold text-gray-900 dark:text-white">
          {titulo}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {descricao}
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Sistema ativo
        </div>

        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold">
          L
        </div>

      </div>
    </header>
  );
}