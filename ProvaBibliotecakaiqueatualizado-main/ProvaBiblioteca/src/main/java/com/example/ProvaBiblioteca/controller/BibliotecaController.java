package com.example.ProvaBiblioteca.controller;

import com.example.ProvaBiblioteca.model.BibliotecarioModel;
import com.example.ProvaBiblioteca.servicer.BibliotecaServicer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bibliotecario")
public class BibliotecaController {

    @Autowired
    private BibliotecaServicer bibliotecaServicer;

    @GetMapping
    public List<BibliotecarioModel> listar() {
        return bibliotecaServicer.listar();
    }

    @GetMapping("/{id}")
    public BibliotecarioModel buscarPorId(@PathVariable Long id) {
        return bibliotecaServicer.listar()
                .stream()
                .filter(b -> b.getId().equals(id))
                .findFirst()
                .orElse(null);
    }

    @PostMapping
    public BibliotecarioModel salvar(@RequestBody BibliotecarioModel bibliotecario) {
        return bibliotecaServicer.salvar(bibliotecario);
    }

    @PutMapping("/{id}")
    public BibliotecarioModel atualizar(@PathVariable Long id, @RequestBody BibliotecarioModel bibliotecario) {
        return bibliotecaServicer.atualizar(id, bibliotecario);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        bibliotecaServicer.deletar(id);
    }
}
