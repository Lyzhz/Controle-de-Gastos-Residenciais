import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";

import DashboardCards from "./components/dashboard/DashboardCards";
import Relatorio from "./pages/Relatorio";
import Pessoas from "./pages/Pessoas";
import Categorias from "./pages/Categorias";
import Transacoes from "./pages/Transacoes";

export default function App() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          <Header dark={dark} setDark={setDark} />

          <main className="p-6 space-y-6">
            <Routes>
              <Route path="/" element={<DashboardCards />} />
              <Route path="/relatorio" element={<Relatorio />} />
              <Route path="/pessoas" element={<Pessoas />} />
              <Route path="/categorias" element={<Categorias />} />
              <Route path="/transacoes" element={<Transacoes />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}