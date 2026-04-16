using ControleGastos.Application.DTOs;
using ControleGastos.Application.DTOs.Pessoa;
using ControleGastos.Application.Data;
using ControleGastos.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Application.Services;

// Serviço responsável por gerar relatórios agregados (visão consolidada dos dados)
public class RelatorioService
{
    private readonly AppDbContext _context;

    // Injeta o contexto do banco para acesso aos dados
    public RelatorioService(AppDbContext context)
    {
        _context = context;
    }

    // Retorna o total de receitas, despesas e saldo por pessoa
    public async Task<List<TotalPorPessoaDTO>> ObterTotaisAsync()
    {
        // Carrega todas as pessoas junto com suas transações
        // (Include evita múltiplas consultas no banco - eager loading)
        var pessoas = await _context.Pessoas
            .Include(p => p.Transacoes)
            .ToListAsync();

        // Para cada pessoa, calcula os totais
        return pessoas.Select(p =>
        {
            // Soma apenas transações do tipo Receita
            var receitas = p.Transacoes
                .Where(t => t.Tipo == TipoTransacao.Receita)
                .Sum(t => t.Valor);

            // Soma apenas transações do tipo Despesa
            var despesas = p.Transacoes
                .Where(t => t.Tipo == TipoTransacao.Despesa)
                .Sum(t => t.Valor);

            // Monta o DTO com os dados consolidados
            return new TotalPorPessoaDTO
            {
                Nome = p.Nome,
                TotalReceitas = receitas,
                TotalDespesas = despesas,
                Saldo = receitas - despesas // cálculo final do saldo
            };
        }).ToList();
    }
}