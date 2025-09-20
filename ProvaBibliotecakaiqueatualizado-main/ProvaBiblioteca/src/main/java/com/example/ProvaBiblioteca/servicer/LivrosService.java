package com.example.ProvaBiblioteca.servicer;

import com.example.ProvaBiblioteca.model.LivrosModel;
import com.example.ProvaBiblioteca.repository.LivrosRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class LivrosService {

    private final LivrosRepository livrosRepository;

    public LivrosService(LivrosRepository livrosRepository) {
        this.livrosRepository = livrosRepository;
    }

    public LivrosModel cadastrar(LivrosModel livro) {
        validarCamposObrigatorios(livro);
        livro.setStatus("Disponível");
        livro.setDataCadastro(LocalDate.now());
        return livrosRepository.save(livro);
    }

    public LivrosModel editar(Long id, LivrosModel livro) {
        validarCamposObrigatorios(livro);
        LivrosModel existente = livrosRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Livro não encontrado"));
        livro.setId(id);
        livro.setDataCadastro(existente.getDataCadastro());
        return livrosRepository.save(livro);
    }

    public void excluir(Long id) {
        livrosRepository.deleteById(id);
    }

    public List<LivrosModel> listar() {
        return livrosRepository.findAll();
    }

    public Optional<LivrosModel> buscarPorId(Long id) {
        return livrosRepository.findById(id);
    }

    public LivrosModel alterarStatus(Long id, String status) {
        LivrosModel livro = livrosRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Livro não encontrado"));
        livro.setStatus(status);
        return livrosRepository.save(livro);
    }

    private void validarCamposObrigatorios(LivrosModel livro) {
        if (livro.getBibliotecario() == null ||
            livro.getTitulo() == null || livro.getTitulo().isBlank() ||
            livro.getAutor() == null || livro.getAutor().isBlank() ||
            livro.getGenero() == null || livro.getGenero().isBlank()) {
            throw new RuntimeException("Todos os campos são obrigatórios.");
        }
    }
}
