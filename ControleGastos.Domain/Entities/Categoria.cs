using ControleGastos.Domain.Enums;

namespace ControleGastos.Domain.Entities;

public class Categoria
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string Descricao { get; set; }

    public Finalidade Finalidade { get; set; }
}