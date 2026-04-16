import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { Pessoa, CreatePessoa } from "../types";
import { motion } from "framer-motion";

// Resumo vindo do endpoint de relatórios
type PessoaResumo = {
  nome: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
};

// Tipo combinado (dados da pessoa + resumo financeiro)
type PessoaComResumo = Pessoa & {
  saldo: number;
  totalReceitas: number;
  totalDespesas: number;
};

export default function Pessoas() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [resumo, setResumo] = useState<PessoaResumo[]>([]);
  const [loading, setLoading] = useState(true);

  // Estado do formulário
  const [form, setForm] = useState<CreatePessoa>({
    nome: "",
    idade: 0
  });

  // Carrega pessoas + resumo em paralelo
  async function carregar() {
    try {
      setLoading(true);

      const [pessoasRes, resumoRes] = await Promise.all([
        api.get("/pessoas"),
        api.get("/relatorios/pessoas")
      ]);

      setPessoas(pessoasRes.data);
      setResumo(resumoRes.data);

    } catch (err) {
      console.error(err);
      alert("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  }

  // Cria nova pessoa
  async function criar() {
    // Validação simples no front
    if (!form.nome || form.idade <= 0) {
      alert("Preenche direito aí 👀");
      return;
    }

    try {
      await api.post("/pessoas", form);

      // Limpa formulário e recarrega lista
      setForm({ nome: "", idade: 0 });
      await carregar();
    } catch (err) {
      console.error(err);
      alert("Erro ao criar pessoa");
    }
  }

  // Remove pessoa
  async function remover(id: string) {
    try {
      await api.delete(`/pessoas/${id}`);
      await carregar();
    } catch (err) {
      console.error(err);
      alert("Erro ao remover");
    }
  }

  // Carrega dados ao montar componente
  useEffect(() => {
    carregar();
  }, []);

  // Mapeia resumo por nome para evitar .find() repetido (melhor performance)
  const resumoMap = new Map(resumo.map(r => [r.nome, r]));

  // Junta dados de pessoa + resumo financeiro e ordena por saldo
  const pessoasOrdenadas: PessoaComResumo[] = pessoas
    .map(p => {
      const r = resumoMap.get(p.nome);

      return {
        ...p,
        saldo: r?.saldo ?? 0,
        totalReceitas: r?.totalReceitas ?? 0,
        totalDespesas: r?.totalDespesas ?? 0
      };
    })
    .sort((a, b) => b.saldo - a.saldo);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Pessoas
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Ranking financeiro por pessoa
          </p>
        </div>

        <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
          {pessoas.length} cadastrados
        </span>
      </div>

      {/* FORM */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-3 gap-4">

          <input
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 
            bg-white dark:bg-gray-900 text-gray-900 dark:text-white 
            focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Nome"
            value={form.nome}
            onChange={e => setForm({ ...form, nome: e.target.value })}
          />

          <input
            type="number"
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 
            bg-white dark:bg-gray-900 text-gray-900 dark:text-white 
            focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Idade"
            value={form.idade}
            onChange={e => setForm({ ...form, idade: Number(e.target.value) })}
          />

          <button
            onClick={criar}
            className="bg-blue-600 hover:bg-blue-700 cursor-pointer
            text-white rounded-lg font-medium transition"
          >
            + Criar
          </button>
        </div>
      </div>

      {/* LISTA / RANKING */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow border border-gray-200 dark:border-gray-700">

        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">
            Carregando...
          </p>
        ) : pessoasOrdenadas.length === 0 ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            <p>Nenhuma pessoa cadastrada</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pessoasOrdenadas.map((p, index) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="flex justify-between items-center p-4 rounded-xl 
                bg-gray-50 dark:bg-gray-900 
                border border-gray-200 dark:border-gray-700 
                hover:shadow-lg transition"
              >
                <div>
                  {/* Nome + posição no ranking */}
                  <p className="font-semibold text-gray-900 dark:text-white">
                    #{index + 1} • {p.nome}
                  </p>

                  <p className="text-xs text-gray-500">
                    {p.idade} anos
                  </p>

                  {/* Resumo financeiro */}
                  <div className="flex gap-4 mt-2 text-xs">
                    <span className="text-green-600">
                      + R$ {p.totalReceitas}
                    </span>

                    <span className="text-red-500">
                      - R$ {p.totalDespesas}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Saldo final */}
                  <span
                    className={`text-sm font-bold ${
                      p.saldo >= 0
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    R$ {p.saldo}
                  </span>

                  <button
                    onClick={() => remover(p.id)}
                    className="text-sm px-3 py-1 rounded-md 
                    bg-red-100 text-red-600 
                    hover:bg-red-200 
                    dark:bg-red-900 dark:text-red-300"
                  >
                    Remover
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}