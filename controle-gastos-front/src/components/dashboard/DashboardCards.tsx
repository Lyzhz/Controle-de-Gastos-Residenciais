import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { motion } from "framer-motion";

// Resumo financeiro por pessoa (vem da API)
type PessoaResumo = {
  id: string;
  nome: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
};

// Totais consolidados do dashboard
type DashboardData = {
  receitas: number;
  despesas: number;
  saldo: number;
};

export default function DashboardCards() {
  // Totais gerais (cards)
  const [data, setData] = useState<DashboardData>({
    receitas: 0,
    despesas: 0,
    saldo: 0,
  });

  // Lista de pessoas (ranking)
  const [pessoas, setPessoas] = useState<PessoaResumo[]>([]);
  const [loading, setLoading] = useState(true);

  // Carrega dados do backend e faz agregações
  async function carregar() {
    setLoading(true);

    const res = await api.get<PessoaResumo[]>("/relatorios/pessoas");

    // Soma total de receitas de todas as pessoas
    const totalReceitas = res.data.reduce(
      (acc, p) => acc + p.totalReceitas,
      0
    );

    // Soma total de despesas
    const totalDespesas = res.data.reduce(
      (acc, p) => acc + p.totalDespesas,
      0
    );

    // Atualiza cards principais
    setData({
      receitas: totalReceitas,
      despesas: totalDespesas,
      saldo: totalReceitas - totalDespesas,
    });

    // Ordena pessoas por saldo (ranking financeiro)
    const ordenado = [...res.data].sort((a, b) => b.saldo - a.saldo);
    setPessoas(ordenado);

    setLoading(false);
  }

  // Executa carregamento ao montar componente
  useEffect(() => {
    const load = async () => {
      await carregar();
    };

    load();
  }, []);

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
      {/* CARDS RESUMO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Receitas" value={data.receitas} loading={loading} color="green" />
        <Card title="Despesas" value={data.despesas} loading={loading} color="red" />
        <Card title="Saldo" value={data.saldo} loading={loading} color={data.saldo >= 0 ? "green" : "red"} />
      </div>

      {/* RANKING FINANCEIRO */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Ranking financeiro
        </h3>

        {/* Estado de carregamento */}
        {loading ? (
          <p className="text-gray-400">Carregando...</p>
        ) : (
          <div className="space-y-3">
            {/* Mostra apenas top 5 */}
            {pessoas.slice(0, 5).map((p, i) => (
              <div key={p.id} className="flex justify-between items-center text-sm">

  <div className="flex items-center gap-2">

    {/* POSIÇÃO */}
    <span className="text-xs text-gray-400 w-5">
      #{i + 1}
    </span>

    {/* AVATAR */}
    <div
      className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${getColorFromId(p.id)}`}
    >
      {p.nome.charAt(0).toUpperCase()}
    </div>

    {/* NOME + ID */}
    <div>
      <p className="text-gray-800 dark:text-gray-200 text-sm">
        {p.nome}
      </p>

      <p className="text-[10px] text-gray-400">
        {p.id.slice(0, 4)}
      </p>
    </div>

  </div>

  {/* SALDO */}
  <span
    className={`font-semibold ${
      p.saldo >= 0 ? "text-green-600" : "text-red-500"
    }`}
  >
    {p.saldo.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })}
  </span>
</div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

// Componente de card individual do dashboard
function Card({
  title,
  value,
  loading,
  color,
}: {
  title: string;
  value: number;
  loading: boolean;
  color: "green" | "red";
}) {
  // Mapeia cor lógica para classes visuais
  const colorMap = {
    green: "text-green-600 dark:text-green-400",
    red: "text-red-600 dark:text-red-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow border border-gray-200 dark:border-gray-700 hover:shadow-lg transition"
    >
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {title}
      </p>

      {/* Skeleton enquanto carrega */}
      {loading ? (
        <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-2" />
      ) : (
        <h3 className={`text-2xl font-bold mt-2 ${colorMap[color]}`}>
          {value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </h3>
      )}
    </motion.div>
  );
}