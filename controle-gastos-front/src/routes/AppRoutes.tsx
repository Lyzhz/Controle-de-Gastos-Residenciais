import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";

import Dashboard from "../pages/Dashboard";
import Pessoas from "../pages/Pessoas";
import Categorias from "../pages/Categorias";
import Transacoes from "../pages/Transacoes";
import Relatorio from "../pages/Relatorio";
import { Header } from "../components/layout/Header";
import PessoaDetalhe from "../pages/PessoaDetalhe";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          <Header />

          <main className="flex-1 p-6 space-y-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/pessoas" element={<Pessoas />} />
              <Route path="/pessoas/:id" element={<PessoaDetalhe />} />
              <Route path="/categorias" element={<Categorias />} />
              <Route path="/transacoes" element={<Transacoes />} />
              <Route path="/relatorio" element={<Relatorio />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}