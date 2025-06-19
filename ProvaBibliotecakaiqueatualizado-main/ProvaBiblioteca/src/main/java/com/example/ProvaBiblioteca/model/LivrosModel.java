package com.example.ProvaBiblioteca.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "livro_model")
public class LivrosModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "bibliotecario_id")
    private BibliotecarioModel bibliotecario;

    @Column(nullable = false)
    private String titulo;

    @Column(nullable = false)
    private String autor;

    @Column(nullable = false)
    private String genero;

    @Column(nullable = false)
    private String status = "Disponível";

    @Column(nullable = false)
    private LocalDate dataCadastro;

    // getters e setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public BibliotecarioModel getBibliotecario() { return bibliotecario; }
    public void setBibliotecario(BibliotecarioModel bibliotecario) { this.bibliotecario = bibliotecario; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getAutor() { return autor; }
    public void setAutor(String autor) { this.autor = autor; }

    public String getGenero() { return genero; }
    public void setGenero(String genero) { this.genero = genero; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getDataCadastro() { return dataCadastro; }
    public void setDataCadastro(LocalDate dataCadastro) { this.dataCadastro = dataCadastro; }
}
