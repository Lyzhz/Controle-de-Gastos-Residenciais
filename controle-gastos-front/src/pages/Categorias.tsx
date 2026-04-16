import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { Categoria, CreateCategoria } from "../types";
import { motion } from "framer-motion";

export default function Categorias() {
  // Lista de categorias carregadas da API
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  // Controle de loading da tela
  const [loading, setLoading] = useState(true);

  // Estado do formulário de criação
  const [form, setForm] = useState<CreateCategoria>({
    descricao: "",
    finalidade: 0
  });

  // Carrega categorias do backend
  async function carregar() {
    setLoading(true);
    const res = await api.get("/categorias");
    setCategorias(res.data);
    setLoading(false);
  }

  // Cria nova categoria
  async function criar() {
    // Validação básica no front (evita request inútil)
    if (!form.descricao) {
      alert("Coloca uma descrição aí 👀");
      return;
    }

    await api.post("/categorias", form);

    // Limpa o formulário após criar
    setForm({ descricao: "", finalidade: 0 });

    // Recarrega lista (simples, mas faz outra request)
    carregar();
  }

  // Remove categoria pelo id
  async function remover(id: string) {
    try {
      await api.delete(`/categorias/${id}`);
      await carregar(); // atualiza lista após remover
    } catch (err) {
      console.error(err);
      alert("Erro ao deletar categoria");
    }
  }

  // Traduz o enum numérico para texto amigável
  function getFinalidadeLabel(tipo: number) {
    if (tipo === 0) return "Receita";
    if (tipo === 1) return "Despesa";
    return "Ambas";
  }

  // Retorna classes de cor baseado no tipo (UI)
  function getFinalidadeColor(tipo: number) {
    if (tipo === 0) return "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300";
    if (tipo === 1) return "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300";
    return "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300";
  }

  // Carrega dados ao montar o componente
  useEffect(() => {
    const load = async () => {
      await carregar();
    };

    load();
  }, []);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Categorias
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Organize receitas e despesas
          </p>
        </div>

        {/* Contador de categorias */}
        <span className="text-xs px-3 py-1 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300">
          {categorias.length} categorias
        </span>
      </div>

      {/* FORM */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-3 gap-4">

          {/* Input de descrição */}
          <input
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 
            bg-white dark:bg-gray-900 text-gray-900 dark:text-white 
            focus:ring-2 focus:ring-purple-500 outline-none"
            placeholder="Descrição"
            value={form.descricao}
            onChange={e => setForm({ ...form, descricao: e.target.value })}
          />

          {/* Select de finalidade */}
          <select
            value={form.finalidade}
            onChange={e => setForm({ ...form, finalidade: Number(e.target.value) })}
            className="p-2 cursor-pointer rounded-lg border border-gray-300 dark:border-gray-700 
            bg-white dark:bg-gray-900 text-gray-900 dark:text-white 
            focus:ring-2 focus:ring-purple-500 outline-none"
          >
            <option value={0}>Receita</option>
            <option value={1}>Despesa</option>
            <option value={2}>Ambas</option>
          </select>

          {/* Botão de criar */}
          <button
            onClick={criar}
            className="bg-purple-600 hover:bg-purple-700 cursor-pointer
            text-white rounded-lg font-medium transition"
          >
            + Criar
          </button>
        </div>
      </div>

      {/* LISTA */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow border border-gray-200 dark:border-gray-700">

        {/* Estado de carregamento */}
        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">
            Carregando...
          </p>

        // Estado vazio
        ) : categorias.length === 0 ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            <p>Nenhuma categoria criada</p>
            <p className="text-xs">Crie sua primeira categoria</p>
          </div>

        // Lista de categorias
        ) : (
          <div className="space-y-3">
            {categorias.map(c => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="flex justify-between items-center p-4 rounded-lg 
                bg-gray-50 dark:bg-gray-900 
                border border-gray-200 dark:border-gray-700 
                hover:shadow-md transition"
              >
                <div>
                  {/* Nome da categoria */}
                  <p className="font-medium text-gray-900 dark:text-white">
                    {c.descricao}
                  </p>

                  {/* Badge de tipo */}
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getFinalidadeColor(c.finalidade)}`}
                  >
                    {getFinalidadeLabel(c.finalidade)}
                  </span>
                </div>

                {/* Botão de remover */}
                <button
                  onClick={() => remover(c.id)}
                  className="text-sm px-3 py-1 rounded-md 
                  bg-red-100 text-red-600 
                  hover:bg-red-200 
                  cursor-pointer
                  dark:bg-red-900 dark:text-red-300 
                  transition"
                >
                  Remover
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}