using ControleGastos.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Application.Data;

// Contexto principal do Entity Framework.
// Responsável por mapear as entidades para o banco e gerenciar acesso aos dados.
public class AppDbContext : DbContext
{
    // Recebe as configurações do banco (connection string, provider, etc)
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

    // Representa a tabela de pessoas no banco
    public DbSet<Pessoa> Pessoas { get; set; }

    // Representa a tabela de categorias (ex: alimentação, transporte, etc)
    public DbSet<Categoria> Categorias { get; set; }

    // Representa a tabela de transações financeiras
    public DbSet<Transacao> Transacoes { get; set; }

    // Configurações adicionais de modelo (relacionamentos, regras, etc)
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Define o relacionamento:
        // Uma Transação pertence a uma Pessoa
        // Uma Pessoa pode ter várias Transações
        modelBuilder.Entity<Transacao>()
            .HasOne(t => t.Pessoa)              // Transação tem uma Pessoa
            .WithMany(p => p.Transacoes)        // Pessoa tem várias Transações
            .HasForeignKey(t => t.PessoaId)     // Chave estrangeira
            .OnDelete(DeleteBehavior.Cascade);  // Ao deletar Pessoa, deleta as Transações

        // Chama a configuração padrão do EF
        base.OnModelCreating(modelBuilder);
    }
}