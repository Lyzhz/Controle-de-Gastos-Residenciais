namespace ControleGastos.Application.DTOs.Pessoa;

public class TotalPorPessoaDTO
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public decimal TotalReceitas { get; set; }
    public decimal TotalDespesas { get; set; }
    public decimal Saldo { get; set; }
}