export interface Pessoa {
  id: string;
  nome: string;
  idade: number;
}

export interface CreatePessoa {
  nome: string;
  idade: number;
}

export interface Categoria {
  id: string;
  descricao: string;
  finalidade: number;
}

export interface CreateCategoria {
  descricao: string;
  finalidade: number;
}

export interface CreateTransacao {
  descricao: string;
  valor: number;
  tipo: number;
  categoriaId: string;
  pessoaId: string;
}