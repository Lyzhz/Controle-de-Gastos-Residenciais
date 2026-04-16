export type PessoaDTO = {
  id: string;
  nome: string;
  idade: number;
};

export type CategoriaDTO = {
  id: string;
  descricao: string;
  finalidade: number;
};

export type TransacaoDTO = {
  id: string;
  descricao: string;
  valor: number;
  tipo: number;
  categoriaId: string;
  pessoaId: string;
};

export type PessoaResumoDTO = {
  nome: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
};