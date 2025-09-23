package com.example.ProvaBiblioteca.controller;

import com.example.ProvaBiblioteca.model.BibliotecarioModel;
import com.example.ProvaBiblioteca.servicer.BibliotecaServicer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("api/bibliotecario")
public class BilbliotecaController {

    @Autowired
    private BibliotecaServicer BibliotecaServicer;

    @GetMapping
    public List<BibliotecarioModel> listar() {
        return BibliotecaServicer.listar();
    }

    @PostMapping
    public BibliotecarioModel salvar(@RequestBody BibliotecarioModel biblioteca) {
        return BibliotecaServicer.salvar(biblioteca);
    }

    @PutMapping("/{id}")
    public BibliotecarioModel atualizar(@PathVariable Long id, @RequestBody BibliotecarioModel biblioteca) {
        return BibliotecaServicer.atualizar(id, biblioteca);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        BibliotecaServicer.deletar(id);
    }
}
