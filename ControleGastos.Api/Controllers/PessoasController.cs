using ControleGastos.Application.Data;
using ControleGastos.Application.DTOs;
using ControleGastos.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Controllers;

// Controller responsável por gerenciar pessoas
[ApiController]
[Route("api/pessoas")]
public class PessoasController : ControllerBase
{
    private readonly AppDbContext _context;

    // Injeta o contexto do banco
    public PessoasController(AppDbContext context)
    {
        _context = context;
    }

    // Retorna todas as pessoas cadastradas
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        // Busca pessoas e projeta diretamente para DTO
        var pessoas = await _context.Pessoas
            .Select(p => new PessoaDTO
            {
                Id = p.Id,
                Nome = p.Nome,
                Idade = p.Idade
            })
            .ToListAsync();

        return Ok(pessoas);
    }

    // Cria uma nova pessoa
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreatePessoaDTO dto)
    {
        // Valida nome obrigatório
        if (string.IsNullOrWhiteSpace(dto.Nome))
            return BadRequest("Nome é obrigatório");

        // Limita tamanho do nome
        if (dto.Nome.Length > 200)
            return BadRequest("Nome deve ter no máximo 200 caracteres");

        // Valida idade (não pode ser negativa)
        if (dto.Idade < 0)
            return BadRequest("Idade inválida");

        // Cria entidade
        var pessoa = new Pessoa
        {
            Nome = dto.Nome,
            Idade = dto.Idade
        };

        // Persiste no banco
        try
        {
            _context.Pessoas.Add(pessoa);
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.InnerException?.Message ?? ex.Message);
        }

        // Retorna DTO com dados criados
        var result = new PessoaDTO
        {
            Id = pessoa.Id,
            Nome = pessoa.Nome,
            Idade = pessoa.Idade
        };

        return Ok(result);
    }

    // Remove uma pessoa pelo ID
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        // Busca a pessoa no banco
        var pessoa = await _context.Pessoas.FindAsync(id);

        // Retorna 404 se não existir
        if (pessoa == null)
            return NotFound("Pessoa não encontrada");

        // Remove a entidade
        _context.Pessoas.Remove(pessoa);
        await _context.SaveChangesAsync();

        return NoContent(); // 204 - sucesso sem retorno
    }
}