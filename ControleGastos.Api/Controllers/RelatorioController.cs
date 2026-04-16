using ControleGastos.Application.Data;
using ControleGastos.Application.DTOs;
using ControleGastos.Application.DTOs.Pessoa;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ControleGastos.Domain.Enums;

namespace ControleGastos.Api.Controllers;

// Controller responsável por relatórios agregados
[ApiController]
[Route("api/relatorios")]
public class RelatorioController : ControllerBase
{
    private readonly AppDbContext _context;

    // Injeta o contexto do banco
    public RelatorioController(AppDbContext context)
    {
        _context = context;
    }

    // Retorna totais de receitas, despesas e saldo por pessoa
    [HttpGet("pessoas")]
    public async Task<IActionResult> GetTotaisPorPessoa()
    {
        // Consulta direta no banco com agregações (mais performático que trazer tudo pra memória)
        var resultado = await _context.Pessoas
            .Select(p => new TotalPorPessoaDTO
            {
                Id = p.Id,

                Nome = p.Nome,

                // Soma receitas da pessoa (usa nullable pra evitar erro quando não há registros)
                TotalReceitas = p.Transacoes
                    .Where(t => t.Tipo == TipoTransacao.Receita)
                    .Sum(t => (decimal?)t.Valor) ?? 0,

                // Soma despesas da pessoa
                TotalDespesas = p.Transacoes
                    .Where(t => t.Tipo == TipoTransacao.Despesa)
                    .Sum(t => (decimal?)t.Valor) ?? 0,
            })
            .ToListAsync();

        // Calcula saldo após a consulta (não foi feito no banco)
        foreach (var item in resultado)
            item.Saldo = item.TotalReceitas - item.TotalDespesas;

        return Ok(resultado);
    }

    [HttpGet("{id}/transacoes")]
    public async Task<IActionResult> GetPorPessoa(Guid id)
    {
        var transacoes = await _context.Transacoes
            .Where(t => t.PessoaId == id)
            .Select(t => new
            {
                t.Id,
                t.Descricao,
                t.Valor,
                t.Tipo,
                t.Data
            })
            .ToListAsync();

        return Ok(transacoes);
    }

}