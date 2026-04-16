using ControleGastos.Domain.Enums;

namespace ControleGastos.Application.DTOs;

public class CreateCategoriaDTO
{
    public string Descricao { get; set; }
    public Finalidade Finalidade { get; set; }
}