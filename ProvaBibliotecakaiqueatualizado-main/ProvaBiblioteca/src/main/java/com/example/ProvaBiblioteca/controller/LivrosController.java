package com.example.ProvaBiblioteca.controller;

import com.example.ProvaBiblioteca.model.LivrosModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.ProvaBiblioteca.servicer.LivrosService;
import com.example.ProvaBiblioteca.repository.BibliotecaRepository;
import com.example.ProvaBiblioteca.repository.LivrosRepository;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("api/livros")
public class LivrosController {
    private final LivrosService livrosService;

    public LivrosController(LivrosRepository livrosRepository, BibliotecaRepository bibliotecarioRepository) {
        this.livrosService = new LivrosService(livrosRepository);
    }

    @PostMapping
    public ResponseEntity<LivrosModel> cadastrar(@RequestBody LivrosModel livro) {
        return ResponseEntity.ok(livrosService.cadastrar(livro));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LivrosModel> editar(@PathVariable Long id, @RequestBody LivrosModel livro) {
        return livrosService.buscarPorId(id)
                .map(l -> ResponseEntity.ok(livrosService.editar(id, livro)))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        if (livrosService.buscarPorId(id).isPresent()) {
            livrosService.excluir(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<LivrosModel>> listar() {
        return ResponseEntity.ok(livrosService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LivrosModel> buscarPorId(@PathVariable Long id) {
        return livrosService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<LivrosModel> alterarStatus(@PathVariable Long id, @RequestParam String status) {
        return livrosService.buscarPorId(id)
                .map(l -> ResponseEntity.ok(livrosService.alterarStatus(id, status)))
                .orElse(ResponseEntity.notFound().build());
    }
}
