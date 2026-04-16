import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../services/api";

type Transacao = {
  id: string;
  descricao: string;
  valor: number;
  tipo: number;
  data: string;
};

export default function PessoaDetalhe() {
  const { id } = useParams();
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState(true);

  async function carregar() {
    if (!id) return;

    try {
      const res = await api.get(`/relatorios/${id}/transacoes`);
      setTransacoes(res.data);
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar transações");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, [id]);

  return (
    <div className="space-y-6">

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        Histórico da pessoa
      </h2>

      {loading ? (
        <p>Carregando...</p>
      ) : transacoes.length === 0 ? (
        <p className="text-gray-500">Nenhuma transação</p>
      ) : (
        <div className="space-y-3">
          {transacoes.map(t => (
            <div
              key={t.id}
              className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-center">
                
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {t.descricao}
                  </p>

                  <p className="text-xs text-gray-500">
                    {new Date(t.data).toLocaleDateString("pt-BR")}
                  </p>
                </div>

                <p
                  className={`text-sm font-semibold ${
                    t.tipo === 0 ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {t.tipo === 0 ? "+" : "-"}{" "}
                  {t.valor.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}