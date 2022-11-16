//criar projeto:
//	dotnet new webabi -minimal -o NomeDoProjeto
//entrar na pasta:
//	cd NomeDoProjeto
//adicionar entity framework no console:
//	dotnet add package Microsoft.EntityFrameworkCore.InMemory --version 6.0
//	dotnet add package Microsoft.EntityFrameworkCore.Sqlite --version 6.0
//	dotnet add package Microsoft.EntityFrameworkCore.Design --version 6.0
//incluir namespace do entity framework:
//	using Microsoft.EntityFrameworkCore;
//antes de rodar o dotnet run pela primeira vez, rodar os seguintes comandos para iniciar a base de dados:
//	dotnet ef migrations add InitialCreate
//	dotnet ef database update


using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;



namespace Trabalho
{
    class Cliente
    {
        public int id { get; set; }
        public string? nome { get; set; }
        public string? cpf { get; set; }
        public double bonus { get; set; }
        public string? endereco { get; set; }
        public int idade { get; set; }

    }

    class Filme
    {
        public int id { get; set; }
        public string? nome { get; set; }
        public string? genero { get; set; }
        public int classificacao { get; set; }
        public double preco { get; set; }
    }

    class Locacao
    {
        public int id { get; set; }
        public int idF { get; set; }
        public int idC { get; set; }
        public string? status { get; set; }
        public DateTime? dataL { get; set; }
        public DateTime? dataD { get; set; }
        public double preco { get; set; }
    }

    class BaseUsuarios : DbContext
    {
        public BaseUsuarios(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Cliente> Clientes { get; set; } = null!;
        public DbSet<Filme> Filmes { get; set; } = null!;
        public DbSet<Locacao> Locacoes { get; set; } = null!;

    }

    class Program
    {
        static void Main(string[] args)
        {
            //cria builder da aplicacao
            var builder = WebApplication.CreateBuilder(args);

            //adiciona database ao builder
            var connectionString = builder.Configuration.GetConnectionString("Usuarios") ?? "Data Source=Usuarios.db";

            builder.Services.AddSqlite<BaseUsuarios>(connectionString);

            //adiciona politica permissiva de cross-origin ao builder
            builder.Services.AddCors(options => options.AddDefaultPolicy(policy => policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));

            //cria aplicacao usando o builder
            var app = builder.Build();

            app.UseCors();

            //listar todos
            app.MapGet("/clientes", (BaseUsuarios baseUsuarios) =>
            {
                return baseUsuarios.Clientes.ToList();
            });

            app.MapGet("/filmes", (BaseUsuarios baseUsuarios) =>
            {
                return baseUsuarios.Filmes.ToList();
            });

            app.MapGet("/locacoes", (BaseUsuarios baseUsuarios) =>
            {
                return baseUsuarios.Locacoes.ToList();
            });

            //listar especifico (por nome)
            app.MapGet("/cliente/{id}", (BaseUsuarios baseUsuarios, int id) =>
            {
                return baseUsuarios.Clientes.Find(id);
            });

            app.MapGet("/filme/{id}", (BaseUsuarios baseUsuarios, int id) =>
            {
                return baseUsuarios.Filmes.Find(id);
            });

            //listar especifico (por Id)
            app.MapGet("/locacao/{id}", (BaseUsuarios baseUsuarios, int id) =>
            {
                return baseUsuarios.Locacoes.Find(id);
            });

            //cadastrar
            app.MapPost("/cadastrarC", (BaseUsuarios baseUsuarios, Cliente cliente) =>
            {
                if(baseUsuarios.Clientes.Where(u => u.cpf == cliente.cpf).Count() > 0){
                    return "Usuario ja cadastrado";
                }
                baseUsuarios.Clientes.Add(cliente);
                baseUsuarios.SaveChanges();
                return "Cliente adicionado";
            });

            app.MapPost("/cadastrarF", (BaseUsuarios baseUsuarios, Filme filme) =>
            {
                if(baseUsuarios.Filmes.Where(u => u.nome == filme.nome).Count() > 0){
                    return "Filme ja cadastrado";
                }
                baseUsuarios.Filmes.Add(filme);
                baseUsuarios.SaveChanges();
                return "Filme adicionado";
            });


            app.MapPost("/cadastrarL", (BaseUsuarios baseUsuarios, Locacao locacao) =>
            {

                var filme = baseUsuarios.Filmes.Find(locacao.idF);
                var cliente = baseUsuarios.Clientes.Find(locacao.idC);

                if (filme == null)
                {
                    return "Filme inexistente";
                }

                if (cliente == null)
                {
                    return "Cliente inexistente";
                }

                if (cliente.idade < filme.classificacao)
                {
                    return "Idade insuficiente";
                }
                if (cliente.bonus == 0)
                {
                    locacao.preco = filme.preco;
                }
                if (cliente.bonus <= 10)
                {
                    double precofinal = filme.preco - filme.preco * (cliente.bonus / 10);

                    locacao.preco = precofinal;

                    cliente.bonus++;
                }
                else
                {
                    cliente.bonus = 0;
                }

                if ((locacao.dataD > DateTime.Now) && (locacao.dataL < DateTime.Now))
                {
                    locacao.status = "Alugado";
                }
                else
                {
                    locacao.status = "Devolvido";
                }

                baseUsuarios.Locacoes.Add(locacao);
                baseUsuarios.SaveChanges();
                return "Locação adicionada";
            });

            //atualizar 
            app.MapPost("/atualizarC/{id}", (BaseUsuarios baseUsuarios, Cliente clienteAtualizado, int id) =>
            {
                if (clienteAtualizado.id != id)
                {
                    return ("Cliente não existente");
                }

                var cliente = baseUsuarios.Clientes.Find(id);
                cliente.nome = clienteAtualizado.nome;
                cliente.cpf = clienteAtualizado.cpf;
                cliente.idade = clienteAtualizado.idade;
                cliente.endereco = clienteAtualizado.endereco;
                baseUsuarios.SaveChanges();
                return "Cliente atualizado";
            });

            app.MapPost("/atualizarF/{id}", (BaseUsuarios baseUsuarios, Filme filmeAtualizado, int id) =>
             {
                 if (filmeAtualizado.id != id)
                 {
                     return ("Filme não encontrado");
                 }
                 var filme = baseUsuarios.Filmes.Find(id);
                 filme.classificacao = filmeAtualizado.classificacao;
                 filme.preco = filmeAtualizado.preco;
                 baseUsuarios.SaveChanges();
                 return "Filme atualizado";
             });

            app.MapPost("/atualizarL/{id}", (BaseUsuarios baseUsuarios, Locacao locAtualizado, int id) =>
            {
                if ((id != locAtualizado.id))
                {
                    return "Cliente não existente";
                }
                var locacao = baseUsuarios.Locacoes.Find(id);
                locacao.dataL = locAtualizado.dataL;
                locacao.dataD = locAtualizado.dataD;
                baseUsuarios.SaveChanges();
                return "Locacao atualizada";
            });

            //deletar 
            app.MapPost("/deletarC/{id}", (BaseUsuarios baseUsuarios, Cliente cl, int id) =>
            {
                if ((id == null) || (id != cl.id))
                {
                    return "Cliente não existente";
                }
                var cliente = baseUsuarios.Clientes.Find(id);
                baseUsuarios.Remove(cliente);
                baseUsuarios.SaveChanges();
                return "Cliente deletado";
            });

            app.MapPost("/deletarF/{id}", (BaseUsuarios baseUsuarios, Filme fil, int id) =>
            {
                if ((id == null) || (id != fil.id))
                {
                    return "Filme não existente";
                }
                var filme = baseUsuarios.Filmes.Find(id);
                baseUsuarios.Remove(filme);
                baseUsuarios.SaveChanges();
                return "Filme deletado";
            });

            app.Run("http://localhost:3000");
        }
    }
}