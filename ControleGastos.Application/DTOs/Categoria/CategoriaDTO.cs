using ControleGastos.Domain.Enums;

namespace ControleGastos.Application.DTOs;

public class CategoriaDTO
{
    public Guid Id { get; set; }
    public string Descricao { get; set; }
    public Finalidade Finalidade { get; set; }
}