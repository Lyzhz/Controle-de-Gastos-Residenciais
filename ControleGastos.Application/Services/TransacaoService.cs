using ControleGastos.Application.Data;
using ControleGastos.Application.DTOs;
using ControleGastos.Application.DTOs.Transacao;
using ControleGastos.Domain.Entities;
using ControleGastos.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Application.Services;

// Serviço responsável por gerenciar operações relacionadas a Transações
public class TransacaoService
{
    private readonly AppDbContext _context;

    // Injeta o contexto do banco
    public TransacaoService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<TransacaoDTO>> ObterPorPessoaAsync(Guid pessoaId)
    {
        return await _context.Transacoes
            .Where(t => t.PessoaId == pessoaId)
            .Select(t => new TransacaoDTO
            {
                Id = t.Id,
                Descricao = t.Descricao,
                Valor = t.Valor,
                Tipo = t.Tipo,
                CategoriaId = t.CategoriaId,
                PessoaId = t.PessoaId
            })
            .ToListAsync();
    }

    // Cria uma nova transação com validações de regra de negócio
    public async Task<TransacaoDTO> CriarAsync(CreateTransacaoDTO dto)
    {
        var pessoa = await _context.Pessoas
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == dto.PessoaId);

        var categoria = await _context.Categorias
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == dto.CategoriaId);

        if (pessoa == null)
            throw new Exception("Pessoa não encontrada");

        if (categoria == null)
            throw new Exception("Categoria não encontrada");

        if (string.IsNullOrWhiteSpace(dto.Descricao))
            throw new Exception("Descrição é obrigatória");

        if (dto.Descricao.Length > 400)
            throw new Exception("Descrição deve ter no máximo 400 caracteres");

        if (dto.Valor <= 0)
            throw new Exception("Valor deve ser positivo");

        if (pessoa.Idade < 18 && dto.Tipo == TipoTransacao.Receita)
            throw new Exception("Menor de idade não pode ter receita");

        if (categoria.Finalidade != Finalidade.Ambas)
        {
            if ((categoria.Finalidade == Finalidade.Receita && dto.Tipo == TipoTransacao.Despesa) ||
                (categoria.Finalidade == Finalidade.Despesa && dto.Tipo == TipoTransacao.Receita))
            {
                throw new Exception("Categoria incompatível com o tipo da transação");
            }
        }

        var transacao = new Transacao
        {
            Descricao = dto.Descricao,
            Valor = dto.Valor,
            Data = DateTime.UtcNow,
            Tipo = dto.Tipo,
            CategoriaId = dto.CategoriaId,
            PessoaId = dto.PessoaId
        };

        _context.Transacoes.Add(transacao);
        await _context.SaveChangesAsync();

        return new TransacaoDTO
        {
            Id = transacao.Id,
            Descricao = transacao.Descricao,
            Valor = transacao.Valor,
            Tipo = transacao.Tipo,
            CategoriaId = transacao.CategoriaId,
            PessoaId = transacao.PessoaId
        };
    }
}