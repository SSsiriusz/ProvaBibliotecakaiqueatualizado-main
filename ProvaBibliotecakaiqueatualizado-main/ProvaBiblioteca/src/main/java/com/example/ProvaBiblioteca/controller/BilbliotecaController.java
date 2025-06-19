package com.example.ProvaBiblioteca.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ProvaBiblioteca.servicer.BibliotecaServicer;
import com.example.ProvaBiblioteca.model.BibliotecarioModel;



import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;



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
