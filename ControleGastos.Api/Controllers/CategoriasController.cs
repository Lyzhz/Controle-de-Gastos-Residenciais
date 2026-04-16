using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ControleGastos.Domain.Entities;
using ControleGastos.Application.Data;
using ControleGastos.Application.DTOs;

namespace ControleGastos.Api.Controllers;

// Controller responsável por gerenciar as categorias
[ApiController]
[Route("api/categorias")]
public class CategoriasController : ControllerBase
{
    private readonly AppDbContext _context;

    // Injeta o contexto do banco
    public CategoriasController(AppDbContext context)
    {
        _context = context;
    }

    // Retorna todas as categorias cadastradas
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        // Busca categorias e já projeta direto para DTO (evita expor entidade)
        var categorias = await _context.Categorias
            .Select(c => new CategoriaDTO
            {
                Id = c.Id,
                Descricao = c.Descricao,
                Finalidade = c.Finalidade
            })
            .ToListAsync();

        return Ok(categorias);
    }

    // Deleta uma categoria
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var categoria = await _context.Categorias.FindAsync(id);

        if (categoria == null)
            return NotFound();

        _context.Categorias.Remove(categoria);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // Cria uma nova categoria
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCategoriaDTO dto)
    {
        // Valida descrição obrigatória
        if (string.IsNullOrWhiteSpace(dto.Descricao))
            return BadRequest("Descrição é obrigatória");

        // Limita tamanho da descrição
        if (dto.Descricao.Length > 400)
            return BadRequest("Descrição deve ter no máximo 400 caracteres");

        // Cria entidade de categoria
        var categoria = new Categoria
        {
            Descricao = dto.Descricao,
            Finalidade = dto.Finalidade
        };

        // Persiste no banco
        _context.Categorias.Add(categoria);
        await _context.SaveChangesAsync();

        // Retorna o objeto criado como DTO
        var result = new CategoriaDTO
        {
            Id = categoria.Id,
            Descricao = categoria.Descricao,
            Finalidade = categoria.Finalidade
        };

        return Ok(result);
    }
}