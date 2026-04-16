using ControleGastos.Domain.Enums;

namespace ControleGastos.Application.DTOs.Transacao;

public class CreateTransacaoDTO
{
    public string Descricao { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public DateTime Data { get; set; }

    public TipoTransacao Tipo { get; set; }

    public Guid CategoriaId { get; set; }
    public Guid PessoaId { get; set; }
}