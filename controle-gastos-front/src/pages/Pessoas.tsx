import type { Pessoa } from "../types";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "../services/api";

type PessoaResumo = {
  id: string;
  nome: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
};

type PessoaComResumo = Pessoa & {
  saldo: number;
  totalReceitas: number;
  totalDespesas: number;
};

type FormPessoa = {
  nome: string;
  idade: number | "";
};

export default function Pessoas() {
  const navigate = useNavigate();

  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [resumo, setResumo] = useState<PessoaResumo[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState<FormPessoa>({
    nome: "",
    idade: ""
  });

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

  async function criar() {
    if (!form.nome || form.idade === "" || form.idade <= 0) {
      alert("Preenche direito aí");
      return;
    }

    try {
      await api.post("/pessoas", {
        nome: form.nome,
        idade: form.idade
      });

      setForm({ nome: "", idade: "" });
      await carregar();
    } catch (err) {
      console.error(err);
      alert("Erro ao criar pessoa");
    }
  }

  async function remover(id: string) {
    try {
      await api.delete(`/pessoas/${id}`);
      await carregar();
    } catch (err) {
      console.error(err);
      alert("Erro ao remover");
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  const resumoMap = new Map(resumo.map(r => [r.id, r]));

  const pessoasOrdenadas: PessoaComResumo[] = pessoas
    .map(p => {
      const r = resumoMap.get(p.id);

      return {
        ...p,
        saldo: r?.saldo ?? 0,
        totalReceitas: r?.totalReceitas ?? 0,
        totalDespesas: r?.totalDespesas ?? 0
      };
    })
    .sort((a, b) => b.saldo - a.saldo);

  function getColorFromId(id: string) {
    const colors = [
      "bg-red-500",
      "bg-green-500",
      "bg-blue-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-orange-500",
      "bg-teal-500",
    ];

    let hash = 0;

    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  }

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
            placeholder="Idade"
            value={form.idade}
            onChange={e =>
              setForm({
                ...form,
                idade: e.target.value === "" ? "" : Number(e.target.value)
              })
            }
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 
            bg-white dark:bg-gray-900 text-gray-900 dark:text-white 
            focus:ring-2 focus:ring-blue-500 outline-none"
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

      {/* LISTA */}
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

            <div className="text-sm text-blue-600 dark:text-blue-400 font-medium px-2">
              Clique em um familiar para ver o relatório de transações
            </div>

            {pessoasOrdenadas.map((p, index) => (
              <motion.div
                key={p.id}
                onClick={() => navigate(`/pessoas/${p.id}`)}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="flex justify-between items-center p-4 rounded-xl 
                bg-gray-50 dark:bg-gray-900 cursor-pointer
                border border-gray-200 dark:border-gray-700 
                hover:shadow-lg transition"
              >
                <div>
                  <div className="flex items-center gap-3">

                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${getColorFromId(p.id)}`}
                    >
                      {p.nome.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">
                        #{index + 1} • {p.nome}
                      </p>

                      <p className="text-[11px] text-gray-500">
                        ID: {p.id.slice(0, 6)} •{" "}
                        {p.idade > 0 ? `${p.idade} anos` : "Idade não informada"}
                      </p>
                    </div>

                  </div>

                  <div className="flex gap-4 mt-2 text-xs">
                    <span className="text-green-600">
                      + {p.totalReceitas.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </span>

                    <span className="text-red-500">
                      - {p.totalDespesas.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-sm font-bold ${
                      p.saldo >= 0 ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {p.saldo.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      remover(p.id);
                    }}
                    className="text-sm px-3 py-1 rounded-md cursor-pointer
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