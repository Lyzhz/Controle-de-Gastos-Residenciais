using ControleGastos.Application.Data;
using ControleGastos.Application.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlite("Data Source=gastos.db"));


builder.Services.AddScoped<TransacaoService>();
builder.Services.AddScoped<RelatorioService>();

builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseCors("AllowFrontend");

app.UseSwagger();
app.UseSwaggerUI();

app.MapControllers();

// Ensure database schema has the Data column on Transacoes
using (var scope = app.Services.CreateScope())
{
    try
    {
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        // Ensure database is created for development
        db.Database.EnsureCreated();

        var conn = db.Database.GetDbConnection();
        conn.Open();

        using var cmd = conn.CreateCommand();
        cmd.CommandText = "PRAGMA table_info('Transacoes');";
        using var reader = cmd.ExecuteReader();
        var hasData = false;
        while (reader.Read())
        {
            if (reader.GetString(1) == "Data")
            {
                hasData = true;
                break;
            }
        }

        if (!hasData)
        {
            using var addCmd = conn.CreateCommand();

            addCmd.CommandText = "ALTER TABLE Transacoes ADD COLUMN Data TEXT NOT NULL DEFAULT (datetime('now'));";
            addCmd.ExecuteNonQuery();
        }

        conn.Close();
    }
    catch (Exception ex)
    {
        Console.WriteLine("DB schema check failed: " + ex.Message);
    }
}

app.Run();