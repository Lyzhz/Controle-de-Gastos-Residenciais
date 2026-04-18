import { useEffect, useState } from "react";
import { api } from "../services/api";
import axios from "axios";
import type { Pessoa, Categoria, CreateTransacao } from "../types";

export default function Transacoes() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);

  // Estado inicial do formulário
  const initialForm: CreateTransacao = {
    descricao: "",
    valor: 0,
    tipo: 0,
    categoriaId: "",
    pessoaId: ""
  };

  const [form, setForm] = useState<CreateTransacao>(initialForm);

  // Carrega pessoas e categorias (dependências do formulário)
  async function carregar() {
    setLoading(true);

    const [p, c] = await Promise.all([
      api.get("/pessoas"),
      api.get("/categorias")
    ]);

    setPessoas(p.data);
    setCategorias(c.data);

    setLoading(false);
  }

  // Cria nova transação com validações básicas no front
  async function criar() {
    if (!form.descricao || !form.pessoaId || !form.categoriaId) {
      alert("Preencha todos os campos");
      return;
    }

    if (form.valor <= 0) {
      alert("Valor inválido");
      return;
    }

    // Regra de negócio replicada no front (evita request desnecessária)
    const pessoa = pessoas.find(p => p.id === form.pessoaId);

    if (pessoa && pessoa.idade < 18 && form.tipo === 0) {
      alert("Menor de idade não pode ter receita.");
      return;
    }

    try {
      // Monta payload explicitamente (evita enviar lixo do state)
      const payload = {
        descricao: form.descricao,
        valor: form.valor,
        tipo: form.tipo,
        pessoaId: form.pessoaId,
        categoriaId: form.categoriaId
      };

      console.log("ENVIANDO:", payload);

      await api.post("/transacoes", payload, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      alert("Criado com sucesso!");

      // Reseta form e recarrega dados
      setForm(initialForm);
      carregar();

    } catch (err) {
      console.error("ERRO COMPLETO:", err);

      // Tratamento detalhado de erro da API
      if (axios.isAxiosError(err)) {
        const data = err.response?.data;

        console.log("BACK RESP:", data);

        // validações do backend
        if (data?.errors) {
          const mensagens = Object.values(data.errors).flat();
          alert(mensagens.join("\n"));

        // Caso backend retorne string simples
        } else if (typeof data === "string") {
          alert(data);

        } else {
          alert("Erro ao criar transação");
        }
      } else {
        alert("Erro inesperado");
      }
    }
  }

  // Carrega dados ao montar
  useEffect(() => {
    const load = async () => {
      await carregar();
    };

    load();
  }, []);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Transações
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Registre receitas e despesas
        </p>
      </div>

      {/* FORM DE CRIAÇÃO */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow border border-gray-200 dark:border-gray-700">

        <div className="grid grid-cols-6 gap-4">

          <input
            className="col-span-2 p-2 rounded-lg border border-gray-300 dark:border-gray-700 
            bg-white dark:bg-gray-900 text-gray-900 dark:text-white 
            focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Descrição"
            value={form.descricao}
            onChange={e => setForm({ ...form, descricao: e.target.value })}
          />

          <input
            type="number"
            className="col-span-1 p-2 rounded-lg border border-gray-300 dark:border-gray-700 
            bg-white dark:bg-gray-900 text-gray-900 dark:text-white 
            focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Valor"
            value={form.valor}
            onChange={e => setForm({ ...form, valor: Number(e.target.value) })}
          />

          {/* Tipo muda cor da borda dinamicamente */}
          <select
            value={form.tipo}
            onChange={e => setForm({ ...form, tipo: Number(e.target.value) })}
            className={`col-span-1 p-2 rounded-lg border 
              ${form.tipo === 0
                ? "border-green-300 cursor-pointer dark:border-green-700"
                : "border-red-300 cursor-pointer dark:border-red-700"} 
              bg-white dark:bg-gray-900 
              text-gray-900 dark:text-white`}
          >
            <option value={0}>Receita</option>
            <option value={1}>Despesa</option>
          </select>

          <select
            value={form.pessoaId}
            onChange={e => setForm({ ...form, pessoaId: e.target.value })}
            className="col-span-1 p-2 cursor-pointer rounded-lg border border-gray-300 dark:border-gray-700 
            bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          >
            <option value="">Pessoa</option>
            {pessoas.map(p => (
              <option key={p.id} value={p.id}>
                {p.nome} • {p.id.slice(0, 4)} • {p.idade > 0 ? `${p.idade} anos` : ""}
              </option>
            ))}
          </select>

          <select
            value={form.categoriaId}
            onChange={e => setForm({ ...form, categoriaId: e.target.value })}
            className="col-span-1 p-2 cursor-pointer rounded-lg border border-gray-300 dark:border-gray-700 
            bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          >
            <option value="">Categoria</option>
            {categorias.map(c => (
              <option key={c.id} value={c.id}>
                {c.descricao}
              </option>
            ))}
          </select>

          <button
            onClick={criar}
            className="col-span-6 mt-2 cursor-pointer bg-blue-600 hover:bg-blue-700 
            text-white py-2 rounded-lg font-medium transition"
          >
            + Registrar transação
          </button>
        </div>
      </div>

      {/* FEEDBACK DE ESTADO */}
      {loading && (
        <p className="text-gray-500 dark:text-gray-400">
          Carregando dados...
        </p>
      )}

      {!loading && pessoas.length === 0 && (
        <div className="text-center text-gray-500 dark:text-gray-400 py-10">
          <p>Você precisa cadastrar pessoas primeiro</p>
        </div>
      )}
    </div>
  );
}
